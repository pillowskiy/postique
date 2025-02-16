/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import minimist from 'minimist';
import prettier from 'prettier';

class EJSContentGenerator {
    /** @type {RegExp} Regexp for <%= any %> */
    static VARIABLE_REGEXP = /<%=\s*(.*?)\s*%>/g;

    /** @type {string} */
    #targetDir;

    /** @type {string} */
    #outFile;

    /**
     * @param {string} targetDir
     * @param {string} outFile
     */
    constructor(targetDir, outFile) {
        this.#targetDir = targetDir;
        this.#outFile = outFile;
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

        return `'${viewPath}': ${this.#ejsKeyValueObject(...variableNames)};`;
    }

    /**
     * Generate the EJS key value object
     * @param {string[]} variables
     * @returns {string}
     */
    #ejsKeyValueObject(...variables) {
        const typeObject = {};

        for (const path of new Set(variables.map((v) => v.trim()))) {
            path.split('.').reduce(
                // eslint-disable-next-line no-return-assign
                (obj, key, i, arr) =>
                    (obj[key] =
                        i === arr.length - 1 ? 'EjsVariable' : obj[key] || {}),
                typeObject,
            );
        }

        return JSON.stringify(typeObject)
            .replace(/"EjsVariable"/g, 'EjsVariable')
            .replace(/,/g, ';');
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
        await new EJSContentGenerator(argv.dir, argv.output).generate();
        break;
    default:
        throw new Error(`Engine ${argv.engine} is not supported`);
}
