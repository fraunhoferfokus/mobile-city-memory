/**
 * Created by jpi on 05.03.14.
 */

/*
 * jQuery stuff
 * Using jQuery 1.11.0
 */

var footerHeight;

/**
 * resizes the div#container to the remaining browser height
 */
function resizeContainer() {
	var headerHeight = $("header[role='banner']").css("height");
    footerHeight = $("footer[role='complementary']").css("height");
	$("#container").css("padding-top", headerHeight).css("margin-top", "-" + headerHeight).css("margin-bottom", "-" + footerHeight);
}

/**
 * $(document).ready
 *
 * initialize jQuery hooks
 */
$(function() {
	resizeContainer();
});