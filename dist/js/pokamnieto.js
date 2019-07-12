/**
 * @package pokamnieto - A lightweight for revealing elements when they appear in the view while scrolling the page based on the IntersectionObserver API.
 * @version v1.0.0
 * @link https://github.com/tyczynski/pokamnieto.js
 * @author Przemysław Tyczyński | https://tyczynski.pl
 * @license MIT
 */
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Pokamnieto = factory();
})(this, function () {
  'use strict';
  /**
   * Function that returns information about the position of an element
   *
   * @param {Element} element
   * @return {Array}
   */

  function elementPositionInfo(element) {
    var _element$getBoundingC = element.getBoundingClientRect(),
        top = _element$getBoundingC.top,
        height = _element$getBoundingC.height;

    return [top <= window.innerHeight && top + height >= 0, // is in viewport
    height + top <= 0 ? 'up' : 'down'];
  }
  /**  @const {Object} defaultConfig default class configuration */


  var defaultConfig = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
    initImmediately: true,
    elementVisibleClassName: 'is-visible',
    elementPreparedClassName: 'is-prepared'
  };
  /**
   * Pokamnieto class
   *
   * @class
   */

  var Pokamnieto =
  /*#__PURE__*/
  function () {
    /**
     * Class for revealing elements when they appear in the view while scrolling the page based on the IntersectionObserver API.
     *
     * @param {String} elements
     * @param {Object} config
     */
    function Pokamnieto() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.js-pokamnieto';
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Pokamnieto);

      this.elements = Array.from(document.querySelectorAll(elements));
      this.config = _extends({}, defaultConfig, config);

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


    _createClass(Pokamnieto, [{
      key: "prepareElements",
      value: function prepareElements() {
        var elementPreparedClassName = this.config.elementPreparedClassName;
        /**
         * Filter items in the current viewport
         */

        this.elements = this.elements.filter(function (element) {
          var _elementPositionInfo = elementPositionInfo(element),
              _elementPositionInfo2 = _slicedToArray(_elementPositionInfo, 2),
              isInViewport = _elementPositionInfo2[0],
              viewportPosition = _elementPositionInfo2[1];
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

    }, {
      key: "initObserver",
      value: function initObserver() {
        this.observer = new IntersectionObserver(this.callback.bind(this), {
          root: this.config.root,
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        });

        for (var i = 0; i < this.elements.length; i += 1) {
          this.observer.observe(this.elements[i]);
        }
      }
      /**
       * Callback for the IntersectionObserver instance
       *
       * @param {Array} entries
       */

    }, {
      key: "callback",
      value: function callback(entries) {
        var _this = this;

        var elementVisibleClassName = this.config.elementVisibleClassName;
        entries.forEach(function (entry) {
          var target = entry.target;

          if (entry.isIntersecting) {
            target.classList.add(elementVisibleClassName);

            _this.observer.unobserve(target);
          }
        });
      }
      /**
       * Public method that adds another element to the IntersectionObserver instance
       *
       * @param {Element} element
       */

    }, {
      key: "observe",
      value: function observe(element) {
        this.observer.observe(element);
      }
    }]);

    return Pokamnieto;
  }();

  return Pokamnieto;
});