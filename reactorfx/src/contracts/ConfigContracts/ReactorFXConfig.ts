
import { ReactorFXConfigPaths, isReactorFXConfigPaths } from "./ReactorFXConfigPaths";

/**
 * Represents the configuration object for ReactorFX.
 *
 * @property paths - The paths for ReactorFX.
 */
export interface ReactorFXConfig {
    paths: ReactorFXConfigPaths,
}

/**
 * 
 * @param config The object to check
 * @returns True if 'config' is ReactorFXConfig like
 */
export function isReactorFXConfig(config: any) {
    return (
        config?.paths &&
        isReactorFXConfigPaths(config.paths)
    )
}