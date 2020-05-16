import toJSON from 'cssinjstojson';
import { compile } from './core/compile';
import { css } from './css';

const startBracket = '{';
const endBracket = '}';
const colon = ':';
const semicolon = ';';

function splitDeclaration(property, value, wrapper = (content) => content) {
    return css(wrapper(property + colon + value + semicolon));
}

function eachDeclaration(_, block, wrapper = (content) => content) {
    return Object.entries(block)
        .map(([property, value]) => splitDeclaration(property, value, wrapper))
        .join(' ');
}

function mediaQuery(key, block) {
    return Object.entries(block).map(([property, value]) => {
        return css(
            key +
                startBracket +
                property +
                (typeof value == 'string'
                    ? colon + value + semicolon
                    : startBracket +
                      Object.entries(value).map(([prop, val]) => prop + colon + val + semicolon) +
                      endBracket) +
                endBracket
        );
    });
}

function pseudo(key, block) {
    return eachDeclaration(key, block, (content) => key + startBracket + content + endBracket);
}

function tuple(key) {
    const list = [
        [/^\.\w/.test(key), eachDeclaration],
        [/^#\w/.test(key), eachDeclaration],
        [/^@m/.test(key), mediaQuery],
        [/^\w+/.test(key), splitDeclaration],
        [/^:\w+/.test(key), pseudo],
        [/^::\w+/.test(key), pseudo]
    ];
    let i = list.length;

    while (--i) {
        let kv = list[i];

        if (kv[0]) {
            return kv[1];
        }
    }

    return undefined;
}

function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b);
}

/**
 * Generates atomic classes
 * @param {String|Object|Function} val
 */
function atomic(val) {
    const ctx = this || {};
    const _val = val.call ? val(ctx.p) : val;
    const __val = _val.map ? compile(_val, [].slice.call(arguments, 1), ctx.p) : _val;
    const ___val = typeof __val == 'string' ? toJSON(__val.replace(/\s{2,}|\n/gm, '')) : __val;

    return removeDuplicates(
        Object.entries(___val)
            .map(([key, value]) => {
                const _key = key.replace('&', '');
                const is = tuple(_key);
                const classesNames = is && is(_key, value);

                return Array.isArray(classesNames) ? classesNames.join(' ') : classesNames;
            })
            .join(' ')
            .split(' ')
    )
        .join(' ')
        .trim();
}

export { atomic };

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}
