
import type { Plugin } from 'vite';
import { config as reactorfxConfig } from '../index';

export function ReactorFXVitePlugin(): Plugin {
    return {
        name: 'vite-plugin-reactorfx',
        config(config, {command}) {
            return {
                define: {
                    'import.meta.env.REACTORFX_CONFIG': JSON.stringify(reactorfxConfig),
                },
            }
        }
    }
}
