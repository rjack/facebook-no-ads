// ==UserScript==
// @name          node-inserted-listener.user.js
// @namespace     http://rjack.altervista.org/node-inserted-listener
// @description   Test DOMNodeInserted events
// @include       http://www.facebook.com/*
// ==/UserScript==

function watch_node_insertions (evt) {
	var msg = "\nwatch_node_insertions:\n";
	var attrs = evt.relatedNode.attributes;

	for (i = 0; i < attrs.length; i++)
		msg = msg + attrs[i].name + " = " + attrs[i].value + "\n";

	GM_log (msg);
}


document.addEventListener ("DOMNodeInserted", watch_node_insertions, false);
