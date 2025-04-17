import { windowDynamicParam } from '../utils/router.js';
import { createSignal } from '../utils/signal.js';

export const postState = createSignal(null);
export const statusState = createSignal('empty');
export const statusTextState = createSignal('Робоча область активна');
const initialPublishButtonState = {
    disabled: true,
    textContent: 'Публікувати',
};
export const publishButtonState = createSignal(initialPublishButtonState);

/**
 * @param {string} text
 */
export function updateStatusText(text = '') {
    const postId = windowDynamicParam('postId', '/p/:postId/edit');
    if (!text) {
        if (postId) {
            statusTextState.set(
                `${statusState.get() === 'draft' ? 'Чернетка в' : 'Публікація в'} ${window.postique?.user?.username ?? 'Невідомо'}`,
            );
        } else {
            statusTextState.set('Робоча область активна');
        }
        return;
    }

    statusTextState.set(text);
}

export function showStatusErrorState() {
    statusState.set('error');

    setTimeout(() => {
        const postId = windowDynamicParam('postId', '/p/:postId/edit');
        statusState.set(postId ? 'draft' : 'empty');
    }, 5000);
}

statusState.subscribe((state) => {
    const statusState = document.getElementById('workbench-status-state');
    if (!statusState) {
        throw new Error('Cannot find status state element');
    }

    statusState.removeAttribute('data-danger');
    const btnState = publishButtonState.get();

    if (state === 'draft') {
        statusState.textContent = 'Збережено';
        btnState.disabled = false;
    } else if (state === 'saving') {
        statusState.textContent = 'Зберігаємо...';
        btnState.disabled = true;
    } else if (state === 'publishing') {
        statusState.textContent = 'Публікуємо...';
        btnState.textContent = 'Публікуємо...';
        btnState.disabled = true;
    } else if (state === 'error') {
        statusState.textContent = 'Помилка';
        statusState.setAttribute('data-danger', '');
        btnState.disabled = false;
    } else if (state === 'published') {
        btnState.disabled = true;
        statusState.textContent = 'Опубліковано';
    } else if (state === 'empty') {
        statusState.textContent = '';
        btnState.disabled = true;
    }

    publishButtonState.set(btnState);
});

statusTextState.subscribe((text) => {
    const statusText = document.getElementById('workbench-status-text');
    if (!statusText) {
        throw new Error('Cannot find status text element');
    }

    statusText.textContent = text;
});

publishButtonState.subscribe((state) => {
    const btn = document.getElementById('publish-button');
    if (!btn) {
        throw new Error('Cannot find publish button element');
    }

    btn.disabled = state.disabled;
    btn.textContent = state.textContent;
});
