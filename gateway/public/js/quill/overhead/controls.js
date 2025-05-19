export function controlImageHandler(quill) {
    const container = document.querySelector('#sidebar-controls');
    if (!container) {
        return;
    }

    const uploader = quill.getModule('imageUploader');
    const trigger = document.querySelector('#ql-image');
    if (trigger) {
        trigger.addEventListener(
            'click',
            uploader.selectLocalImage.bind(uploader),
        );
    }
}
