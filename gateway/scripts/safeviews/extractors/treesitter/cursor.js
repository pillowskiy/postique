/* eslint-disable default-case */
/* eslint-disable no-continue */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
// eslint-disable-next-line no-unused-vars
import Parser from 'tree-sitter';

/** @typedef {'object' | 'array' | 'string' | 'number' | 'boolean' | 'function' | 'unknown' } BuildInTypeTarget */

export default class ExtractorCursor {
    /** @type {Set<string>} */
    #declarations;

    /** @type {Map<string, any>} */
    #identifiers = new Map();

    /** @type {Parser.TreeCursor} */
    #cursor;

    /**
     * @param {Parser.TreeCursor} cursor
     * @param {string[]} declarations
     */
    constructor(cursor, declarations) {
        this.#cursor = cursor;
        this.#declarations = new Set(declarations);
    }

    analyze() {
        this.#walk();
        return this;
    }

    externalNodes() {
        const nodes = Object.fromEntries(
            Array.from(this.#identifiers).filter(
                ([key, value]) =>
                    !this.#declarations.has(key) &&
                    !this.#isDeclarationsExpression(value),
            ),
        );
        return nodes;
    }

    /**
     * `identAsDeclaration` is an internal function used specifically for function parameter declarations
     * and `for-in` statements.
     *
     * ## Function Parameters:
     * By default, function parameters (e.g., `function(a, b, c, d)`) are represented as identifiers
     * rather than `variable_declarator` nodes. To ensure they are treated as declarations, we manually
     * register these identifiers.
     *
     * ## `for-in` Statements:
     * Similarly, in a `for (const a in b)` statement, the variable `a` is not automatically assigned
     * a `variable_declarator` node. To correctly recognize it as a declaration, we handle it manually.
     * @param {number} identAsDeclaration
     * @returns {void}
     */
    #walk(identAsDeclaration = 0) {
        if (!this.#cursor.gotoFirstChild()) {
            return;
        }

