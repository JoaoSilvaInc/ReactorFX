
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

export function ViteInjectAnimationStrategiesPath(): Plugin {
    return {
        name: 'vite-inject-animation-strategies-path',
        config(config, {command}) {
            try {
                
                const pkg = JSON.parse(
                    fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8')
                );
                
                const strategiesPath =
                    pkg['animations-controller-directory-path'] ||
                    './src/animations'
                ;

                return {
                    define: {
                        'import.meta.env.VITE_ANIMATIONS_CONTROLLER_DIRECTORY_PATH': JSON.stringify(strategiesPath),
                    },
                };


            } catch (err) {
                console.warn('[animations-controller] Failed when reading package.json:', err);
                return {};
            }
        }
    }
}
