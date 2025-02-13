import registry from './shared/infrastructure/registry/index.js';

const server = registry.resolve('server');

server.start();
