
import { ReactorFXConfig, isReactorFXConfig } from "../../contracts/ConfigContracts";

/**
 * Applies the given ReactorFX configuration to the runtime environment.
 *
 * In Vite environments, the configuration is injected into `import.meta.env.REACTORFX_CONFIG`.
 * In Node.js environments, it is assigned to `process.env.REACTORFX_CONFIG`.
 *
 * If the environment is not compatible with Vite, a warning is logged to the console.
 * If it is also not compatible with Node.js, an error will be thrown.
 *
 * @param config The ReactorFXConfig object to apply to the environment.
 * @throws Will throw an error if neither Vite nor Node.js environments are detected.
 */
export function applyConfigToEnv(config: ReactorFXConfig): void {

    // Vite env
    try {

        import.meta.env.REACTORFX_CONFIG = JSON.stringify(config);
        return;

    } catch (err) {
        console.warn('[reactorfx] ReactorFX might not to work, because it was designed to run in Vite env.', err);
    }
    
    // Node.js env
    process.env.REACTORFX_CONFIG = JSON.stringify(config);

}