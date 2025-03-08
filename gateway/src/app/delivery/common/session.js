/**
 * @param {import('express').Response} res
 * @param {import('#app/models').Session} session
 */
export function storeSession(res, session) {
    res.cookie('access_token', session.accessToken, {
        httpOnly: true,
        maxAge: session.expiresIn * 1000,
        path: '/',
        sameSite: 'strict',
        secure: true,
    });

    res.cookie('refresh_token', session.refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: true,
    });
}
