import registry from './registry/index.js';

const server = registry.resolve('server');

server.start();
