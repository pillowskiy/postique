/**
 * @typedef {Object} BookmarkIdentifier
 * @property {string} id
 */

/**
 * @typedef {Object} Bookmark
 * @property {string} id
 * @property {string} userId
 * @property {string} targetId
 * @property {string} [collectionId]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} DetailedBookmark
 * @property {string} id
 * @property {string} userId
 * @property {string} targetId
 * @property {import('./post').PartialPost} post
 * @property {string} [collectionId]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} BookmarkCursor
 * @property {DetailedBookmark[]} items
 * @property {string|Date|null} cursorField
 * @property {number} size
 */

export {};
