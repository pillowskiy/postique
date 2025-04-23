/**
 * @typedef {Object} CommentIdentifier
 * @property {string} id
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} userId
 * @property {string} postId
 * @property {string} content
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string} [parentId]
 */

/**
 * @typedef {Object} DetailedComment
 * @property {string} id
 * @property {string} userId
 * @property {string} postId
 * @property {string} content
 * @property {import('./user').User} author
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string} [parentId]
 */

/**
 * @typedef {Object} EditedComment
 * @property {string} id
 * @property {string} content
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} CommentCursor
 * @property {DetailedComment[]} items
 * @property {string|Date|null} cursorField
 * @property {number} size
 */

export {};
