/**
 * @typedef {Object} View
 * @property {string|null} userId
 * @property {string} targetId
 * @property {number} readPercentage
 * @property {number} readingTime
 * @property {Date} createdAt
 * @property {string} [referrer]
 * @property {string} [userAgent]
 */

/**
 * @typedef {Object} ViewCursor
 * @property {View[]} items
 * @property {string|Date|null} cursorField
 * @property {number} size
 */

export {};
