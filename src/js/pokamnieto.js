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

		if (this.config.initImmediately) {
			this.initObserver();
		} else {
			window.addEventListener('scroll', this.prepareElements.bind(this));
		}
	}

	/**
	 * Function that prepare elements to reveal animation.
	 * It fired only once after the first page rewind.
	 */
	prepareElements() {
		const { elementPreparedClassName } = this.config;

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

		window.removeEventListener('scroll', this.prepareElements.bind(this));

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
			}
		});
	}

	/**
	 * Public method that adds another element to the IntersectionObserver instance
	 *
	 * @param {Element} element
	 */
	observe(element) {
		this.observer.observe(element);
	}
}
