import { windowDynamicParam } from '../../utils/router.js';
import { showStatusErrorState, statusState } from '../state.js';

let deltaStore = [];
export const deltaChangeEvent = {
    name: 'debounce-change',
    async handler(quill, changes) {
        statusState.set('saving');
        try {
            const postId = windowDynamicParam('postId', '/p/:postId/edit');

            if (!postId) {
                const titleNode = quill.root.querySelector('[data-title]');
                let title = 'Нова публікація';
                let description = '';
                const coverImage = quill.root.querySelector('img')?.src ?? '';

                if (titleNode) {
                    title = titleNode.textContent;
                    description = titleNode.nextElementSibling?.textContent;
                }

                const data = await htmx.__.ajax('POST', '/p', {
                    values: {
                        title,
                        description:
                            description.length > 256
                                ? description.slice(0, 256) + '...'
                                : description,
                        coverImage,
                    },
                });

                if (!data?.postId) {
                    return;
                }

                window.history.replaceState(
                    { postId: data.postId },
                    '',
                    `/p/${data.postId}/edit`,
                );
                return saveDeltaWithAdditionalStore(data.postId, changes);
            }

            return saveDeltaWithAdditionalStore(postId, changes);
        } catch (err) {
            showStatusErrorState();
            throw err;
        }
    },
};

async function saveDeltaWithAdditionalStore(postId, changes) {
    return saveDelta(postId, deltaStore.concat(changes))
        .then(() => {
            deltaStore = [];
            setTimeout(() => statusState.set('draft'), 1000);
        })
        .catch((err) => {
            deltaStore.push(...changes);
            throw err;
        });
}

async function saveDelta(postId, changes) {
    return htmx.__.ajax('PATCH', `/p/${postId}/delta`, {
        swap: 'none',
        target: document.body,
        values: { deltas: changes },
    });
}
