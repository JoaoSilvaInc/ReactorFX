
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

import { getRootPath, readJsonProp } from "../../../utils/fileHandling";
import { ReactorFXConfig } from '../contracts/ConfigContracts';
import { isReactorFXConfig, ReactorFXRootConfig } from '../contracts/ConfigContracts/ReactorFXRootConfig';


export const DEFAULT_CONFIG: ReactorFXConfig = {
    paths: {
        main: '',
        animations: '/animations'
    }
};

/**
 * It looks for 'reactorfx' in package.json
 * 
 * @returns Founded reactorfx config
 * @remarks Returns {@link DEFAULT_CONFIG} if the reactorfx config isn't setted in package.json
 */
export async function loadConfig(): Promise<ReactorFXConfig> {
    
    // Settings
    const {projectRoot, configSource, configKey} = (await getRootConfig());

    const cnfgFilePath: string = path.join(projectRoot, configSource);

    let config: ReactorFXConfig;

    try {
        const foundConfig = readJsonProp(cnfgFilePath, configKey) as ReactorFXConfig;
        if (isReactorFXConfig(foundConfig)) {
            config = foundConfig
        } else {
            throw new Error(`[reactorfx] ${JSON.stringify(foundConfig)} is invalid. Expected shape: { paths: {main: string, animations: string} }`);
        }
    } catch (err) {
        config = DEFAULT_CONFIG;
        console.warn(`[reactorfx] Using default config beacause reading reactorfx config failed:`, err);
    }

    return config;

}

/**
 * 
 * @returns The ReactorFX root config
 */
export async function getRootConfig(): Promise<ReactorFXRootConfig> {

    const localProjectRoot = getRootPath();
    const customConfigPath = path.join(localProjectRoot, 'reactorfx.config.ts');

    const rootConfig: ReactorFXRootConfig = {
        projectRoot: localProjectRoot,
        configSource: '/package.json',
        configKey: 'reactorfx',
    };

    if (fs.existsSync(customConfigPath)) {
        
        const configModule = await import(pathToFileURL(customConfigPath).href);
        const configExport = (configModule.default || configModule.config || configModule);

        rootConfig.projectRoot = configExport.projectRoot;
        rootConfig.configSource = configExport.configSource;
        rootConfig.configKey = configExport.configKey;

    }

    return rootConfig;
}

/**
* Looks for the ReactorFX config in the env vars
*
* @returns The current ReactorFX config
* @remarks Returns 'process.env.REACTORFX_CONFIG' if 'import.meta.env.REACTORFX_CONFIG' is undefined (not in a Vite env)
*/
export function getConfig(): ReactorFXConfig {
    
    if (
        typeof import.meta !== 'undefined' &&
        typeof import.meta.env !== 'undefined' &&
        typeof import.meta.env.REACTORFX_CONFIG !== 'undefined'
    ) {
        try {
            const config = JSON.parse(import.meta.env.REACTORFX_CONFIG) as ReactorFXConfig;
            if (isReactorFXConfig(config)) {
                return config;
            } else {
                throw new Error('[reactorfx] Invalid type to import.meta.env.REACTORFX_CONFIG. Expected shape: ReactorFXConfig')
            }
        } catch (err) {
            console.warn(
                '[reactorfx] Failed to read import.meta.env.REACTORFX_CONFIG. Using DEFAULT_CONFIG.',
                err
            );
        }
    }

    if (
        typeof process !== 'undefined' &&
        typeof process.env !== 'undefined' &&
        typeof process.env.REACTORFX_CONFIG !== 'undefined'
    ) {
        try {
            const config = JSON.parse(process.env.REACTORFX_CONFIG) as ReactorFXConfig;
            if (isReactorFXConfig(config)) {
                return config;
            } else {
                throw new Error('[reactorfx] Invalid type to process.env.REACTORFX_CONFIG. Expected shape: ReactorFXConfig')
            }
        } catch (err) {
            console.warn(
                '[reactorfx] Failed to read process.env.REACTORFX_CONFIG. Using DEFAULT_CONFIG.',
                err
            );
        }
    }

    console.warn('[reactorfx] Failed to read REACTORFX_CONFIG. Using DEFAULT_CONFIG.');
    return DEFAULT_CONFIG;
}
