// facebook-no-ads: a greasemonkey script that removes ads from facebook.
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


// CHANGELOG
//
// version: 0.3
// XXX/XXX/XXX
// * almost complete rewrite using jquery
// * stretch inbox entries
//
// version: 0.2bis.1
// 30/12/2008
// * remove sponsor box from home page.
//
// version: 0.2bis
// 28/12/2008
// * almost complete rewrite: inspect the inserted node only and not the whole
//   dom.
// * fix ads not removed from error pages.
//
// version: 0.2
// 26/12/2008
// * fix ads not removed from wall-to-wall pages.
//
// version: 0.1
// 25/12/2008


// ==UserScript==
// @name          facebook-no-ads
// @namespace     http://github.com/rjack/facebook-no-ads
// @description   Remove ads from facebook - v0.3
// @include       http://*.facebook.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js
// ==/UserScript==


var f = new Object();

f.debug = false;     // true logs to js console
f.context_url = null;
f.ads_width = 0;
f.content = null;
f.touch_string = "touched_lol_83475";

f.ads_select = '.profile_sidebar_ads, div.UIStandardFrame_SidebarAds, div.UIWashFrame_SidebarAds, div.UICompatibilityFrame_SidebarAds';
f.content_select = '#right_column, div.UIStandardFrame_Content, div.UIWashFrame_Content';
f.remove_select = '#home_sponsor';


f.clear_data = function () {
	f.ads_width = 0;
	f.content = null;
}


f.log = function (msg) {
	if (f.debug)
		GM_log (msg);
}


function clean_up (node) {

	/************************************************************
				FUNCTIONS
	************************************************************/

	var stretch_node = function (jq, increment, property) {
		var new_prop;
		var old_prop;

		old_prop = jq.css (property);
		new_prop = (parseInt (old_prop)
			    + parseInt (increment)) + 'px';
		jq.css (property, new_prop);
	}


	var touch = function (jq) {
		jq.addClass (f.touch_string);
	}


	var touched = function (jq) {
		return jq.is ('.' + f.touch_string);
	}


	/************************************************************
			      SCRIPT BEGINS HERE
	************************************************************/

	var ads = null;

	// Visiting new page.
	if (window.location.href != f.context_url) {
		f.log ('Page changed.');
		f.context_url = window.location.href;
		f.clear_data ();
	}

	/*
	 * Sidebar ads.
	 */
	f.log ('Searching for ads sidebar...');
	ads = node.find (f.ads_select);
	f.log ('ads.length = ' + ads.length);
	if (ads.length) {
		f.log ('ads found!');
		f.ads_width = ads.css ('width');
		ads.remove ();
		f.log ('ads removed!');

		if (f.content && f.content.length) {
			if (!touched (f.content)) {
				stretch_node (f.content, f.ads_width, 'width');
				touch (f.content);
				f.log ('content already found, now stretched! :D');
			} else
				f.log ('content already stretched.');
		}
	}

	/*
	 * Main content.
	 */
	f.log ('Searching for content...');
	f.content = node.find (f.content_select);
	f.log ('f.content.length = ' + f.content.length);
	if (f.content.length) {
		f.log ('content found!');

		if (f.ads_width && !touched (f.content)) {
			stretch_node (f.content, f.ads_width, 'width');
			touch (f.content);
			f.log ('ads already removed, content stretched! :D');
		}
	}

	/*
	 * Other elements that must be removed.
	 */
	node.find(f.remove_select).remove();
	// inbox .subject_wrap width
}


function handle_inserted (evt) {
	clean_up ($(evt.relatedNode));
}


document.addEventListener ("DOMNodeInserted", handle_inserted ,false);
clean_up ($(document.body));
