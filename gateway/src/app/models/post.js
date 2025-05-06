/**
 * @typedef {Object} PostMarkup
 * @property {number} type
 * @property {number} start
 * @property {number} end
 * @property {string} [href]
 */

/**
 * @typedef {Object} ImageMetadata
 * @property {string} src
 * @property {number} originalWidth
 * @property {number} originalHeight
 */

/**
 * @typedef {Object} CodeMetadata
 * @property {string} language
 * @property {boolean} spellcheck
 */

/**
 * @typedef {Object} PostParagraph
 * @property {string} name
 * @property {number} type
 * @property {string} text
 * @property {PostMarkup[]} markups
 * @property {ImageMetadata} [metadata]
 * @property {CodeMetadata} [codeMetadata]
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} visibility
 * @property {string} owner
 * @property {string[]} authors
 * @property {string|null} coverImage
 * @property {string} slug
 * @property {string} status
 * @property {Date|null} publishedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Represents a partial view of a post, used in services other than the post service itself.
 * Initially populated with minimal data (e.g., post ID), it can be enriched later via batch fetching.
 * If the post service is unavailable, this model provides a fallback using cached user, post metadata or "unknown" results.
 * Since this model is read-only, data freshness is not critical.
 * @typedef {Object} FallbackPostView
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {import('#app/models/user').User} owner
 * @property {string|null} coverImage
 * @property {string} slug
 */

/**
 * @typedef {Object} PostWithOwner
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} visibility
 * @property {import('#app/models/user').User} owner
 * @property {string[]} authors
 * @property {string|null} coverImage
 * @property {string} slug
 * @property {string} status
 * @property {Date|null} publishedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * TEMP: We don't have a detailed post, content is a separate entity
 * Should be refactored in the future
 * @typedef {Object} DetailedPost
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} visibility
 * @property {import('#app/models/user').User} owner
 * @property {string[]} authors
 * @property {string|null} coverImage
 * @property {string} slug
 * @property {string} status
 * @property {Date|null} publishedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {PostParagraph[]} paragraphs
 */

/**
 * @typedef {Object} PostIdentifier
 * @property {string} postId
 */

/**
 * @typedef {Object} PostCursor
 * @property {PostWithOwner[]} items
 * @property {string|Date|null} cursorField
 * @property {number} size
 */

/**
 * @typedef {Object} PartialPost
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string|null} coverImage
 */

export {};
