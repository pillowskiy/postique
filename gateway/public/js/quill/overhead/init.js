import { windowDynamicParam } from '../../utils/router.js';
import { DeltaApplier } from '../modules/index.js';
import { postState, statusState, updateStatusText } from '../state.js';

export function Init(quill) {
    async function handleQuill() {
        const postId = windowDynamicParam('postId', '/p/:postId/edit');
        if (postId === postState.get()?.id) {
            return;
        }

        const contents = await getQuillContents(postId);
        quill.setContents(contents, 'silent');
        quill.deltaApplier.updatePreviousParagraphs();
        updateStatusText();

        if (postId) {
            const post = await getPostInfo(postId);
            postState.set(post);
        }

        statusState.set('draft');
    }

    onPathChange(handleQuill);
}

async function getPostInfo(postId) {
    return htmx.__.ajax('GET', `/p/${postId}/info`, {
        swap: 'none',
    });
}

async function getQuillContents(postId) {
    if (!postId) {
        return emptyQuillContents();
    }

    const paragraphs = await htmx.__.ajax('GET', `/p/${postId}/draft`, {
        swap: 'none',
    });
    if (!paragraphs) {
        return emptyQuillContents();
    }

    return DeltaApplier.parser.parse(paragraphs);
}

function emptyQuillContents() {
    return [
        {
            insert: '\n',
            attributes: {
                postTitle: { placeholder: 'Tell your story' },
            },
        },
        {
            insert: '\n',
            attributes: {},
        },
    ];
}

function onPathChange(callback) {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const triggerCallback = () => {
        callback(window.location.pathname);
    };

    window.history.pushState = function (...args) {
        originalPushState.apply(this, args);
        triggerCallback();
    };

    window.history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        triggerCallback();
    };

    window.addEventListener('popstate', triggerCallback);
    triggerCallback();

    return () => {
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
        window.removeEventListener('popstate', triggerCallback);
    };
}
