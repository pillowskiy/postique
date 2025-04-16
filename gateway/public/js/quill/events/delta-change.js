import { windowDynamicParam } from '../../utils/router.js';

let deltaStore = [];
export const deltaChangeEvent = {
    name: 'debounce-change',
    handler: async function (quill, changes) {
        let postId = windowDynamicParam('postId', '/p/:postId/edit');

        if (!postId) {
            const title =
                quill.root.querySelector('[data-title]')?.textContent ||
                'Untitled story';

            const data = await htmx.__.ajax('POST', '/p', {
                values: { title },
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
    },
};

async function saveDeltaWithAdditionalStore(postId, changes) {
    return saveDelta(postId, deltaStore.concat(changes))
        .then(() => {
            deltaStore = [];
        })
        .catch(() => {
            deltaStore.push(...changes);
        });
}

async function saveDelta(postId, changes) {
    return htmx.__.ajax('PATCH', `/p/${postId}/delta`, {
        swap: 'none',
        target: document.body,
        values: { deltas: changes },
    });
}
