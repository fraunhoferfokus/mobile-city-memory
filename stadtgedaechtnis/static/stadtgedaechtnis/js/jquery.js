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
    var footer = $("footer[role='complementary']");
    footerHeight = footer.css("height");
	$("#container").css({
        paddingTop: headerHeight,
        marginTop: "-" + headerHeight,
        paddingBottom: "0px",
        marginBottom: "0px"
    });
    footer.css({
        height: "0"
    });
}

/**
 * $(document).ready
 *
 * initialize jQuery hooks
 */
$(function() {
	resizeContainer();
});