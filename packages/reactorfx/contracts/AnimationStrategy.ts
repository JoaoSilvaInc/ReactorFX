
/**
 * Defines the contract for animation strategies used to communicate with an observer
 * on how to handle animation events for DOM elements.
 *
 * @property selector - The CSS selector used to identify target elements for the animation.
 * @property mainClass - The main CSS class applied to the element for the animation.
 * @property activeClass - The CSS class applied when the element becomes active/visible.
 * @property threshold - The intersection ratios that determines when the events must be called.
 * @property onVisible - Optional callback invoked when the element becomes visible.
 * @property onHidden - Optional callback invoked when the element becomes hidden.
 *
 * These properties are used to communicate to an observer how to handle animation events.
 */
export default interface AnimationStrategy {
  selector: string;
  mainClass: string;
  activeClass: string;
  threshold: number[];
  onEnter?: (el: HTMLElement) => void;
  onExit?: (el: HTMLElement) => void;
}
