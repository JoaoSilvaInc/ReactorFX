
import { isReactorFXConfigPaths } from "./ReactorFXConfigPaths"

/**
 * Represents the root config required by ReactorFX.
 *
 * @property projectRoot - The path of the project root directory.
 * @property configSource - The JSON file path relative to the 'projectRoot' containing the ReactorFX config.
 * @property configKey - The config key expected to be in the configSource
 */
export interface ReactorFXRootConfig {
    projectRoot: string,
    configSource: string,
    configKey: string,
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
