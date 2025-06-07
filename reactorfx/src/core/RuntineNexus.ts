
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

        // Add all strategies
    }

    _createObserver(threshold: number[]) {

    }

    // Processing

    // 1 - Acting
    // AddObserver
    // UpdateObserver
    // RemoveObserver

    // 2 - Reacting
    // AddStrategy
    // AddElm
    // RemoveStrategy
    // RemoveElm
    // UpdateStrategy


    // I/O

    // 1 - Scoped controll
    // Pause handling animation(s) / DOM elm(s)
    // Resume handling animation(s) / DOM elm(s)

    // 2 - General controll
    // Break - Pause handling ALL animations / DOM elms
    // Resume - Resume handling ALL
    // Restart - Reset DOM elms states
    // Destroy - Break and Delete all dependencies

    // 3 - Registry
    // Add AnimationStrategy(s)
    // Get current AnimationStrategies / DOM elms being handled
    // Update AnimationStrategy(s)
    // Remove AnimationStrategy(s)
    // Add DOM elm(s)
    // Remove DOM elm(s)

    // 4 - Triggers

    // onAddStrategy
    // onAddElm
    // onRemoveStrategy
    // onRemoveElm
    // onUpdateStrategy

}
