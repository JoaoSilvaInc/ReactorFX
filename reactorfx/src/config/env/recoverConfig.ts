
import { DEFAULT_CONFIG } from "../constants";
import { ReactorFXConfig, isReactorFXConfig } from "../../contracts/ConfigContracts";

/**
* Recover the applyed ReactorFX config from env
*
* @returns The current ReactorFX config
* @remarks Returns 'process.env.REACTORFX_CONFIG' if 'import.meta.env.REACTORFX_CONFIG' is undefined (not in a Vite env)
*/
export function recoverConfigFromEnv(): ReactorFXConfig {
    
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