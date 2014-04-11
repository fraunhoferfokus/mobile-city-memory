/**
 * Created by jpi on 05.03.14.
 */

/*
 * jQuery stuff
 * Using jQuery 1.11.0
 */

var footerHeight;
var headerHeight;
var footerSwipeHeight;

/**
 * resizes the div#container to the remaining browser height
 */
function resizeContainer() {
	headerHeight = $("header[role='banner']").css("height");
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
    var footer = $("footer[role='complementary']");
    var container = $("#container");

    var swipeThreshold = container.height() / 2;
    var maxPadding = container.height() + "px";

    footer.swipe({
        swipeStatus: function(event, phase, direction, distance) {
            // handles the current swipe
            if (phase === "start") {
                var cssHeight = footer.css("height");
                footerSwipeHeight = parseInt(cssHeight.substring(0, cssHeight.length - 2));
            } else if (phase === "cancel") {
                var newPadding = (direction === "up" ? footerHeight : maxPadding);
                footer.transition({height: newPadding}, 200, "ease");
                container.transition({paddingBottom: newPadding, marginBottom: "-" + newPadding}, 200, "ease");
            } else if (phase === "end") {
                var newPadding = (direction === "up" ? maxPadding : footerHeight);
                footer.transition({height: newPadding}, 200, "ease");
                container.transition({paddingBottom: newPadding, marginBottom: "-" + newPadding}, 200, "ease");
            } else {
                var newPadding = footerSwipeHeight + (direction === "up" ? distance : -distance);
                container.css({
                    paddingBottom: newPadding + "px",
                    marginBottom: "-" + newPadding + "px"
                });
                footer.css({
                    height: newPadding + "px"
                })
            }
        },
        checkThresholds: true,
        maxTimeThreshold: 300,
        threshold: swipeThreshold
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