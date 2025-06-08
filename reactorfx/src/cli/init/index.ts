
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const CONFIG_FILE = path.resolve(process.cwd(), 'vite.config.ts');
const BACKUP_FILE = path.resolve(process.cwd(), 'vite.config.ts.bak');

const FNCTN_NAME = 'reactorfxVitePlugin';
const MODULE_NAME = 'reactorfx';
const PLUGIN_IMPORTING = `import { ${FNCTN_NAME} } from '${MODULE_NAME}'; /* Importing added by 'npx ${MODULE_NAME} init' */ `;
const PLUGIN_CALLING = `${FNCTN_NAME}(), /* ReactorFX plugin installed by 'npx ${MODULE_NAME} init' */ `;

const DEFAULT_VITE_CONFIG = `
${PLUGIN_IMPORTING}
import { defineConfig } from 'vite'; 

export default defineConfig({
    plugins: [
        ${PLUGIN_CALLING}
    ]
});
`

/**
 * It creates or edit 'vite.config.ts' installing the ReactorFX plugin required to set the ReactorFX configuration
 * when running the Vite project (dev or build version).
 * 
 * @remarks This function will edit your 'vite.config.ts' file to include the ReactorFX plugin.
 */
export async function initReactorFX() {

    // Create a new 'vite.config.ts' file if it does not exist
    if (!fs.existsSync(CONFIG_FILE)) {
        console.warn(`File '${CONFIG_FILE} not found.`)
        const permission = await askUserPermission(
            `Create '${CONFIG_FILE}'? This file is required to configure ReactorFX with Vite.`
        );

        if (!permission) {
            console.log('Operation canceled by user.');
            return;
        }

        try {
            fs.writeFileSync(CONFIG_FILE, DEFAULT_VITE_CONFIG, 'utf-8');
            console.log('\x1b[32m%s\x1b[0m' /* green */, `File '${CONFIG_FILE}' created successfully.`);
            
        } catch (err) {
            console.error(`Error creating file '${CONFIG_FILE}':`, err);
            console.log('\x1b[33m%s\x1b[0m' /* yellow */, 'Operation failed. Please create the file manually. Read the documentation for more information.');
            return;
        }
    }

    // Instert the ReactorFX plugin into the existing 'vite.config.ts' file

    const permission = await askUserPermission(
        "Do you allow modifying 'vite.config.ts' to include the ReactorFX plugin?"
    );

    if (!permission) {
        console.log('Operation canceled by user.');
        return;
    }

    // Backup 'vite.config.ts' before modifying
    fs.copyFileSync(CONFIG_FILE, BACKUP_FILE);

    try {
        let content = fs.readFileSync(CONFIG_FILE, 'utf-8');

        const importRegex = /import\s+{[^}]*}\s+from\s+['"]([^'"]+)['"]/g;
        const importMatch = content.match(importRegex);
        const alreadyHasImport = importMatch && importMatch.some((imp) => imp.includes(MODULE_NAME) && imp.includes(FNCTN_NAME));

        if (!alreadyHasImport) {
            content = `\n${PLUGIN_IMPORTING}\n` + content;
        }

        insertPluginWithIndentation(content);

        fs.writeFileSync(CONFIG_FILE, content, 'utf-8');

        console.log('\x1b[32m%s\x1b[0m' /* green */, 'ReactorFX successfully added to Vite!');
    } catch (error) {
        fs.copyFileSync(BACKUP_FILE, CONFIG_FILE);
        console.error('Error modifying vite.config.ts. Backup restored.', error);
        console.log('\x1b[33m%s\x1b[0m' /* yellow */, 'Operation failed. Please create the file manually. Read the documentation for more information.');
    } finally {
        fs.unlinkSync(BACKUP_FILE);
    }
}

function insertPluginWithIndentation(configContent: string): string {
    const pluginArrayRegex = /(plugins:\s*\[)([^]*?)(\])/; // Matches plugins: [ ... ]

    const match = configContent.match(pluginArrayRegex);

    if (!match) {
        // Try to find the defineConfig({ ... }) block and add a default plugins array
        const defineConfigRegex = /(defineConfig\s*\(\s*{)([^]*?)(}\s*\))/;
        const defineMatch = configContent.match(defineConfigRegex);

        if (defineMatch) {
            const [fullDefine, prefix, body, suffix] = defineMatch;
            // Detect indentation
            const lines = body.split('\n');
            let baseIndent = '';
            for (const line of lines) {
                if (line.trim().length > 0) {
                    baseIndent = line.match(/^(\s*)/)?.[1] ?? '';
                    break;
                }
            }

            const indentSize = baseIndent.includes('\t') ? 1 : 4;
            const rootIndent = baseIndent.length >= indentSize
                ? baseIndent.slice(0, baseIndent.length - indentSize)
                : ''
            ;

            const pluginIndent = baseIndent + (baseIndent.includes('\t') ? '\t' : '    ');
            const pluginsBlock = `\n${baseIndent}plugins: [\n${pluginIndent}${PLUGIN_CALLING}\n${baseIndent}]\n${rootIndent}`;

            let newBody: string;
            if (body.trim().length === 0) {
                newBody = pluginsBlock;
            } else {
                // Insert plugins at the top of the config object
                newBody = pluginsBlock + body.replace(/^\s*\n/, '');
            }

            const newConfig = `${prefix}${newBody}${suffix}`;
            return configContent.replace(defineConfigRegex, newConfig);
        } else {
            throw new Error("Could not find the plugins array or defineConfig block.");
        }
    }

    const [fullMatch, prefix, pluginListContent, suffix] = match;

    // Find the 'plugins: [' line
    const lines = configContent.split('\n');
    const pluginLine = lines.find(line => line.includes('plugins:') && line.includes('['));

    // Detect 'plugins: [' indentation
    const baseIndent = pluginLine?.match(/^(\s*)/)?.[1] ?? '';

    // Try to detect the indentation style used inside the array (first non-empty plugin line)
    let pluginIndent = '';
    for (const line of pluginListContent.split('\n')) {
        if (line.trim()) {
            const indentMatch = line.match(/^(\s+)/);
            if (indentMatch) {
                pluginIndent = indentMatch[1];
            }
            break;
        }
    }

    // If no internal indentation detected, default to one indent level deeper than baseIndent
    if (!pluginIndent) {
        if (baseIndent.includes('\t')) {
            pluginIndent = baseIndent + '\t';
        } else {
            pluginIndent = baseIndent + '    '; // 4 spaces
        }
    }

    // Build the new plugins array block preserving indentation and formatting
    const newPluginBlock = `${prefix.trim()}\n` +
        `${pluginIndent}${PLUGIN_CALLING}\n` +
        (pluginListContent ? `${pluginListContent}\n` : '') +
        `${baseIndent}${suffix}`;

    return configContent.replace(pluginArrayRegex, newPluginBlock);
}

/**
 * Requests user permission via terminal (CLI).
 */
async function askUserPermission(question: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(`${question} (y/n): `, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
    });
}
