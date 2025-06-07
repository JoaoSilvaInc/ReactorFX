
import AnimationStrategy from "../contracts/AnimationStrategy";
import {recoverConfigFromEnv } from "../config";

export default function createAnimationStrategiesArray(strategiesPath: string): Promise<AnimationStrategy[]> {
    return new Promise<AnimationStrategy[]>((resolve, reject) => {
        
        const config = recoverConfigFromEnv();
        // import all strategies according to config
        // put it on an array
        // return them all

    });
}
