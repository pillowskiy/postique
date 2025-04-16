/**
 *
 * @param {string} paramName
 * @param {string} pattern
 * @returns {string|null}
 */
export function windowDynamicParam(paramName, pattern) {
    return (
        window.history.state?.[paramName] ??
        matchPath(pattern, window.location.pathname)?.[paramName] ??
        null
    );
}

/**
 * @param {string} pattern
 * @param {string} actualPath
 * @returns {Object}
 */
export function matchPath(pattern, actualPath) {
    const paramNames = [];
    const regexPath = pattern.replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
    });
    const regex = new RegExp(`^${regexPath}$`);
    const match = actualPath.match(regex);

    if (!match) return {};

    const params = {};
    paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1]);
    });
    return params;
}
