
import AnimationStrategy from "../contracts/AnimationStrategy";

export default function createAnimationStrategiesArray(strategiesPath: string): Promise<AnimationStrategy[]> {
    return new Promise((resolve, reject) => {
        try {
            const modules = import.meta.glob(`${strategiesPath}/*.ts`, { eager: true });
    
            const strategies: AnimationStrategy[] = [];
            for (const mod of Object.values(modules)) {
                if (mod && 'default' in mod) {
                    strategies.push(mod.default);
                }
            }

            resolve (strategies);
        } catch (err) {
            console.warn('[animation-controller] Failed when loading animation strategies:', err)
            reject(err)
        }
    })
}
