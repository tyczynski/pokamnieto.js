/**  @const {Object} defaultConfig default class configuration */
const defaultConfig = {
	// IntersectionObserver options
	root: null,
	rootMargin: '0px',
	threshold: 0,

	elementVisibleClassName: 'is-visible',
	elementPreparedClassName: 'is-prepared',

	unmountOnRevealAll: false,
};

export default defaultConfig;
