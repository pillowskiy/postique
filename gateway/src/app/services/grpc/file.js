import * as models from '#app/models/index.js';

import { ChannelCredentials, InterceptingCall } from '@postique/pb/grpc';
import * as file from '@postique/pb/v1/files/file.pb';

import GRPCHandler from './common/handler.js';

/** @typedef {import('#shared/config').FileServiceConfig} FileServiceConfig */

/**
 * @extends {GRPCHandler<file.FileClient>}
 */
export class FileService extends GRPCHandler {
    /**
     * @param {FileServiceConfig} config
     * @returns {import("@postique/pb/grpc").Interceptor}
     */
    static #authInterceptor(config) {
        return function (options, nextCall) {
            return new InterceptingCall(nextCall(options), {
                start: (metadata, listener, next) => {
                    const token = `Bearer ${config.fileService.token}`;
                    metadata.add('authorization', token);
                    next(metadata, listener);
                },
            });
        };
    }

    /**
     * @param {FileServiceConfig} config
     */
    constructor(config) {
        super(
            new file.FileClient(
                config.fileService.address,
                ChannelCredentials.createInsecure(),
                {
                    interceptors: [FileService.#authInterceptor(config)],
                },
            ),
        );
    }

    /**
     * @param {import('#app/dto').UploadFileDTO} input
     * @returns {Promise<models.FilePath>}
     */
    async upload(input) {
        const response = await this.call('upload', {
            contentType: input.contentType,
            data: input.data,
            filename: input.filename,
        });

        return new models.FilePath(response.path);
    }

    /**
     * @param {import('#app/dto').DeleteFileDTO} input
     * @returns {Promise<models.FilePath>}
     */
    async delete(input) {
        const response = await this.call('delete', {
            path: input.path,
        });

        return new models.FilePath(response.path);
    }
}
