var hasLoaded = document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive";
if (hasLoaded) objectFitImages(null, {watchMQ: true});
else
	document.addEventListener(
		"DOMContentLoaded",
		function() {
			objectFitImages(null, {watchMQ: true});
		},
		false
	);
