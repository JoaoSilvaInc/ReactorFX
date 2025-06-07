
import { defineConfig } from 'vite';
import { getConfig as loadConfig } from './config';

export const config = loadConfig();


export { ReactorFXVitePlugin } from './plugins/ReactorFXVitePlugin'
export { ReactorFX } from './ReactorFX';