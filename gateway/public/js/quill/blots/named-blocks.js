import Quill from 'quill';

import { Named } from '../decorators';

const Block = Quill.import('blots/block');
const Container = Quill.import('blots/container');

export const NamedBlock = Named(Block);
export const NamedContainer = Named(Container);
