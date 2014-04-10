/**
 * Created by jpi on 05.03.14.
 */

/*
 * jQuery stuff
 * Using jQuery 1.11.0
 */

/**
 * resizes the div#container to the remaining browser height
 */
function resizeContainer() {
	var headerHeight = $("header[role='banner']").css("height");
    var footerHeight = $("footer[role='complementary']").css("height");
	$("#container").css("padding-top", headerHeight).css("margin-top", "-" + headerHeight).css("padding-bottom", footerHeight).css("margin-bottom", "-" + footerHeight);
}

/**
 * $(document).ready
 *
 * initialize jQuery hooks
 */
$(function() {
	resizeContainer();
});