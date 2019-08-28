declare const tinymce: any;
import {Uploader} from './api/Uploader';
import {FormData} from '@ephox/dom-globals';

const setup = (editor, url) => {
    editor.ui.registry.addButton('rimage', {
        icon: 'image',
        onAction: () => {
            const request = editor.getParam('request');
            const uploader = new Uploader();
            uploader.selectFile().then(function (files) {
                let content = '';
                let images = {};
                for (let i = 0; i < files.length; i++) {
                    const imageId = `image-${Math.round(Math.random() * 10000000)}`;
                    content += `<p id="${imageId}-box" style="margin: 0; padding: 0;"></p>`;
                    images[i] = imageId;
                }
                editor.insertContent(content);
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    uploader.convertFileToBase64(file).then(function (v) {
                        let imageBox = editor.dom.get(images[i] + '-box');
                        imageBox.innerHTML = `<img id="${images[i]}" src="${v}" style="margin: 0; padding: 0;" />`;
                        const form = new FormData();
                        form.append('upload_file', file);
                        form.append('upload_custom', JSON.stringify({watermark: 'default'}));
                        request({
                            url: '/upload',
                            method: 'post',
                            data: form
                        }).then((resData) => {
                            let newImageBox = editor.dom.get(images[i] + '-box');
                            let image = editor.dom.get(images[i]);
                            editor.dom.remove(image);
                            let src = resData.data.image_url;
                            newImageBox.innerHTML = `<img id="${images[i]}" src="${src}" style="margin: 0; padding: 0;" />`;
                        }).catch((err) => {
                        });
                    });
                }
            });
        }
    });
};

tinymce.PluginManager.add('rimage', setup);

// tslint:disable-next-line:no-empty
export default () => {
};