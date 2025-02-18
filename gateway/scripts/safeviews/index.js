/* eslint-disable no-cond-assign */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import minimist from 'minimist';
import prettier from 'prettier';

import { TreesitterExtractor } from './extractors/index.js';

class EJSContentGenerator {
    /** @type {RegExp} Regexp for <%= any %> */
    static VARIABLE_REGEXP = /<%=\s*(.*?)\s*%>/g;

    /** @type {RegExp} Regexp for ejs block */
    static EJS_BLOCK_REGEXP = /<%[-#_=|%>]*([\s\S]*?)%>/g;

    /** @type {string} */
    #targetDir;

    /** @type {string} */
    #outFile;

    /** @type {import('./extractors/index').Extractor} */
    #extractor;

    /**
     * @param {string} targetDir
     * @param {string} outFile
     * @param {string} extractor
     */
    constructor(targetDir, outFile, extractor) {
        this.#targetDir = targetDir;
        this.#outFile = outFile;
        this.#extractor = this.#getExtractor(extractor);
    }

    /**
     * @param {string} extractorName
     * @returns {import('./extractors/index').Extractor}
     */
    #getExtractor(extractorName) {
        switch (extractorName) {
            case 'treesitter':
                return new TreesitterExtractor(['include'], 'Variable');
            default:
                throw new Error(`Extractor ${extractorName} is not supported`);
        }
    }

    /**
     * Generate the EJS content interface
     * @returns {Promise<void>}
     */
    async generate() {
        const content = `
        /** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/

        declare namespace render {
            export type Variable = string | number | boolean | null | undefined;
            export interface Templates {${await this.#createEjsInterfaceFromPath(this.#targetDir)}};
        }

        /** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/
        `;

        fs.writeFileSync(this.#outFile, await this.#prettifyContent(content));
    }

    /**
     * Read the EJS directory and generate the interface
     * @param {string} path
     * @returns {Promise<string>}
     */
    async #createEjsInterfaceFromPath(path) {
        let content = '';

        const dirents = await fs.promises.readdir(path, {
            withFileTypes: true,
            encoding: 'utf-8',
        });

        // eslint-disable-next-line no-restricted-syntax
        for (const dirent of dirents) {
            if (dirent.isFile() && dirent.name.endsWith('.ejs')) {
                content += await this.#ejsDirentValues(path, dirent);
            }

            if (dirent.isDirectory()) {
                content += await this.#createEjsInterfaceFromPath(
                    `${path}/${dirent.name}`,
                );
            }
        }

        return content;
    }

    /**
     * @param {string} content
     */
    #matches(content) {
        let matches = '';

        let match;
        while (
            (match = EJSContentGenerator.EJS_BLOCK_REGEXP.exec(content)) !==
            null
        ) {
            if (!match[0].startsWith('<%--')) {
                matches += `${match[1].trim()};\n`;
            }
        }

        return this.#extractor.undefinedPropertiesInterface(matches);
    }

    /**
     * Get the EJS content interface values
     * @param {string} dir The directory path
     * @param {fs.Dirent} dirent The file dirent
     * @returns {Promise<string>}
     */
    async #ejsDirentValues(dir, dirent) {
        const variableNames = [];
        const filePath = `${dir}/${dirent.name}`;
        const ejsContent = await fs.promises.readFile(
            `${dir}/${dirent.name}`,
            'utf-8',
        );

        let match;
        while (
            // eslint-disable-next-line no-cond-assign
            (match = EJSContentGenerator.VARIABLE_REGEXP.exec(ejsContent)) !==
            null
        ) {
            variableNames.push(match[1]);
        }

        let viewPath = filePath
            .replace(this.#targetDir, '')
            .replace('.ejs', '')
            .trim();

        if (viewPath.startsWith('/')) {
            viewPath = viewPath.substring(1);
        }

        return `'${viewPath}': ${this.#matches(ejsContent)};`;
    }

    /**
     * Prettify the content with Prettier (by default resolves workspace config)
     * @param {string} content
     * @returns {Promise<string>}
     */
    async #prettifyContent(content) {
        const options = await prettier.resolveConfig(this.#outFile);

        return prettier.format(content, {
            ...options,
            filepath: this.#outFile,
        });
    }
}

const argv = minimist(process.argv.slice(2), {
    string: ['targetDir', 'outFile', 'engine'],
    default: {
        dir: 'views',
        output: 'src/globals.d.ts',
        engine: 'ejs',
        extractor: 'treesitter',
    },
});

if (!argv.dir) {
    throw new Error('Target directory is required');
}

if (!argv.output) {
    throw new Error('Output file is required');
}

switch (argv.engine) {
    case 'ejs':
        await new EJSContentGenerator(
            argv.dir,
            argv.output,
            argv.extractor,
        ).generate();
        break;
    default:
        throw new Error(`Engine ${argv.engine} is not supported`);
}
