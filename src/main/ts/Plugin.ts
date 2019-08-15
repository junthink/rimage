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
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    uploader.convertFileToBase64(file).then(function (v) {
                        const imageId = `image-${Math.round(Math.random() * 100000000)}`;
                        editor.insertContent(`<p style="text-align: center;"><img id="${imageId}" src="${v}" /></p>`);
                        const form = new FormData();
                        form.append('upload_file', file);
                        request({
                            url: '/upload',
                            method: 'post',
                            data: form
                        }).then((resData) => {
                            console.log('==============');
                            const image =  editor.dom.get(imageId);
                            image.src = resData.data.image_url;
                            image.setAttrib('author','rongcat');
                        }).catch((err) => {
                            console.log(err);
                        });
                    });
                }
            });
        }
    });
};

tinymce.PluginManager.add('rimage', setup);

// tslint:disable-next-line:no-empty
export default () => {};