
/**
 * Represents the paths required by ReactorFX.
 *
 * @property mainDir - The relative path to the main directory of the ReactorFX project.
 * @property animationsPath - The relative path to the directory containing the custom animation strategies.
 */
export interface ReactorFXConfigPaths {
    main: string,
    animations: string
}

/**
 * 
 * @param paths The object to check
 * @returns True if 'paths' is ReactorFXConfigPaths like
 */
export function isReactorFXConfigPaths(paths: any) {
    return (
        paths &&
        (typeof paths?.main === 'string') &&
        (typeof paths?.animations === 'string')
    )
}