/* eslint-disable default-case */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

import ExtractorCursor from './cursor.js';

/** @typedef {'object' | 'array' | 'string' | 'number' | 'boolean' | 'function' | 'unknown' } BuildInTypeTarget */

export class TreesitterExtractor {
    /** @type {Parser} */
    #parser;

    /** @type {string[]} */
    #declarations;

    /** @type {string} */
    #literalType;

    /** @param {string[]} declarations */
    constructor(declarations, literalType) {
        this.#parser = new Parser();
        this.#parser.setLanguage(JavaScript);
        this.#declarations = declarations;
        this.#literalType = literalType;
    }

    /** @param {string} content */
    undefinedPropertiesInterface(content) {
        const tree = this.#parser.parse(content);
        const cursor = tree.rootNode.walk();

        const nodes = new ExtractorCursor(cursor, this.#declarations)
            .analyze()
            .externalNodes();

        let res = '';
        // eslint-disable-next-line guard-for-in
        for (const name in nodes) {
            res += this.#stringifyTypeNode(nodes[name], nodes);
        }

        return `{\n${res}\n}`;
    }

    /**
     * @param {any} node
     * @param {Record<string, any>} obj
     * @param {boolean} force
     */
    #stringifyTypeNode(node, obj, force = false) {
        let res = '';

        if (node.isObject || node.members?.length) {
            res += `'${node.text}': { `;

            res += Array.from(new Set(node.members))
                .map((member) => {
                    const childNode = obj[`${node.text}.${member}`];
                    if (!childNode) {
                        throw new Error(
                            `Invalid member ${node.text}.${member}`,
                        );
                    }

                    return this.#stringifyTypeNode(childNode, obj, true);
                })
                .join('\n');

            res += ` }${node.iterable ? '[]' : ''};`;
            return res;
        }

        let typo = this.#literalType;
        let varName = `'${node.text}'`;

        if (node.isExpression) {
            if (!force) return '';
            varName = node.text.split('.').pop();
        }

        if (node.callable) {
            typo = 'Function';
        }

        if (node.iterable) {
            typo = 'Array';
        }

        return `${varName}: ${typo};`;
    }
}
