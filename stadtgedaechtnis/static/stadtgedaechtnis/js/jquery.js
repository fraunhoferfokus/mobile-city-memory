/**
 * Created by jpi on 05.03.14.
 */

/*
 * jQuery stuff
 * Using jQuery 1.11.0
 */

var footerHeight;
var footerSwipeHeight;

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
 * Initializes the swipe ability on the footer.
 */
function initializeSwiping() {
    $("footer[role='complementary']").swipe({
        swipeStatus: function(event, phase, direction, distance) {
            // handles the current swipe
            if (phase === "start") {
                var cssHeight = $("footer[role='complementary']").css("height");
                footerSwipeHeight = parseInt(cssHeight.substring(0, cssHeight.length - 2));
            }
            var newPadding = footerSwipeHeight + (direction === "up" ? distance : -distance);
            $("#container").css({
                paddingBottom: newPadding + "px",
                marginBottom: "-" + newPadding + "px"
            });
            $("footer[role='complementary']").css({
                height: newPadding + "px"
            })
        }
    });
}

/**
 * $(document).ready
 *
 * initialize jQuery hooks
 */
$(function() {
	resizeContainer();
    initializeSwiping();
});