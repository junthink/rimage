import Plugin from '../../main/ts/Plugin';
import axios from 'axios';

declare let tinymce: any;

Plugin();

tinymce.init({
    selector: 'textarea.tinymce',
    plugins: 'code rimage',
    toolbar: 'rimage',
    request: axios
});
