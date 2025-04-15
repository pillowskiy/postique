import { matchPath } from '../../utils/router.js';

let deltaStore = [];
export const deltaChangeEvent = {
    name: 'debounce-change',
    handler: async function (quill, changes) {
        let postId =
            window.history.state?.postId ??
            matchPath('/p/:postId/edit', window.location.pathname)?.postId ??
            null;

        if (!postId) {
            const title = quill.root.querySelector('[data-title]')?.textContent;
            console.log('title is', title);
            if (!title || title.length < 5) {
                deltaStore.push(...changes);
                return;
            }

            const data = await fetch('/p', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                }),
            }).then(async (res) => {
                if (res.headers.get('content-type')?.includes('text/html')) {
                    console.log('Applying text content');
                    const text = await res.text();
                    const fragment = document
                        .createRange()
                        .createContextualFragment(text);
                    htmx.process(fragment);
                    return;
                }

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(
                        `Failed to create post: ${JSON.stringify(data, null, 2)}`,
                    );
                }

                return data;
            });

            postId = data.postId;

            window.history.replaceState({ postId }, '', `/p/${postId}/edit`);
        }

        if (!postId) {
            throw new Error('Invalid post ID');
        }

        await fetch(`/p/${postId}/delta`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deltas: deltaStore.concat(changes),
            }),
        });
        deltaStore = [];

        console.log('postId', postId, changes);
    },
};
