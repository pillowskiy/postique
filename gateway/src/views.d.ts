/** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/

declare namespace render {
    export type Variable = string | number | boolean | null | undefined;
    export interface Templates {
        'auth/auth-container': {
            __renderChild: Variable;
        };
        'auth/login/form-errors.oob': {
            errors: { email: Variable; password: Variable };
        };
        'auth/login/form': {};
        'auth/login/page': {};
        'auth/register/form-errors.oob': {
            errors: {
                username: Variable;
                email: Variable;
                password: Variable;
                passwordConfirm: Variable;
            };
        };
        'auth/register/form': {};
        'auth/register/page': {};
        'components/toast.oob': {
            initiator: Variable;
            message: Variable;
        };
        index: {};
        layout: {
            title: Variable;
            __renderTarget: Variable;
        };
        'pages/login-errors.oob': {
            errors: { email: Variable; password: Variable };
        };
        'pages/login': {};
        'partials/head': {};
        'partials/toasts': {};
        'shared/error': {
            status: Variable;
            message: Variable;
        };
    }
}

/** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/
