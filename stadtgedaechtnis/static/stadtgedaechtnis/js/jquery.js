/**
 * Created by jpi on 05.03.14.
 */

/*
 * jQuery stuff
 * Using jQuery 1.11.0
 */

var footerHeight;
var footerSwipeHeight;
var swipeThreshold;

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
    var footer = $("footer[role='complementary']");
    var container = $("#container");

    swipeThreshold = container.height() / 2;

    footer.swipe({
        swipeStatus: function(event, phase, direction, distance) {
            // handles the current swipe
            if (phase === "start") {
                var cssHeight = footer.css("height");
                footerSwipeHeight = parseInt(cssHeight.substring(0, cssHeight.length - 2));
            } else if (phase === "cancel") {
                $("footer[role='complementary']").transition({height: footerHeight}, 200, "ease");
                $("#container").transition({paddingBottom: footerHeight, marginBottom: "-" + footerHeight}, 200, "ease");
            } else if (phase === "end") {
                $("footer[role='complementary']").transition({height: "1000px"}, 200, "ease");
                $("#container").transition({paddingBottom: "1000px", marginBottom: "-" + "1000px"}, 200, "ease");
            }
            var newPadding = footerSwipeHeight + (direction === "up" ? distance : -distance);
            container.css({
                paddingBottom: newPadding + "px",
                marginBottom: "-" + newPadding + "px"
            });
            footer.css({
                height: newPadding + "px"
            })
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