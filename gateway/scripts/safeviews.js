/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import minimist from 'minimist';
import prettier from 'prettier';
import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

class EJSContentGenerator {
    /** @type {RegExp} Regexp for <%= any %> */
    static VARIABLE_REGEXP = /<%=\s*(.*?)\s*%>/g;
    static EJS_BLOCK_REGEXP = /<%[-#_=|%>]*([\s\S]*?)%>/g;

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

        const parser = new Parser();
        parser.setLanguage(JavaScript);
        const tree = parser.parse(matches);
        const cursor = tree.rootNode.walk();

        const nodes = [];

        nodes.push(cursor.currentNode);

        const declarations = new Set();
        const identifiers = new Map();

        function updateMap(map, key, value) {
            const storedValue = map.get(key);
            if (storedValue) {
                map.set(key, {
                    ...storedValue,
                    ...value,
                });
            } else {
                map.set(key, value);
            }
        }

        /** @param {Parser.TreeCursor} cur */
        function traverse(cur, identAsDeclaration = 0) {
            // Пройдемо по дочірніх елементах
            if (cur.gotoFirstChild()) {
                loop: do {
                    const node = cur.currentNode;

                    if (node.text.includes('externalFn')) {
                        console.log('KEY', {
                            text: node.text,
                            type: node.type,
                        });
                    }

                    // eslint-disable-next-line default-case
                    switch (node.type) {
                        case 'call_expression': {
                            const child = node.child(0)?.text;
                            updateMap(identifiers, child, { callable: true });
                            break;
                        }
                        case 'for_in_statement': {
                            console.log('FOR_IN_STATEMENT', node.text);
                            identAsDeclaration = 2;
                            break;
                        }
                        case 'object':
                        case 'subscript_expression': {
                            console.log(node.type.toUpperCase(), node.text);

                            if (node.type === 'subscript_expression') {
                                const nextNode = node.child(0)?.text;
                                const storedNode = identifiers.get(nextNode);
                                if (storedNode) {
                                    identifiers.set(nextNode, {
                                        ...storedNode,
                                        iterable: true,
                                    });
                                }
                            }

                            continue loop;
                        }
                        case 'formal_parameters':
                        case 'function_declaration':
                        case 'arrow_function': {
                            console.log(node.type.toUpperCase(), node.text);
                            traverse(cur, Infinity);
                            continue loop;
                        }
                        case 'variable_declarator': {
                            const nodeText = (node.child(0) ?? node).text;
                            declarations.add(nodeText);

                            console.log('VARIABLE_DECLARATOR', nodeText);
                            break;
                        }
                        case 'identifier':
                        case 'member_expression': {
                            if (node.type === 'member_expression') {
                                const child = node.text
                                    .split('.')
                                    .slice(0, -1)
                                    .join('.');

                                updateMap(identifiers, child, {
                                    isObject: true,
                                });

                                console.log(
                                    `MEMBER_EXPRESSION ${node.text}, CHILD ${child}`,
                                );
                            }

                            if (identAsDeclaration > 0) {
                                console.log(
                                    'IDENTIFIER[DECLARATION]',
                                    node.type,
                                    node.text,
                                );
                                declarations.add(node.text);
                                identAsDeclaration -= 1;
                            } else {
                                console.log('IDENTIFIER', node.type, node.text);
                                updateMap(identifiers, node.text, {
                                    text: node.text,
                                    isExpression:
                                        node.type === 'member_expression',
                                });
                            }
                            break;
                        }
                    }

                    nodes.push(cur.currentNode);
                    traverse(cur, identAsDeclaration); // Рекурсивний виклик для кожної дочірньої ноди
                } while (cur.gotoNextSibling()); // Переходимо до наступного брата
                cur.gotoParent(); // Повертаємось до батьківської ноди після обробки всіх дітей
            }
        }

        traverse(cursor); // стартуємо рекурсію з кореня

        console.log('IDENTIFIERS', identifiers);
        console.log('DECLARATIONS', declarations);

        function isBuildIn(prop) {
            return (
                Object.hasOwn(Object, prop) ||
                Object.hasOwn(Array, prop) ||
                Object.hasOwn(String, prop) ||
                Object.hasOwn(Number, prop) ||
                Object.hasOwn(Boolean, prop)
            );
        }

        function isDeclarationsExpression(node) {
            const prop = node.text.split('.').shift();
            const isExpr = node.isExpression && declarations.has(prop);
            console.log('IS DECLARATION EXPRESSION', node.text, prop, isExpr);
            return isExpr;
        }

        function isBuildInExpession(node) {
            const prop = node.text.split('.').pop();
            const isExpr = node.isExpression && isBuildIn(prop);
            console.log('IS BUILD IN EXPRESSION', node.text, prop, isExpr);
            return isExpr;
        }

        const id = Array.from(identifiers).filter(
            ([key, v]) =>
                !declarations.has(v.text) && !isDeclarationsExpression(v),
        );

        console.log('ID', id);

        //nodes.forEach((node) => {
        //    if (node.type === 'identifier') {
        //        console.log('identifier', node);
        //    }
        //});

        console.log('END OF PARSING', matches, nodes.length);
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

        if (dirent.name === 'index.ejs') {
            this.#matches(ejsContent);
        }

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
