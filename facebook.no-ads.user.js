// facebook-no-ads
// version: 0.1
// 25/12/2008

// version: 0.2
// 26/12/2008
// * fix ads not removed from wall-to-wall pages.


// Copyright (C) 2008  Giacomo Ritucci
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   1. Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//   2. Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.


// ==UserScript==
// @name          facebook-no-ads
// @namespace     http://github.com/rjack/facebook-no-ads
// @description   Remove ads from facebook.
// @include       http://*.facebook.com/*
// ==/UserScript==


var f = new Object();

f.debug = false;     // true logs to js console
f.context_url;
f.ads_width = 0;
f.content = null;
f.touch_string = "touched_lol_83475";

f.xpath_ads = "//div[contains (@class, 'profile_sidebar_ads')]"
                 + "|" +
                 "//div[contains (@class, 'UIStandardFrame_SidebarAds')]"
                 + "|" +
                 "//div[contains (@class, 'UIWashFrame_SidebarAds')]";

f.xpath_content = "//div[@id = 'right_column']"     // profile
                     + "|" +
                     "//div[contains (@class, 'UIStandardFrame_Content')]"
                     + "|" +
                     "//div[contains (@class, 'UIWashFrame_Content')]";


f.clear_data = function () {
	f.ads_width = 0;
	f.content = null;
}


f.log = function (msg) {
	if (f.debug)
		GM_log (msg);
}


f.find_node = function (xpath, node) {
	var xpr;

	xpr = document.evaluate (xpath, node, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
	return xpr.singleNodeValue;
}


document.addEventListener ("DOMNodeInserted",

	function (evt) {

		/************************************************************
					FUNCTIONS
		************************************************************/

		var log_node = function (node) {
			GM_log (node.nodeName + " class = " + node.className);
		}


		var css_get = function (node, css_property) {
			node_style = window.getComputedStyle (node, false);
			return node_style[css_property];
		}


		var css_set = function (node, css_property, value) {
			node.style[css_property] = value;
		}


		var remove_node = function (node) {
			node.parentNode.removeChild (node);
		}


		var stretch_node = function (node, increment, property) {
			var new_prop;

			new_prop = parseInt (css_get (node, property))
			           + parseInt (increment);
			css_set (node, property, new_prop + 'px');
		}


		var touch = function (node) {
			if (!node.className)
				node.className = f.touch_string;
			else
				node.className += " " + f.touch_string;
		}


		var touched = function (node) {
			if (node.className.search (f.touch_string) != -1)
				return true;
			return false;
		}


		/************************************************************
				      SCRIPT BEGINS HERE
		************************************************************/

		var ads = null;
		var new_node = evt.relatedNode;

		// Visiting new page.
		if (window.location.href != f.context_url) {
			f.log ("Page changed.");
			f.context_url = window.location.href;
			f.clear_data ();
		}

		f.log ("Searching for ads...");
		ads = f.find_node (f.xpath_ads, new_node);
		if (ads) {
			f.log ("ads found!");
			f.ads_width = css_get (ads, "width");
			remove_node (ads);
			f.log ("ads removed! :)");

			if (f.content) {
				if (!touched (f.content)) {
					stretch_node (f.content, f.ads_width, 'width');
					touch (f.content);
					f.log ("content already found, now stretched! :D");
				} else
					f.log ("content already stretched.");
			}
		}

		f.log ("Searching for content...");
		f.content = f.find_node (f.xpath_content, new_node);
		if (f.content) {
			f.log ("content found!");

			if (f.ads_width && !touched (f.content)) {
				stretch_node (f.content, f.ads_width, 'width');
				touch (f.content);
				f.log ("ads already removed, content stretched! :D");
			}
		}
	},

	false);
