
export default class Interpreter {

    config: InterpreterConfig = {
        rules: []
    };

    constructor(config?: InterpreterConfig) {
        config && (this.config = config);
    }
    
    interpret(text: string): InterpreterCell[] {

        // Match each rule against the text

        const matches: {
            content: string;
            rule: InterpreterRule;
            exactIndex: number;
        }[] = [];

        for (const rule of this.config.rules) {
            
            if (!rule.pattern || rule.pattern.trim() === '') continue;

            let regex: RegExp;
            try {
                regex = new RegExp(rule.pattern, 'g');
            } catch (e) {
                continue;
            }
            
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    content: match[0],
                    rule,
                    exactIndex: text.indexOf(match[0])
                });
            }
        }


        // Create InterpreterCell array from sorted contents
        
        matches.sort((a, b) => {
            return a.exactIndex - b.exactIndex;
        });

        let cells: InterpreterCell[] = matches.map((match) => {
            const interpreterCell: InterpreterCell = {
                rule: match.rule,
                exactIndex: text.indexOf(match.content),
                relativeIndex: ()=>0,
                content: match.content,
                props: {}
            };
            interpreterCell.relativeIndex = this.createDefaultRelativeIndexFcnt(interpreterCell);
            return interpreterCell
        });

        // Run each cell's rule action
        cells = cells.map(cell => cell.rule.action(cell));

        return cells;
    }
    
    // Additional methods for the interpreter can be added here
    
    createDefaultRelativeIndexFcnt(of: InterpreterCell): (to: InterpreterCell[]) => number {
        return function(to: InterpreterCell[]): number {
            const sorted: InterpreterCell[] = [...to, of].sort((a, b) => (a.exactIndex ?? 0) - (b.exactIndex ?? 0));
            return sorted.indexOf(of);
        };
    }
}

// Contracts

/**
 * A set of rules for interpreting input strings.
 * Each rule consists of a name, a regular expression pattern to match against the text and an action function
 * that takes the matched strings and returns an InterpreterCell that will be included in the output.
 * 
 * @property rules - An array of {@link InterpreterRule} objects that define the rules for interpreting input strings.
 */
export interface InterpreterConfig {
    rules: InterpreterRule[];
}

/**
 * Represents a rule for interpreting input strings.
 * Each rule has a name, a pattern to match against the input text, and an action function
 * that processes the matched strings to produce an {@link InterpreterCell}.
 * The action function takes an array of matched strings and returns an InterpreterCell
 * with the rule, relative index, content, and additional custom properties.
 * 
 * @property name - The name of the rule.
 * @property pattern - The regular expression pattern to match against the input text.
 * @property action - A function that takes a matched {@link InterpreterCell} and returns a modified {@link InterpreterCell} to replace.
 * * @template T - The type of properties that the InterpreterCell will hold as custom props.
 */
export interface InterpreterRule {
    name: string;
    pattern: string;
    action: (match: InterpreterCell) => InterpreterCell;
}

/**
 * Represents a cell in the interpreted output.
 * Each cell corresponds to a matched rule and contains the rule, relative index, content, and custom properties.
 * 
 * @property rule - The {@link InterpreterRule} that this cell matches.
 * @property exactIndex - The index of this cell in the original text, if applicable.
 * @property relativeIndex - Might return the index of this cell relative to other cells
 * (e.g. relativeIndex: (to: InterpreterCell[]) => number) but its free for custom use.
 * @property content - The content of the cell, typically the matched string.
 * @property props - Additional custom properties associated with this cell.
 * @template T - The type of properties that the InterpreterCell will hold as custom props.
 * @remarks relativeIndex: (...args: any[]) => number is supposed to be used to easier maintain the order of cells in the output but it can be
 * customized to any expression, for example, to group/sort cells by some criteria.
 */
export interface InterpreterCell<T = Record<string, any>> {
    rule: InterpreterRule;
    exactIndex: number;
    relativeIndex: (...args: any[]) => number;
    content: string;
    props: T;
}
