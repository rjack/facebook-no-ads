// facebook-no-ads
// Untagged version: DO NOT USE
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
