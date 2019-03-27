declare const tinymce: any;

import Buttons from './ui/Buttons';

tinymce.PluginManager.add('rimage', function (editor) {
    Buttons.register(editor);
});

export default function () { }