        loop: do {
            const node = this.#cursor.currentNode;

            switch (node.type) {
                case 'call_expression': {
                    const child = node.child(0)?.text;
                    if (child) {
                        this.#upsertIdentifier(child, (prev) => ({
                            ...prev,
                            text: child,
                            callable: true,
                        }));
                    }
                    break;
                }
                case 'for_in_statement': {
                    console.log('FOR_IN_STATEMENT', node.text);
                    identAsDeclaration = 2;
                    break;
                }
                case 'object': {
                    // We don't want register the object property as independent declarations
                    // e.g., `const obj = { a: 1, b: 2 }`, we prevent the `a` and `b` identifiers
                    continue loop;
                }
                case 'subscript_expression': {
                    console.log(
                        'SUBSCRIPT EXPRESSION',
                        node.text,
                        node.child(2)?.text,
                        node.child(2)?.type,
                    );

                    const targetNode = node.child(0);
                    const propertyNode = node.child(2);
                    if (!targetNode || !propertyNode) {
                        throw new Error('Invalid subscript expression');
                    }

                    if (
                        propertyNode.type === 'identifier' ||
                        propertyNode.type === 'number'
                    ) {
                        this.#upsertIdentifier(targetNode.text, (prev) => ({
                            ...prev,
                            text: targetNode.text,
                            iterable: true,
                        }));
                    }

                    if (
                        propertyNode.type === 'string' ||
                        propertyNode.type === 'template_string'
                    ) {
                        const nodeText = `${targetNode.text}.${propertyNode.text.replace(/['"`]/g, '')}`;
                        const patchNode = {
                            text: nodeText,
                            isExpression: true,
                        };

                        this.#expressionParentNodePatch(nodeText);
                        this.#upsertIdentifier(nodeText, (prev) => ({
                            ...prev,
                            ...patchNode,
                        }));
                    }

                    continue loop;
                }
                case 'formal_parameters':
                case 'function_declaration':
                case 'arrow_function': {
                    console.log(node.type.toUpperCase(), node.text);
                    this.#walk(Infinity);
                    continue loop;
                }
                case 'variable_declarator': {
                    const nodeText = (node.child(0) ?? node).text;
                    this.#declarations.add(nodeText);

                    console.log('VARIABLE_DECLARATOR', nodeText);
                    break;
                }
                case 'identifier':
                case 'member_expression': {
                    // This regex removes the array index (objArray[0].property -> objArray.property)
                    const nodeText = node.text.replace(/\[[^\]]+\]/, '');

                    if (identAsDeclaration > 0) {
                        console.log(
                            'IDENTIFIER[DECLARATION]',
                            node.type,
                            nodeText,
                        );
                        this.#declarations.add(nodeText);
                        identAsDeclaration -= 1;
                        break;
                    }

                    console.log('IDENTIFIER', node.type, nodeText);
                    const patchNode = {
                        text: nodeText,
                        isExpression: node.type === 'member_expression',
                    };

                    if (node.type === 'member_expression') {
                        Object.assign(
                            patchNode,
                            this.#expressionParentNodePatch(nodeText),
                        );
                    }

                    this.#upsertIdentifier(nodeText, (prev) => ({
                        ...prev,
                        ...patchNode,
                    }));
                    break;
                }
            }

            this.#walk(identAsDeclaration);
        } while (this.#cursor.gotoNextSibling());
        this.#cursor.gotoParent();
    }

    /**
     * It changes the parent node of the member_expression
     * Is is neccessary when the member_expression is a property of an object (only object.property format)
     *
     * e.g., `const obj = { a: 1, b: 2 }`, the member_expression `obj.a` is a property of the object `obj`
     * @param {string} nodeText
     * @returns {any} Parent node patch object
     */
    #expressionParentNodePatch(nodeText) {
        const patchNode = {};

        const parts = nodeText.split('.');
        const prop = parts.pop();
        if (!prop) {
            throw new Error('Invalid member expression');
        }

        const { match, target } = this.#getBuildInType(prop);
        const parentNodeText = parts.join('.');
        this.#upsertIdentifier(parentNodeText, (prev) => ({
            ...prev,
            text: parentNodeText,
            members: (prev.members ?? []).concat(!match ? prop : []),
            ...this.#upsertTypeNodeByTarget(target),
        }));

        patchNode.isBuildIn = match;
        return patchNode;
    }

    /**
     * @param {string} key
     * @param {(prev: any | {}) => any} value
     * @returns {void}
     */
    #upsertIdentifier(key, value) {
        const storedValue = this.#identifiers.get(key);
        if (storedValue) {
            this.#identifiers.set(key, {
                ...value(storedValue),
            });
        } else {
            this.#identifiers.set(key, value({}));
        }
    }

    /**
     * @param {string} prop
     * @returns {{ match: boolean; target: BuildInTypeTarget }}
     */
    #getBuildInType(prop) {
        if (['__proto__', 'prototype'].includes(prop)) {
            return { match: true, target: 'unknown' };
        }

        /** @type{Partial<Record<BuildInTypeTarget, any>>} */
        const protos = {
            object: Object.prototype,
            array: Array.prototype,
            string: String.prototype,
            number: Number.prototype,
            boolean: Boolean.prototype,
        };

        for (const name in protos) {
            if (protos[name] && prop in protos[name]) {
                console.log('FOUND BUILD IN', prop, name);
                // @ts-expect-error For in statement doesn't determine the type
                return { match: true, target: name };
            }
        }

        return { match: false, target: 'unknown' };
    }

    /**
     * @param {BuildInTypeTarget} target
     * @returns {any}
     */
    #upsertTypeNodeByTarget(target) {
        switch (target) {
            case 'object':
                return { isObject: true };
            case 'array':
                return { iterable: true };
            default:
                return {};
        }
    }

    /**
     * @param {any} node
     * @returns {boolean}
     */
    #isDeclarationsExpression(node) {
        const prop = node.text.split('.').shift();
        const isExpr = node.isExpression && this.#declarations.has(prop);
        if (isExpr) {
            console.log(
                'FOUND DECLARATION EXPRESSION: SKIPING',
                node.text,
                prop,
            );
        }
        return isExpr;
    }
}
