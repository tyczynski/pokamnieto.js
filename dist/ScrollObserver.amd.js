define(['exports'], function (exports) { 'use strict';

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
   * @param {String} elements
   * @param {Object} config
   */
  constructor(elements, config) {
    this.elements = document.querySelectorAll(elements);
    this.config = Object.assign({}, defaultConfig, config);

    this.observer = new IntersectionObserver(this.callback.bind(this), {
      root: this.config.root,
      rootMargin: this.config.rootMargin,
      threshold: this.config.threshold,
    });

    for (let i = 0; i < this.elements.length; i++) {
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
      const target = entry.target;

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

  /**
   * The static method that checks the passed argument and returns a list with elements
   *
   * @param {(Element|NodeList|string)} elements
   * @returns {(Element[]|NodeList)}
   */
  static getElements(elements) {
    if (elements instanceof Element) {
      return [elements];
    } else if (elements instanceof NodeList) {
      return elements;
    } else if (elements instanceof String) {
      return document.querySelectorAll(elements);
    }
  }
}

exports.ScrollReveal = ScrollReveal;

Object.defineProperty(exports, '__esModule', { value: true });

});
