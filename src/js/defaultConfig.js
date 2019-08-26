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

export default defaultConfig;
