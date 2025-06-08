
import { Plugin } from 'vite';

import { ReactorFXConfig } from '../contracts/ConfigContracts';
import { getLocalConfig, applyConfigToEnv } from './config';

export default function reactorfxVitePlugin(): Plugin {
    return {
        name: 'reactorfx-vite-plugin',

        async config(config, { mode }) {
            const root = process.cwd();

            const reactorfxConfig = (await getLocalConfig()) as ReactorFXConfig;
            applyConfigToEnv(reactorfxConfig);

            return {
                define: {
                    'import.meta.env.VITE_REACTORFX_CONFIG': JSON.stringify(reactorfxConfig),
                },
            };
        }
    };
}

