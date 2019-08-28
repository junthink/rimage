const { CheckerPlugin } = require('awesome-typescript-loader');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');
const swag = require('@ephox/swag');

module.exports = function(grunt) {
  var packageData = grunt.file.readJSON('package.json');
  var BUILD_VERSION = packageData.version + '-' + (process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : '0');
  const libPluginPath = 'lib/main/ts/Plugin.js';
  const scratchPluginPath = 'scratch/compiled/plugin.js';
  const scratchPluginMinPath = 'scratch/compiled/plugin.min.js';
  const tsDemoSourceFile = path.resolve('src/demo/ts/Demo.ts');
  const jsDemoDestFile = path.resolve('scratch/compiled/demo.js');


  // LiveReload的默认端口号，你也可以改成你想要的端口号
  var lrPort = 35729;
  // 使用connect-livereload模块，生成一个与LiveReload脚本
  // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
  var lrSnippet = require('connect-livereload')({

    port: lrPort

  });

  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var lrMiddleware = function (connect, options, middlwares) {
    return [
      lrSnippet,
      // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
      serveStatic(options.base[0]),
      // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
      serveIndex(options.base[0])];
  };


  grunt.initConfig({
    pkg: packageData,
    connect: {
      options: {
        // 服务器端口号
        port: 8001,
        // 服务器地址(可以使用主机名localhost，也能使用IP)
        hostname: 'localhost',
        // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
        base: '.'
      },

      livereload: {

        options: {

          // 通过LiveReload脚本，让页面重新加载。

          middleware: lrMiddleware

        }

      }

    },
    watch: {

      client: {

        // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。

        options: {

          livereload: lrPort

        },

        // '**' 表示包含所有的子目录

        // '*' 表示包含所有的文件

        files: ['scratch/compiled/demo.js']

      }

    },


    clean: {
      dirs: [ 'dist', 'scratch' ]
    },

    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      plugin: ['src/**/*.ts']
    },

    shell: {
      command: 'tsc'
    },

    rollup: {
      options: {
        treeshake: true,
        name: 'plugin',
        format: 'iife',
        banner: '(function () {',
        footer: 'plugin();})();',
        onwarn: swag.onwarn,
        plugins: [
          swag.nodeResolve({
            basedir: __dirname,
            prefixes: {}
          }),
          swag.remapImports()
        ]
      },
      plugin: {
        files: [
          {
            src: libPluginPath,
            dest: scratchPluginPath
          }
        ]
      }
    },

    uglify: {
      plugin: {
        files: [
          {
            src: scratchPluginPath,
            dest: scratchPluginMinPath
          }
        ]
      }
    },

    concat: {
      license: {
        options: {
          process: function(src) {
            var buildSuffix = process.env.BUILD_NUMBER
              ? '-' + process.env.BUILD_NUMBER
              : '';
            return src.replace(
              /@BUILD_NUMBER@/g,
              packageData.version + buildSuffix
            );
          }
        },
        // scratchPluginMinPath is used twice on purpose, all outputs will be minified for premium plugins
        files: {
          'dist/rmedia/plugin.js': [
            'src/text/license-header.js',
            scratchPluginMinPath
          ],
          'dist/rmedia/plugin.min.js': [
            'src/text/license-header.js',
            scratchPluginMinPath
          ]
        }
      }
    },

    copy: {
      css: {
        files: [
          {
            cwd: 'src/text',
            src: ['license.txt'],
            dest: 'dist/rmedia',
            expand: true
          },
          { src: ['changelog.txt'], dest: 'dist/rmedia', expand: true }
        ]
      }
    },

    webpack: {
      options: {
        mode: 'development',
        watch: true
      },
      dev: {
        entry: tsDemoSourceFile,
        devtool: 'source-map',

        resolve: {
          extensions: ['.ts', '.js']
        },

        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['source-map-loader'],
              enforce: 'pre'
            },
            {
              test: /\.ts$/,
              use: [
                {
                  loader: 'ts-loader',
                  options: {
                    transpileOnly: true,
                    experimentalWatchApi: true
                  }
                }
              ]
            }
          ]
        },

        plugins: [new LiveReloadPlugin(), new CheckerPlugin()],

        output: {
          filename: path.basename(jsDemoDestFile),
          path: path.dirname(jsDemoDestFile)
        }
      }
    }
  });

  // 加载插件
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 自定义任务
  grunt.registerTask('live', ['connect', 'watch']);
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('@ephox/swag');
  grunt.registerTask('version', 'Creates a version file', function () {
    grunt.file.write('dist/rmedia/version.txt', BUILD_VERSION);
  });
  grunt.registerTask('default', [
    'clean',
    'tslint',
    'shell',
    'rollup',
    'uglify',
    'concat',
    'copy',
    'version'
  ]);
};