/**
 * Function that returns information about the position of an element
 *
 * @param {Element} element
 * @return {Array}
 */
export default function elementPositionInfo(element) {
	const { top, height } = element.getBoundingClientRect();

	return [
		top <= window.innerHeight && top + height >= 0, // is in viewport
		height + top <= 0 ? 'up' : 'down', // position above or below viewport
	];
}
