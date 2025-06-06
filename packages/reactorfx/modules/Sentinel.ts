
/**
 * Manages an IntersectionObserver instance, allowing observation of multiple DOM elements
 * and providing customizable handlers for when elements enter or exit the viewport.
 *
 * @remarks
 * This agent uses the IntersectionObserver API, enabling dynamic updates to the
 * threshold and event handlers for intersection events. It supports observing and
 * unobserving elements, as well as updating handlers and thresholds at runtime.
 *
 * @example
 * ```typescript
 * const sentinel = new Sentinel(
 *   [0.5],
 *   entry => console.log('Entered:', entry),
 *   entry => console.log('Exited:', entry)
 * );
 * sentinel.observe(document.querySelector('#myElement'));
 * ```
 */
export default class Sentinel {

    private observedElements: Set<Element> = new Set();

    private threshold: number[];
    private onEnter: (entry: IntersectionObserverEntry) => void;
    private onExit: (entry: IntersectionObserverEntry) => void;
    private observer: IntersectionObserver;

    constructor (
        threshold: number[] = [0],
        onEnter: (entry: IntersectionObserverEntry) => void,
        onExit: (entry: IntersectionObserverEntry) => void
    ) {

        this.threshold = threshold;
        this.onEnter = onEnter;
        this.onExit = onExit;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.isIntersecting
                    ? this.onEnter(entry)
                    : this.onExit(entry);
            }),
            { threshold: this.threshold}
        })
    }

    /**
     * Sets a new onEnter handler, allowing access to the previous handler.
     * @param callback A function that receives the previous onEnter and returns a new one.
     */
    setOnEnter(
        callback: (prevOnEnter: (entry: IntersectionObserverEntry) => void)
            => (entry: IntersectionObserverEntry) => void
    ): void {
        this.onEnter = callback(this.onEnter);
    }

    /**
     * Sets a new onExit handler, allowing access to the previous handler.
     * @param callback A function that receives the previous onExit and returns a new one.
     */
    setOnExit(
        callback: (prevOnExit: (entry: IntersectionObserverEntry) => void)
            => (entry: IntersectionObserverEntry) => void
    ): void {
        this.onExit = callback(this.onExit);
    }

    /**
     * Observes one or multiple elements.
     * @param targets A single Element or an array of Elements to observe.
     */
    observe(targets: Element | Element[]) {
        const elements = Array.isArray(targets) ? targets : [targets];
        elements.forEach(element => {
            if (!this.observedElements.has(element)) {
                this.observedElements.add(element);
                this.observer.observe(element);
            }
        });
    }

    /**
     * Unobserves one or multiple elements.
     * @param targets A single Element or an array of Elements to unobserve.
     */
    unobserve(targets: Element | Element[]) {
        const elements = Array.isArray(targets) ? targets : [targets];
        elements.forEach(element => {
            if (this.observedElements.has(element)) {
                this.observedElements.delete(element);
                this.observer.unobserve(element);
            }
        });
    }

    /**
     * Sets the threshold values for the IntersectionObserver and re-observes all elements.
     * @param value Array of threshold values.
     */
    setThreshold(value: number[]) {
        this.threshold = value;
        if (this.observer) {
            this.observer.disconnect();
        }
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.isIntersecting
                    ? this.onEnter(entry)
                    : this.onExit(entry);
            });
        }, { threshold: this.threshold });

        // Re-observe all previously observed elements
        this.observedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    /**
     * Gets the current threshold values used by the observer.
     *
     * @returns An array of numbers representing the threshold values.
     */
    getThreshold(): number[] {
        return this.threshold;
    }

    /**
     * Disconnects the observer and clears the observed elements set.
     */
    disconnect() {
        this.observer.disconnect();
        this.observedElements.clear();
    }

}
