
import AnimationStrategy from '../contracts/AnimationStrategy.js';

/**
 * Core manager for handling multiple {@link ObserverAgent} and {@link AnimationStrategy} instances.
 *
 * @remarks
 * This class coordinates several animation strategies, each with its own configuration, ensuring that
 * animations are triggered and managed appropriately as elements intersect with the viewport.
 *
 * @example
 * ```typescript
 * const strategies = [new AnimationStrategy(...), ...];
 * const observersCore = new ObserversCore(strategies);
 * ```
 */
export default class RuntimeNexus {

    animationStrategys: AnimationStrategy[] = [];
    observers: IntersectionObserver[] = [];

    /**
     * @param strategys - An array of {@link AnimationStrategy} instances, each representing a specific animation configuration
     *                    to be managed by the observer.
    */
    constructor (strategys: AnimationStrategy[]) {
        this.animationStrategys = strategys;
    }

    _createObserver(threshold: number[]) {

    }

}
