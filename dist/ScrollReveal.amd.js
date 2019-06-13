define(function() {
	'use strict';

	/**
	 * Function that returns information about the position of an element
	 *
	 * @param {Element} element
	 * @returns {Array}
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
		root: null,
		rootMargin: '0px',
		threshold: 1,
		visibleClass: 'in-visible',
	};

	/**
	 * ScrollReveal class
	 *
	 * @class
	 */
	class ScrollReveal {
		/**
		 * Constructor of the class
		 *
		 * @param {(String|NodeList|Element[]|Element)} elements
		 * @param {Object} config
		 */
		constructor(elements = '.js-scroll-observer', config = {}) {
			if (elements instanceof Element) {
				this.elements = [elements];
			} else if (elements instanceof NodeList) {
				this.elements = Array.from(elements);
			} else if (elements instanceof String) {
				this.elements = Array.from(document.querySelectorAll(elements));
			} else if (elements instanceof Array) {
				this.elements = elements;
			} else {
				throw new Error(
					"The argument 'elements' passed is not an instance of Element, NodeList, String or Array",
				);
			}

			this.config = Object.assign({}, defaultConfig, config);

			window.addEventListener('scroll', this.prepareElements.bind(this));
		}

		/**
		 * Function that prepare elements to reveal animation.
		 * It fired only once after the first page rewind.
		 *
		 *
		 * @returns {Void}
		 */
		prepareElements() {
			this.elements = this.elements.filter(element => {
				const [isInViewport, viewportPosition] = elementPositionInfo(element);

				/**
				 * Adds a "prepared class" only to elements outside of the viewport.
				 * An additional class adds a class with information about whether the item is above or below the viewport.
				 */
				if (!isInViewport) {
					element.classList.add(viewportPosition);
					element.classList.add(this.config.preparedClass);
				}

				return !isInViewport;
			});

			window.removeEventListener('scroll', this.prepareElements.bind(this));

			this.initObserver();
		}

		/**
		 * Function that initializes the IntersectionObserver instance
		 *
		 * @returns {Void}
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
		 * @returns {Void}
		 */
		callback(entries) {
			entries.forEach(entry => {
				const { target } = entry;

				if (entry.isIntersecting) {
					target.classList.add(this.config.visibleClass);

					this.observer.unobserve(target);
				}
			});
		}

		/**
		 * Public method that adds another element to the IntersectionObserver instance
		 *
		 * @param {Element} element
		 * @returns {Void}
		 */
		observe(element) {
			this.observer.observe(element);
		}
	}

	return ScrollReveal;
});
