import fs from 'fs';
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
        let content = `
        /** AUTO-GENERATED - DO NOT CHANGE MANUALLY **/

        declare namespace ejsView {
            export type EjsVariable = string | number | boolean | null | undefined;
            export interface EjsContent {${await this.#createEjsInterfaceFromPath(this.#targetDir)}};
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

        return `'${viewPath}': { ${variableNames.map((v) => `${v.trim()}: EjsVariable`).join(';')} };`;
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

await new EJSContentGenerator('views', 'src/globals.d.ts').generate();
