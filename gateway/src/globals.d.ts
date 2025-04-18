import { Request } from 'express';

declare global {
    namespace Express {
        export interface Request {
            user: import('#app/models').User;
            file?: import('#app/dto').UploadFileDTO;
            files?: import('#app/dto').UploadFileDTO[];
            token?: string;
        }
    }
}
