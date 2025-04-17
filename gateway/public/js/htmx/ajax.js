/**
 * Executes an HTMX AJAX request with enhanced response handling.
 *
 * - Does not break HTMX default behavior (`target`, `swap`, etc. will still work).
 * - If the server returns `X-Status` or `X-StatusText` headers, an error is thrown.
 * - If the response is `application/json`, it will be parsed and returned.
 * - If the response is plain text or HTML, `null` will be returned.
 * - Checks if the response status is OK (`response.ok`) and handles errors accordingly.
 *
 * @param {string} method - HTTP request method (e.g., `"GET"`, `"POST"`).
 * @param {string} url - The URL to which the request is sent.
 * @param {object} [opts={}] - Additional HTMX options (e.g., `target`, `swap`, `values`, `headers`).
 * @param {string} [opts.target] - CSS selector of the element to update with the response.
 * @param {string} [opts.swap] - How the response should be swapped into the DOM.
 * @param {object} [opts.values] - Key-value pairs to send with the request.
 * @param {object} [opts.headers] - Custom HTTP headers to include in the request.
 *
 * @returns {Promise<object|null>} Resolves with parsed JSON or `null` if the response is not JSON.
 *
 * @throws {Error} If the server returns an error header (`X-Status` or `X-StatusText`), or if `response.ok` is false, or JSON parsing fails.
 */
export async function ajax(method, url, opts = {}) {
    return new Promise((resolve, reject) => {
        htmx.ajax(method, url, {
            ...opts,
            handler: function (elt, info) {
                const { xhr } = info;
                const contentType = xhr.getResponseHeader('Content-Type') || '';
                const status = xhr.getResponseHeader('X-Error-Code');
                const message = xhr.getResponseHeader('X-Error-Message');

                console.log('xhr', xhr, status, message, elt);

                if (status || message) {
                    htmx.handleAjaxResponse(elt, info);
                    const statusDec = status ? atob(status) : 500;
                    const messageDec = message
                        ? atob(message)
                        : 'Unknown error ocurred';
                    reject(new Error(`${statusDec}: ${messageDec}`));
                    return false;
                }

                if (!xhr.status.toString().startsWith('2')) {
                    htmx.handleAjaxResponse(elt, info);
                    reject(new Error(`${xhr.status}: ${xhr.statusText}`));
                    return false;
                }

                if (contentType.includes('application/json')) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    htmx.handleAjaxResponse(elt, info);
                    resolve(null);
                }

                return false;
            },
        });
    });
}

document.addEventListener('hey', console.log);
