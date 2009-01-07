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


var f = {
	debug : false,     // true logs to js console
	context_url : null,
	ads_width : 0,
	content : null,
	touch_string : "touched_lol_83475",

	ads_select : '.profile_sidebar_ads, div.UIStandardFrame_SidebarAds, div.UIWashFrame_SidebarAds, div.UICompatibilityFrame_SidebarAds',
	content_select : '#right_column, div.UIStandardFrame_Content, div.UIWashFrame_Content',
	remove_select : '#home_sponsor',


	clear_data : function () {
		this.ads_width = 0;
		this.content = null;
	},


	log : function (msg) {
		if (this.debug)
			GM_log (msg);
	}
}


jQuery.fn.touch = function () {
	return this.each (
		function (i, dom_el) {
			$(this).addClass (f.touch_string);
		});
}


jQuery.fn.touched = function () {
	var almost_one_touched = false;
	this.each (
		function (i, dom_el) {
			if ($(this).is ('.' + f.touch_string)) {
				almost_one_touched = true;
				return false;     // break iteration
			}
		});
	return almost_one_touched;
}



jQuery.fn.stretch = function (increment, property) {
	return this.each (
		function (i, dom_el) {
			var jq = $(dom_el);

			if (!jq.touched ()) {
				var new_prop;
				var old_prop;
				old_prop = jq.css (property);
				if (property == 'background-position') {
					var props = old_prop.split (" ");
					var x = props[0];
					var y = props[1];
					new_prop = (parseInt (x) + parseInt (increment) + 'px');
					new_prop += " " + y;
				} else
					new_prop = (parseInt (old_prop)
						+ parseInt (increment)) + 'px';
				jq.css (property, new_prop);
			}
		})
		.touch();
}



function clean_up (node) {

	/************************************************************
			      SCRIPT BEGINS HERE
	************************************************************/

	var ads = null;
	var body = $('body');

	// Visiting new page.
	if (window.location.href != f.context_url) {
		f.context_url = window.location.href;
		f.clear_data ();
	}

	/*
	 * Sidebar ads.
	 */
	ads = node.find (f.ads_select);
	if (ads.length) {
		f.ads_width = ads.css ('width');
		ads.remove ();

		if (f.content && f.content.length)
			f.content.stretch(f.ads_width, 'width');
	}

	/*
	 * Main content.
	 */
	f.content = node.find (f.content_select);
	if (f.content.length && f.ads_width)
		f.content.stretch (f.ads_width, 'width');

	/*
	 * Other elements that must be removed.
	 */
	node.find(f.remove_select).remove();

	/*
	 * Page-specific fixes.
	 */
	if (!f.ads_width)
		return;

	if (body.is ('.profile')) {
		$('.minifeedwall .story_body, .commentable_item .show_all_link, .commentable_item .wallpost, .commentable_item .comment_box .wallcontent, .commentable_item .comment_box .comments_add_box textarea')
			.stretch (f.ads_width, 'width');
		$('.minifeedwall .from_friend_story .story_content, .minifeedwall .wall_story .story_table, .story .comment_box .walltext').stretch (f.ads_width, 'max-width');

	}

	else if (body.is ('.inbox')) {
		$('.subject_wrap, .main_column, .notifications .body, .s_message .s_message_header')
			.stretch (f.ads_width, 'width');
		$('.notifications, .updates_all').stretch (f.ads_width, 'background-position');
	}

	else if (body.is ('.thread'))
		$('.message .body .text, #compose_message .attached_item, .message .attached_item')
			.stretch (f.ads_width, 'width');

	else if (body.is ('.wall'))
		$('#wall, #wall_text').stretch (f.ads_width, 'width');
}


function handle_inserted (evt) {
	clean_up ($(evt.relatedNode));
}


document.addEventListener ("DOMNodeInserted", handle_inserted ,false);
clean_up ($(document.body));
