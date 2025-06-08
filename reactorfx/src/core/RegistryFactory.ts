
import AnimationStrategy from "../contracts/AnimationStrategy";
import { ReactorFXConfig } from "../contracts/ConfigContracts";

export default function createAnimationStrategiesArray(config: ReactorFXConfig): Promise<AnimationStrategy[]> {
    return new Promise<AnimationStrategy[]>((resolve, reject) => {
        
        const config = import.meta.env.VITE_REACTORFX_CONFIG;
        // import all static strategies according to config
        // put it on an array
        // return them all

    });
}
