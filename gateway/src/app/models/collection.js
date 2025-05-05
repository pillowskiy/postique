/**
 * @typedef {Object} CollectionIdentifier
 * @property {string} id
 */

/**
 * @typedef {Object} Collection
 * @property {string} id
 * @property {string} userId
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} DetailedCollection
 * @property {string} id
 * @property {string} userId
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {number} bookmarksCount
 * @property {import('./user').User} [author]
 */

export {};
