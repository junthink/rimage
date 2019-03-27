import {Uploader} from '../api/Uploader';
import {console, FormData} from '@ephox/dom-globals';

const register = function (editor) {
    editor.ui.registry.addButton('rimage', {
        icon: 'image',
        onAction: () => {
            const request = editor.getParam('request');
            const uploader = new Uploader();
            uploader.selectFile().then(function (files) {
                for (const file of files) {
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
                            const image =  editor.dom.get(imageId);
                            image.src = resData.data.data.image_url;
                        }).catch((err) => {
                            console.log(err);
                        });
                    });
                }
            });
        }
    });
};

export default {
    register
};