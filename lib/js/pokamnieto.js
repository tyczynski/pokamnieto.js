/**
 * @package pokamnieto - A lightweight for revealing elements when they appear in the view while scrolling the page based on the IntersectionObserver API.
 * @version v0.1.0
 * @link https://github.com/tyczynski/pokamnieto.js
 * @author Przemysław Tyczyński | https://tyczynski.pl
 * @license MIT
 */
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
		? (module.exports = factory())
		: typeof define === 'function' && define.amd
		? define(factory)
		: (global.Pokamnieto = factory());
})(this, function() {
	

	/**
	 * Function that returns information about the position of an element
	 *
	 * @param {HTMLElement} element
	 * @return {Array}
	 */
	function elementPositionInfo(element) {
		const { top, height } = element.getBoundingClientRect();

		return [
			top <= window.innerHeight && top + height >= 0, // is in viewport
			height + top <= 0 ? 'up' : 'down', // position above or below viewport
		];
	}

	/**  @const {Object} defaultConfig default class configuration */
	const defaultConfig = {
		// IntersectionObserver options
		root: null,
		rootMargin: '0px',
		threshold: 0,

		// CSS class names
		elementVisibleClassName: 'is-visible',
		elementPreparedClassName: 'is-prepared',

		// rest
		unmountOnRevealAll: false,
	};

	/**
	 * Pokamnieto class
	 *
	 * @class
	 */
	class Pokamnieto {
		/**
		 * Class for revealing elements when they appear in the view while scrolling the page based on the IntersectionObserver API.
		 *
		 * @param {string} selector
		 * @param {Object} config
		 */
		constructor(selector = '.js-pokamnieto', config = {}) {
			this.elements = [...document.querySelectorAll(selector)];

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
		 *
		 * @return {void}
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
		 *
		 * @return {void}
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
		 * @return {void}
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
		 * @return {void}
		 */
		observe(element) {
			this.observer.observe(element);
			this.state.observedElements += 1;
		}
	}

	return Pokamnieto;
});
