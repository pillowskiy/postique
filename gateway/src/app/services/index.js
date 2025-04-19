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
 * @property {(slug: string) => Promise<import("#app/models").Post>} getPost
 * @property {(id: string, auth: string) => Promise<import("#app/models").Post>} getPostInfo
 * @property {(id: string, auth: string) => Promise<import("#app/models").PostParagraph[]>} getPostDraft
 * @property {(auth: string, status: string, take: number, skip: number) => Promise<Array<import("#app/models").Post>>} getPostsByStatus
 */

export * as grpc from './grpc/index.js';
export * as rest from './rest/index.js';
