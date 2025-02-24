/**
 * Auth Service API
 * @typedef {Object} AuthService
 * @property {(dto: import("#app/dto").RegisterDTO) => Promise<void>} register
 * @property {(dto: import("#app/dto").LoginDTO) => Promise<import("#app/models").Session>} login
 * @property {(token: string) => Promise<import("#app/models").User>} verify
 * @property {(token: string) => Promise<import("#app/models").Session>} refresh
 */

export * as grpc from './grpc/index.js';
