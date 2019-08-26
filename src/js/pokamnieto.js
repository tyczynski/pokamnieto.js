import elementPositionInfo from './utils/elementPositionInfo';
import defaultConfig from './defaultConfig';

/**
 * Pokamnieto class
 *
 * @class
 */
export default class Pokamnieto {
	/**
	 * Class for revealing elements when they appear in the view while scrolling the page based on the IntersectionObserver API.
	 *
	 * @param {String} elements
	 * @param {Object} config
	 */
	constructor(elements = '.js-pokamnieto', config = {}) {
		this.elements = Array.from(document.querySelectorAll(elements));

		this.config = Object.assign({}, defaultConfig, config);
		this.state = {
			observedElements: 0,
		};

		this.prepareElements = this.prepareElements.bind(this);

		window.addEventListener('scroll', this.prepareElements);
	}

	/**
	 * Function that prepare elements to reveal animation.
	 * It fired only once after the first page rewind.
	 */
	prepareElements() {
		const { elementPreparedClassName } = this.config;

		window.removeEventListener('scroll', this.prepareElements);

		/**
		 * Filter items in the current viewport
		 */
		this.elements = this.elements.filter(element => {
			const [isInViewport, viewportPosition] = elementPositionInfo(element);

			/**
			 * Adds a "prepared class" only to elements outside of the viewport.
			 * An additional class adds a class with information about whether the item is above or below the viewport.
			 */
			if (!isInViewport) {
				element.classList.add(viewportPosition);
				element.classList.add(elementPreparedClassName);
			}

			return !isInViewport;
		});

		this.state.observedElements = this.elements.length;

		this.initObserver();
	}

	/**
	 * Function that initializes the IntersectionObserver instance
	 */
	initObserver() {
		this.observer = new IntersectionObserver(this.callback.bind(this), {
			root: this.config.root,
			rootMargin: this.config.rootMargin,
			threshold: this.config.threshold,
		});

		for (let i = 0; i < this.elements.length; i += 1) {
			this.observer.observe(this.elements[i]);
		}
	}

	/**
	 * Callback for the IntersectionObserver instance
	 *
	 * @param {Array} entries
	 */
	callback(entries) {
		const { elementVisibleClassName } = this.config;

		entries.forEach(entry => {
			const { target } = entry;

			if (entry.isIntersecting) {
				target.classList.add(elementVisibleClassName);

				this.observer.unobserve(target);
				this.state.observedElements -= 1;

				this.unmountIf();
			}
		});
	}

	/**
	 * A method that stops the observer if there are no observed elements
	 *
	 * @return {void}
	 */
	unmountIf() {
		const { observedElements } = this.state;
		const { unmountOnRevealAll } = this.config;

		if (observedElements === 0 && unmountOnRevealAll) {
			this.unmount();
		}
	}

	/**
	 * Public method that stops the observer
	 *
	 * @return {void}
	 */
	unmount() {
		this.observer.disconnect();
	}

	/**
	 * Public method that adds another element to the IntersectionObserver instance
	 *
	 * @param {Element} element
	 */
	observe(element) {
		this.observer.observe(element);
		this.state.observedElements += 1;
	}
}
