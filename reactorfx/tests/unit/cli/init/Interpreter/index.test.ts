
import Interpreter, { InterpreterConfig, InterpreterRule, InterpreterCell } from '../../../../../src/cli/init/Interpreter';

describe('Interpreter.interpret', () => {

    let interpreter: Interpreter;
    let text: string;

    beforeEach(() => {
        text = " [This] 'is' {a {test}}; ";
        interpreter = new Interpreter();
    });

    it('should initialize with default config', () => {
        expect(interpreter.config.rules).toEqual([]);
    });

    it('should trim all the text', () => {
        
        let rules: InterpreterRule[] = [
            {
                name: 'matchAll',
                pattern: '[\\s\\S]+',
                action: (match) => {
                    const newCell = match;
                    newCell.content = newCell.content.trim();
                    return newCell;
                }
            }
        ];

        interpreter.config.rules = rules;
        const result = interpreter.interpret(text);

        expect(result.length).toBe(1);
        expect(result[0].content).toBe(text.trim());
        expect(result[0].rule.name).toBe('matchAll');
        expect(result[0].exactIndex).toBe(0);
        expect(result[0].relativeIndex(result)).toBe(0);
    })

    it('should return empty array for no matches', () => {
        interpreter.config.rules = [
            {
                name: 'noMatch',
                pattern: '(?!)',
                action: (match) => match
            }
        ];
        const result = interpreter.interpret(text);
        expect(result.length).toBe(0);
    });

    it('should handle empty input', () => {
        interpreter.config.rules = [
            {
                name: 'emptyInput',
                pattern: '',
                action: (match) => match
            }
        ];
        const result = interpreter.interpret('');
        expect(result.length).toBe(0);
    });

    // Test complex patterns
    it('should match complex patterns', () => {
        interpreter.config.rules = [
            {
                name: 'matchBrackets',
                pattern: '\\[([^\\]]+)\\]|\\{([^}]+)}|\'([^\']+)\'' ,
                action: (match) => match
            }
        ];

        
        const result = interpreter.interpret(text);
        expect(result.length).toBe(3);
        expect(result[0].content).toBe('[This]');
        expect(result[1].content).toBe("'is'");
        expect(result[2].content).toBe('{a {test}');
    });

    // Test multiple rules
    // Test nested structures

});