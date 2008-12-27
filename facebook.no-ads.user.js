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


document.addEventListener ("DOMNodeInserted",

	function (evt) {

		var ads = null;
		var content = null
		var ads_width = 0;
		var content_width = 0;


		/************************************************************
					FUNCTIONS
		************************************************************/

		var log_node = function (node) {
			GM_log (node.nodeName + " class = " + node.className);
		}


		var visiting_profile = function () {
			if (document.body.className.search ("^profile ") != -1)
				return true;
			return false;
		}


		var visiting_inbox = function () {
			if (document.body.className.search ("^inbox ") != -1)
				return true;
			return false;
		}


		var visiting_wall_to_wall = function () {
			if (document.body.className.search ("^wall ") != -1)
				return true;
			return false;
		}


		var visiting_ubersearch = function () {
			if (document.body.className.search ("^ubersearch ") != -1)
				return true;
			return false;
		}


		var find_ads_node = function () {
			var ads_nodes = null;
			var ads_class = new Array ("profile_sidebar_ads",
			                           "UIStandardFrame_SidebarAds",
			                           "UIWashFrame_SidebarAds");

			for (var i = 0;
			     i < ads_class.length
			     && (!ads_nodes|| ads_nodes.length == 0);
			     i++)
				ads_nodes = document.getElementsByClassName (ads_class[i]);

			if (ads_nodes.length > 1) {
				GM_log ("OOPS! found " + ads_nodes.length + "ads_nodes!")
				return null;
			}
			return ads_nodes[0];
		}


		var find_content_node = function () {
			var content_nodes = null;
			var content_class = new Array ("right_column",
			                               "UIStandardFrame_Content",
						       "UIWashFrame_Content");

			for (var i = 0;
			     i < content_class.length
			     && (!content_nodes || content_nodes.length == 0);
			     i++)
				content_nodes = document.getElementsByClassName (content_class[i]);

			if (content_nodes.length > 1) {
				GM_log ("OOPS! found " + ads_nodes.length + "content_nodes!")
				return null;
			}
			return content_nodes[0];
		}


		var get_width = function (node) {
			node_style = window.getComputedStyle (node, false);
			return parseInt (node_style.width);
		}


		var set_width = function (node, width) {
			node.style.width = width + "px";
		}


		var remove_node = function (node) {
			if (node)
				node.parentNode.removeChild (node);
		}


		var fix_profile = function () {
			GM_log ("fix_profile");

			// XXX UGLIEST XPATH EVER!
			// .minifeedwall .from_friend_story
			// .minifeedwall .from_friend_story .story_content
			// .minifeedwall .story_body
			// .minifeedwall .story_body .story_with_photo .story_photo_metadata
			// .commentable_item .show_all_link
			// .commentable_item .wallpost
			// .commentable_item .comment_box .wallcontent
			// .commentable_item .comment_box .comments_add_box textarea
			// .story .comment_box .walltext

			var xpr = document.evaluate (
"//div[contains(@class,'minifeedwall')]//div[contains(@class,'from_friend_story')]"
+ "|" +
"//div[contains(@class,'minifeedwall')]//div[contains(@class,'from_friend_story')]//div[contains(@class,'story_content')]"
+ "|" +
"//div[contains(@class,'minifeedwall')]//div[contains(@class,'story_body')]"
+ "|" +
"//div[contains(@class,'minifeedwall')]//div[contains(@class,'story_body')]//div[contains(@class,'story_with_photo')]//div[contains(@class,'story_photo_metadata')]"
+ "|" +
"//div[contains(@class,'commentable_item')]//div[contains(@class,'show_all_link')]"
+ "|" +
"//div[contains(@class,'commentable_item')]//div[contains(@class,'wallpost')]"
+ "|" +
"//div[contains(@class,'commentable_item')]//div[contains(@class,'comment_box')]//div[contains(@class,'wallcontent')]"
+ "|" +
"//div[contains(@class,'commentable_item')]//div[contains(@class,'comment_box')]//div[contains(@class,'comments_add_box')]//textarea"
+ "|" +
"//div[contains(@class,'story')]//div[contains(@class,'comment_box')]//div[contains(@class,'walltext')]"
,
					document,
					null,
					XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
					null);

			for (var i = 0; i < xpr.snapshotLength; i++) {
				var node = xpr.snapshotItem (i);
				set_width (node, ads_width + get_width (node));
			}
		}


		var fix_inbox = function () {
			GM_log ("fix_inbox");
		}


		var fix_wall_to_wall = function () {
			GM_log ("fix_wall_to_wall");
		}


		var fix_ubersearch = function () {
			GM_log ("fix_ubersearch");
		}


		/************************************************************
				      SCRIPT BEGINS HERE
		************************************************************/

		GM_log ("### EVENT FIRED! ###");

		ads = find_ads_node ();
		if (!ads)
			return;

		content = find_content_node ();
		if (!content)
			return;

		ads_width = get_width (ads);
		content_width = get_width (content);

		remove_node (ads);
		set_width (content, content_width + ads_width);

		if (visiting_profile ())
			fix_profile ();
		else if (visiting_inbox ())
			fix_inbox ();
		else if (visiting_wall_to_wall ())
			fix_wall_to_wall ();
		else if (visiting_ubersearch ())
			fix_ubersearch ();
	},

	false);
