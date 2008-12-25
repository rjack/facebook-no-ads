// facebook-no-ads
// version: 0.1
// 25/12/2008


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


		var log_node = function (node) {
			GM_log (node.nodeName + " class = " + node.className);
		}


		var find_ads_node = function () {
			var ads_nodes = null;
			var ads_class = new Array ("profile_sidebar_ads",
			                           "UIStandardFrame_SidebarAds");

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
			                               "UIStandardFrame_Content");

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
	},

	false);
