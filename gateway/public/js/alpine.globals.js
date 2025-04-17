function imageUploader(config = {}) {
    return {
        isDragging: false,
        imagePreview: null,
        inputId: 'file-input-' + Math.random().toString(36).substr(2, 9),

        dragText: config.dragText || 'Перетягніть зображення сюди або',
        buttonText: config.buttonText || 'Обрати файл',
        changeText: config.changeText || 'Змінити обкладинку',
        overlayText: config.overlayText || 'Перетягніть нове зображення сюди',

        aspectRatio: config.aspectRatio || '',

        handleDrop(event) {
            this.isDragging = false;
            const files = event.dataTransfer.files;

            if (files.length > 0 && files[0].type.match('image.*')) {
                this.processFile(files[0]);
            }
        },

        handleFileSelect(event) {
            const files = event.target.files;

            if (files.length > 0) {
                this.processFile(files[0]);
            }
        },

        processFile(file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                this.imagePreview = e.target.result;
            };

            reader.readAsDataURL(file);
        },
    };
}
