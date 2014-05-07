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
var up = false;

/**
 * resizes the main element to the remaining browser height
 */
function resizeContainer() {
	headerHeight = $("header[role='banner']").css("height");
    var footer = $("section#article-section");
    footerHeight = footer.css("height");
	$("main").css({
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
    var footer = $("section#article-section");
    var footerHeading = $("div.article-heading");
    var container = $("main");

    var swipeThreshold = container.height() * 0.3;
    var maxPadding = container.height() + "px";

    footerHeading.swipe({
        swipeStatus: function(event, phase, direction, distance) {
            if (phase === "start") {
                var cssHeight = footer.css("height");
                footerSwipeHeight = parseInt(cssHeight.substring(0, cssHeight.length - 2));
            }
            // handles the current swipe
            if ((up && direction === "down") || (!up && direction === "up")) {
                if (phase === "cancel") {
                    var newPadding = (direction === "up" ? footerHeight : maxPadding);
                    footer.transition({height: newPadding}, 200, "ease");
                    container.transition({paddingBottom: newPadding, marginBottom: "-" + newPadding}, 200, "ease");
                } else if (phase === "end") {
                    var newPadding = (direction === "up" ? maxPadding : footerHeight);
                    footer.transition({height: newPadding}, 200, "ease");
                    container.transition({paddingBottom: newPadding, marginBottom: "-" + newPadding}, 200, "ease");
                    $("div.entry-list ul li").css("overflow-y", direction === "up" ? "auto" : "hidden");
                    up = (direction === "up" ? true : false);
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
    $("img#load-more").hide();
});