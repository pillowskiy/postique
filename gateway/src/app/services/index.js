/**
 * Auth Service API
 * @typedef {Object} AuthService
 * @property {(dto: import("#app/dto").RegisterDTO) => Promise<void>} register
 * @property {(dto: import("#app/dto").LoginDTO) => Promise<import("#app/models").Session>} login
 * @property {(token: string) => Promise<import("#app/models").User>} verify
 * @property {(token: string) => Promise<import("#app/models").Session>} refresh
 */

/**
 * File Service API
 * @typedef {Object} FileService
 * @property {(dto: import("#app/dto").UploadFileDTO) => Promise<import("#app/models").FilePath>} upload
 * @property {(dto: import("#app/dto").DeleteFileDTO) => Promise<import("#app/models").FilePath>} delete
 */

/**
 * Post Service API
 * @typedef {Object} PostService
 * @property {(auth: string, dto: import("#app/dto").CreatePostDTO) => Promise<import("#app/models").PostIdentifier>} createPost
 * @property {(postId: string, visibility: string, auth: string) => Promise<import("#app/models").Post>} changePostVisibility
 * @property {(postId: string, auth: string) => Promise<import("#app/models").PostIdentifier>} archivePost
 * @property {(postId: string, meta: import("#app/dto").UpdatePostMetadataDTO, auth: string) => Promise<import("#app/models").Post>} publishPost
 * @property {(postId: string, auth: string) => Promise<import("#app/models").PostIdentifier>} deletePost
 * @property {(postId: string, newOwner: string, auth: string) => Promise<import("#app/models").PostIdentifier>} transferPostOwnership
 * @property {(postId: string, deltas: Array<Object>, auth: string) => Promise<import("#app/models").PostIdentifier>} deltaSave
 * @property {(auth: string|null, take: number, cursor: string|null) => Promise<import("#app/models").PostCursor>} getPosts
 * @property {(slug: string) => Promise<import("#app/models").DetailedPost>} getPost
 * @property {(id: string, auth: string) => Promise<import("#app/models").Post>} getPostInfo
 * @property {(id: string, auth: string) => Promise<import("#app/models").PostParagraph[]>} getPostDraft
 * @property {(auth: string, status: string, take: number, skip: number) => Promise<Array<import("#app/models").PostWithOwner>>} getPostsByStatus
 * @property {(auth: string|null, ids: string[]) => Promise<Array<import("#app/models").PostWithOwner>>} findBatch
 */

/**
 * Reaction Service API - Interactions
 * @typedef {Object} InteractionService
 * @property {(postIds: string[]) => Promise<import("#app/models").BatchInteractions>} findBatch
 * @property {(postIds: string[], auth: string) => Promise<import("#app/models").PostInteractionStates>} getBatchStates
 */

/**
 * Comment Service API
 * @typedef {Object} CommentService
 * @property {(postId: string, content: string, parentId: string | null, auth: string) => Promise<import("#app/models").Comment>} createComment
 * @property {(commentId: string, auth: string) => Promise<import("#app/models").CommentIdentifier>} deleteComment
 * @property {(commentId: string, content: string, auth: string) => Promise<import("#app/models").Comment>} editComment
 * @property {(postId: string, auth: string, cursor: string|null, pageSize: number|null) => Promise<import("#app/models").CommentCursor>} getPostComments
 * @property {(commentId: string, auth: string, cursor: string|null, pageSize: number|null) => Promise<import("#app/models").CommentCursor>} getCommentReplies
 */

/**
 * View Service API
 * @typedef {Object} ViewService
 * @property {(targetId: string, auth: string) => Promise<import("#app/models").View>} registerView
 * @property {(auth: string, cursor: string|null, pageSize: number|null) => Promise<import("#app/models").ViewCursor>} getUserHistory
 * @property {(auth: string) => Promise<void>} clearHistory
 * @property {(auth: string, targetId: string) => Promise<void>} removeView
 */

/**
 * Bookmark Service API
 * @typedef {Object} BookmarkService
 * @property {(auth: string, targetId: string, collectionId?: string) => Promise<import("#app/models").BookmarkIdentifier>} addBookmark
 * @property {(targetId: string, auth: string) => Promise<import("#app/models").BookmarkIdentifier>} deleteBookmark
 * @property {(userId: string, auth: string, cursor: string|null, pageSize: number|null) => Promise<import("#app/models").BookmarkCursor>} getUserBookmarks
 */

/**
 * Collection Service API
 * @typedef {Object} CollectionService
 * @property {(auth: string, name: string, description?: string) => Promise<import("#app/models").CollectionIdentifier>} createCollection
 * @property {(collectionId: string, auth: string) => Promise<import("#app/models").CollectionIdentifier>} deleteCollection
 * @property {(collectionId: string, auth: string, cursor: string|null, pageSize: number|null) => Promise<import("#app/models").BookmarkCursor>} getCollectionBookmarks
 * @property {(userId: string, auth: string) => Promise<import("#app/models").DetailedCollection[]>} getUserCollections
 */

/**
 * Like Service API
 * @typedef {Object} LikeService
 * @property {(targetId: string, auth: string) => Promise<import("#app/models").ToggleLikeResult>} toggleLike
 */

export * as grpc from './grpc/index.js';
export * as rest from './rest/index.js';
