import Plugin from '../../main/ts/Plugin';
import axios from 'axios';

declare let tinymce: any;

Plugin();

const service = axios.create({
    baseURL: 'https://api1.rongcat.com',
    timeout: 90000,
    headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkxLnJvbmdjYXQuY29tXC9hdXRoXC9hZG1pbiIsImlhdCI6MTU2NjU0NzkyNiwiZXhwIjoxNTY2OTc5OTI2LCJuYmYiOjE1NjY1NDc5MjYsImp0aSI6IkVDblZvaTRsUHZiR2NmeFAiLCJzdWIiOjI0LCJwcnYiOiJjNDFkNmY0ZjZlMmExOWUyOTRiYWQ1YWI3OGU2YTY3Mzg0NjdmNWJkIn0.r1f4vfuGVttRab5rS4xXO4HMeriIZduOwE3sDeEG-ak' }
});

tinymce.init({
    selector: 'textarea.tinymce',
    plugins: 'code rimage',
    toolbar: 'rimage',
    request: service
});
