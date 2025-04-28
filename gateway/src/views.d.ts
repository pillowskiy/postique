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
        'bookmark/bookmark-popup.oob': {
            targetId: Variable;
        };
        'bookmark/collection-list.oob': {
            targetId: Variable;
            collections: Array;
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
            locals: { user: Variable };
        };
        'home/home-page': {
            JSON: { stringify: Function };
            user: Variable;
        };
        layout: {
            title: Variable;
            __renderTarget: Variable;
        };
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
        'post/post-aside-card-list.swap': {
            posts: Array;
        };
        'post/post-detailed-list': {
            posts: Array;
        };
        'post/post-page': {
            JSON: { stringify: Function };
            user: Variable;
            post: {
                title: Variable;
                description: Variable;
                'post.owner': { username: Array };
                publishedAt: Variable;
                id: Variable;
            };
            'post.owner': { username: Array };
            renderer: { raw: Function };
        };
        'shared/error': {
            status: Variable;
            message: Variable;
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
