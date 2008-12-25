// ==UserScript==
// @name          fb-no-ads
// @namespace     http://rjack.altervista.org/fb-no-ads
// @description   Disable advertising on facebook.
// @include       http://www.facebook.com/*
// ==/UserScript==

function remove_ads_and_fix_width () {

	var ads = null;
	var ads_column = null;
	var right_column = null;
	var ads_column_style = null;
	var right_column_style = null;
	var wall_width = null;

	ads = document.getElementById ("sidebar_ads");
	if (ads != null)
		ads_column = ads.parentNode;

	right_column = document.getElementById ("right_column");

	if (ads_column != null && right_column != null) {
		ads_column_style = window.getComputedStyle (ads_column, null);
		right_column_style = window.getComputedStyle (right_column, null);
		wall_width = (parseInt (right_column_style.width) + parseInt (ads_column_style.width)) + "px";

		right_column.style.width = wall_width;
		ads_column.parentNode.removeChild (ads_column);
	}
}
