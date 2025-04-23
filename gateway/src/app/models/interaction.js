/**
 * @typedef {Object} StatItem
 * @property {number} postId
 * @property {number} likesCount
 * @property {number} bookmarksCount
 * @property {number} commentsCount
 * @property {number} viewsCount
 */

/**
 * @typedef {Object} BatchInteractions
 * @property {StatItem[]} stats
 */

/**
 * @typedef {Object} StatesItem
 * @property {string} postId
 * @property {boolean} liked
 * @property {boolean} saved
 * @property {string|null} collectionId
 */

/**
 * @typedef {Object} PostInteractionStates
 * @property {StatesItem[]} states
 */

export {};
