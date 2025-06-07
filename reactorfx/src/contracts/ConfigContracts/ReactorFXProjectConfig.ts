
/**
 * Represents the root config required by ReactorFX.
 *
 * @property projectRoot - The path of the project root directory.
 * @property configSource - The JSON file path relative to the 'projectRoot' containing the ReactorFX config.
 * @property configKey - The config key expected to be in the configSource
 */
export interface ReactorFXProjectConfig {
    projectRoot: string,
    configSource: string,
    configKey: string,
}

/**
 * 
 * @param config The object to check
 * @returns True if 'config' is {@link ReactorFXProjectConfig} like
 */
export function isReactorFXProjectConfig(config: any) {
    return(
        config &&
        (typeof config?.projectRoot === 'string') &&
        (typeof config?.configSource === 'string') &&
        (typeof config?.configKey === 'string')
    )
}
