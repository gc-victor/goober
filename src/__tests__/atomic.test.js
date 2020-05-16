import { extractCss } from '..';
import { atomic } from '../atomic';

describe('atomic', () => {
    it('should generate atomic classes with a template literal as an argument', () => {
        const output = atomic`
            @undefined {}
            padding: 1em;
            margin: 1em;
            #id {
                padding: 1em;
                margin: 1em;
            }
            .className {
                padding: 1em;
                margin: 1em;
            }
            :hover {
                padding: 1em;
                margin: 1em;
            }
            &:hover {
                padding: 1em;
                margin: 1em;
            }
            ::after {
                content: "»";
                color: red;
            }
            @media (min-width: 1px) {
                padding: 1em;
                margin: 1em;
                :hover {
                    padding: 1em;
                }
                :focus {
                    margin: 1em;
                }
            }
        `;

        expect(output).toBe(
            [
                'go1693020674',
                'go3728150637',
                'go1084102224',
                'go2389456723',
                'go700261368',
                'go159990092',
                'go2923493059',
                'go1684753226',
                'go322446857',
                'go2892624124'
            ].join(' ')
        );
        expect(extractCss()).toBe(
            [
                ' .go1693020674{padding:1em;}',
                '.go3728150637{margin:1em;}',
                '.go1084102224:hover{padding:1em;}',
                '.go2389456723:hover{margin:1em;}',
                '.go700261368::after{content:"»";}',
                '.go159990092::after{color:red;}',
                '@media (min-width: 1px){.go2923493059{padding:1em;}}',
                '@media (min-width: 1px){.go1684753226{margin:1em;}}',
                '@media (min-width: 1px){.go322446857:hover{padding:1em;}}',
                '@media (min-width: 1px){.go2892624124:focus{margin:1em;}}'
            ].join('')
        );
    });

    it('should generate atomic classes with an object as an argument', () => {
        const output = atomic({
            '@undefined': {},
            padding: '1em',
            margin: '1em',
            '#id': { padding: '1em', margin: '1em' },
            '.className': { padding: '1em', margin: '1em' },
            '&:hover': { padding: '1em', margin: '1em' },
            ':hover': { padding: '1em', margin: '1em' },
            '::after': { content: '"»"', color: 'red' },
            '@media (min-width: 1px)': {
                padding: '1em',
                margin: '1em',
                ':hover': { padding: '1em' },
                ':focus': { margin: '1em' }
            }
        });

        expect(output).toBe(
            [
                'go1693020674',
                'go3728150637',
                'go1084102224',
                'go2389456723',
                'go700261368',
                'go159990092',
                'go2923493059',
                'go1684753226',
                'go322446857',
                'go2892624124'
            ].join(' ')
        );
        expect(extractCss()).toBe(
            [
                '.go1693020674{padding:1em;}',
                '.go3728150637{margin:1em;}',
                '.go1084102224:hover{padding:1em;}',
                '.go2389456723:hover{margin:1em;}',
                '.go700261368::after{content:"»";}',
                '.go159990092::after{color:red;}',
                '@media (min-width: 1px){.go2923493059{padding:1em;}}',
                '@media (min-width: 1px){.go1684753226{margin:1em;}}',
                '@media (min-width: 1px){.go322446857:hover{padding:1em;}}',
                '@media (min-width: 1px){.go2892624124:focus{margin:1em;}}'
            ].join('')
        );
    });

    it('should generate atomic classes with a function as an argument', () => {
        const incoming = {
            '@undefined': {},
            padding: '1em',
            margin: '1em',
            '#id': { padding: '1em', margin: '1em' },
            '.className': { padding: '1em', margin: '1em' },
            '&:hover': { padding: '1em', margin: '1em' },
            ':hover': { padding: '1em', margin: '1em' },
            '::after': { content: '"»"', color: 'red' },
            '@media (min-width: 1px)': {
                padding: '1em',
                margin: '1em',
                ':hover': { padding: '1em' },
                ':focus': { margin: '1em' }
            }
        };
        const output = atomic.call({ p: incoming }, (props) => ({
            '@undefined': props['@undefined'],
            padding: props.padding,
            margin: props.margin,
            '#id': props['#id'],
            '.className': props['.className'],
            '&:hover': props['&:hover'],
            ':hover': props[':hover'],
            '::after': props['::after'],
            '@media (min-width: 1px)': props['@media (min-width: 1px)']
        }));

        expect(output).toBe(
            [
                'go1693020674',
                'go3728150637',
                'go1084102224',
                'go2389456723',
                'go700261368',
                'go159990092',
                'go2923493059',
                'go1684753226',
                'go322446857',
                'go2892624124'
            ].join(' ')
        );
        expect(extractCss()).toBe(
            [
                '.go1693020674{padding:1em;}',
                '.go3728150637{margin:1em;}',
                '.go1084102224:hover{padding:1em;}',
                '.go2389456723:hover{margin:1em;}',
                '.go700261368::after{content:"»";}',
                '.go159990092::after{color:red;}',
                '@media (min-width: 1px){.go2923493059{padding:1em;}}',
                '@media (min-width: 1px){.go1684753226{margin:1em;}}',
                '@media (min-width: 1px){.go322446857:hover{padding:1em;}}',
                '@media (min-width: 1px){.go2892624124:focus{margin:1em;}}'
            ].join('')
        );
    });

    it('should generate atomic classes names as an output for multiline or single line', () => {
        const outputMultiline = atomic`
            border-radius: 4px;
            background: red;
            margin: 0 1px 0 1px;
        `;
        const outputSingleLine = atomic`border-radius: 4px; background: red; margin: 0 1px 0 1px;`;

        expect(outputSingleLine).toBe(outputMultiline);
    });
});
