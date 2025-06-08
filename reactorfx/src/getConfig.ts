
import { DEFAULT_CONFIG } from "./vitePlugin/config/constants";
import { ReactorFXConfig, isReactorFXConfig } from "./contracts/ConfigContracts";

/**
* Recover the applyed ReactorFX config from env
*
* @returns The current ReactorFX config
* @remarks Returns 'process.env.REACTORFX_CONFIG' if 'import.meta.env.REACTORFX_CONFIG' is undefined (not in a Vite env)
*/
export function getConfig(): ReactorFXConfig {

    let config;

    // Try to find config in Vite env
    try {
        
        const foundConfig = JSON.parse(import.meta.env.VITE_REACTORFX_CONFIG || '') as ReactorFXConfig;

        if (!isReactorFXConfig(foundConfig)) {
            throw new Error('[reactorfx] Invalid type to ReactorFX config in Vite env. Expected shape: ReactorFXConfig')
        }

        config = foundConfig;

    } catch (err) {
        console.warn('[reactorfx] ReactorFX might not to work, because it was designed to run in Vite env.', err);
    }
    
    // Try to find config in Node env
    try {

        const foundConfig = JSON.parse(process.env.REACTORFX_CONFIG || '') as ReactorFXConfig;
        
        if (!isReactorFXConfig(foundConfig)) {
            throw new Error('[reactorfx] Invalid type to ReactorFX config in Node env. Expected shape: ReactorFXConfig')
        }
        
        config = foundConfig;

    } catch (err) {
        config = DEFAULT_CONFIG;
        console.warn('[reactorfx] Cannot found ReactorFX config in the process enviroment. Using DEFAULT_CONFIG.', err);
    }

    return config as ReactorFXConfig;

}