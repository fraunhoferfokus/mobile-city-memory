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
	$("#container").css("padding-top", headerHeight).css("margin-top", "-" + headerHeight).css("padding-bottom", "0px").css("margin-bottom", "0px");
    $("footer[role='complementary']").css("height", "0rem");
}

/**
 * $(document).ready
 *
 * initialize jQuery hooks
 */
$(function() {
	resizeContainer();
});