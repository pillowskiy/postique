/** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/

declare namespace render {
    export type Variable = string | number | boolean | null | undefined;
    export interface Templates {
        'auth/auth.container': {
            __formChild: Variable;
        };
        'auth/login/form-errors.oob': {
            errors: { email: Variable; password: Variable };
        };
        'auth/login/form': {
            csrfToken: Variable;
        };
        'auth/login/page': {};
        'auth/register/form-errors.oob': {
            errors: {
                username: Variable;
                email: Variable;
                password: Variable;
                passwordConfirm: Variable;
            };
        };
        'auth/register/form': {
            csrfToken: Variable;
        };
        'auth/register/page': {};
        'bookmark/bookmark-detailed-list.partial': {};
        'bookmark/bookmark-popup.oob': {
            targetId: Variable;
        };
        'bookmark/partials/bookmarks-view.partial': {
            bookmarks: Array;
        };
        'collection/collection-detailed-list.partial': {
            collections: Array;
        };
        'collection/collection-menu-list.partial': {
            collections: Array;
        };
        'collection/collection-menu-view.oob': {
            targetId: Variable;
        };
        'comment/comment-replies.loader': {};
        'comment/comment-replies.oob': {
            replies: Array;
            user: { id: Variable };
        };
        'comment/post-comments': {
            user: { username: Array };
            postId: Variable;
        };
        'comment/post-comments.loader': {
            Math: { min: Function; random: Function };
        };
        'comment/post-comments.oob': {
            comments: Array;
            user: { id: Variable };
        };
        'components/file-input': {};
        'components/header': {
            user: { username: Variable };
        };
        'components/toast.oob': {
            variant: Variable;
            initiator: Variable;
            message: Variable;
        };
        'grid-layout': {
            title: Variable;
            __renderTarget: Variable;
            user: Variable;
            locals: { user: Variable };
        };
        'home/home-page': {};
        layout: {
            title: Variable;
            __renderTarget: Variable;
        };
        'me/collections/collections-page': {};
        'me/collections/partials/collection-view.partial': {
            collections: Array;
        };
        'me/collections/partials/history-view.partial': {
            posts: Array;
        };
        'me/collections/partials/watchlist-view.partial': {
            posts: Array;
        };
        'me/notifications/notifications-page': {};
        'me/posts/components/post-archived-card': {};
        'me/posts/components/post-draft-list': {
            posts: Array;
        };
        'me/posts/components/post-published-card': {};
        'me/posts/posts-list.partial': {
            posts: Array;
            __postList: Variable;
            status: Variable;
        };
        'me/posts/posts-page': {
            draftCount: Variable;
            posts: Array;
        };
        'me/recommendations/partials/author-blacklist-view': {};
        'me/recommendations/partials/explain-current-view.partial': {};
        'me/recommendations/partials/post-blacklist-view': {};
        'me/recommendations/partials/preferences-view.partial': {};
        'me/recommendations/recommendations-page': {};
        'pages/login-errors.oob': {
            errors: { email: Variable; password: Variable };
        };
        'pages/login': {};
        'partials/head': {};
        'partials/toasts': {};
        'post/components/posts-interaction.oob': {
            stats: Array;
        };
        'post/components/posts-states.oob': {
            states: Array;
        };
        'post/components/posts-stats.oob': {
            stats: Array;
        };
        'post/partials/posts-view.partial': {
            JSON: { stringify: Function };
            user: Variable;
            __postListTemplate: Variable;
        };
        'post/post-aside-card-list.swap': {
            posts: Array;
        };
        'post/post-bookmark-list': {
            posts: Array;
        };
        'post/post-detailed-list': {
            posts: Array;
        };
        'post/post-history-list': {
            posts: Array;
        };
        'post/post-page': {
            JSON: { stringify: Function };
            user: Variable;
            post: {
                title: Variable;
                description: Variable;
                'post.owner': { username: Array; id: Variable };
                publishedAt: Variable;
                id: Variable;
            };
            'post.owner': { username: Array; id: Variable };
            renderer: { raw: Function };
        };
        'post/post-watch-list': {
            posts: Array;
        };
        'shared/error': {
            status: Variable;
            message: Variable;
        };
        'user/collections/collection-page': {
            collection: {
                bookmarksCount: Variable;
                'collection.author': { username: Array };
                createdAt: Variable;
                name: Variable;
                description: Variable;
                id: Variable;
            };
            'collection.author': { username: Array };
        };
        'workbench/components/workbench-header': {
            user: { username: Variable };
        };
        'workbench/components/workbench-publish-dialog': {};
        'workbench/workbench-layout': {
            __renderTarget: Variable;
        };
        'workbench/workbench-page': {};
    }
}

/** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/
