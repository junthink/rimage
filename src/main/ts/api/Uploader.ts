import { File, FileList, document, FileReader } from '@ephox/dom-globals';

export class Uploader {
    /** 选择文件 */
    public selectFile(accept = 'image/*', multiple = true): Promise<File | FileList> {
        return new Promise<File | FileList>((resolve: any) => {
            const inputEl = document.createElement('input');
            inputEl.accept = accept;
            inputEl.multiple = multiple;
            inputEl.type = 'file';
            inputEl.accept = accept;
            inputEl.onchange = function () {
                resolve(multiple ? inputEl.files : (inputEl.files as FileList)[0]);
            };
            inputEl.click();
        });
    }

    /** 文件转换为base64 */
    public convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
    /**获取多张base64图片 */
    public async selectBase64Images(maxsize?: number): Promise<string[]> {
        const files: FileList = await this.selectFile('images/*', false) as FileList;
        const base64es = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            const base64 = await this.convertFileToBase64(file);
            base64es.push(base64);
        }
        return base64es;
    }
}