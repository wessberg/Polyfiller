/**
 * This hook injects the object-fit polyfill such that existing and all future images will be 'object-fit'ed
 * @type {string}
 */
// language=JavaScript
export const OBJECT_FIT_HOOK = `
	(function () {
		var hasLoaded = document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive";
		if (hasLoaded) objectFitImages();
		else document.addEventListener("DOMContentLoaded", function () { objectFitImages() }, false);
	})();
`;