// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/*
---
description: Provides functionality for links that load content into a target element via ajax.
provides: [CCS.JFrame.AjaxLoad]
requires: [/CCS.JFrame]
script: CCS.JFrame.AjaxLoad.js
...
*/

(function(){

	CCS.JFrame.addGlobalLinkers({

		//if we are loading a link via ajax, we either replace, append, or inject.

		'[data-ajax-append]': function(event, link){
			var target = $(this).getElement(link.get('data', 'ajax-append'));
			if (!target) {
				link.erase('data-ajax-append');
				dbug.log('could not append to the target element with response; element matching selector %s was not found', link.get('data', 'ajax-replace'));
				this.callClick(event, link, true);
			}
			ajaxLoad.call(this, event, link, target, 'append');
		},

		'[data-ajax-replace]': function(event, link){
			var target = $(this).getElement(link.get('data', 'ajax-replace'));
			if (!target) {
				link.erase('data-ajax-target');
				dbug.log('could not replace target element with response; element matching selector %s was not found', link.get('data', 'ajax-replace'));
				this.callClick(event, link, true);
			}
			ajaxLoad.call(this, event, link, target, 'replace');
		},

		'[data-ajax-target]': function(event, link){
			var target = $(this).getElement(link.get('data', 'ajax-target'));
			if (!target) {
				link.erase('data-ajax-target');
				dbug.log('could not replace target element with response; element matching selector %s was not found', link.get('data', 'ajax-target'));
				this.callClick(event, link, true);
			}
			ajaxLoad.call(this, event, link, target);
		}

	});

	/*
		loads the contents of a link into a specific target
		* event - the event object from the link click
		* link - the link clicked
		* target - where to put the response
		* action - (string; optional) either 'append', 'replace', or 'update' (defaults to 'update')
		
		note:
		* replace means destroy the target and replace it entirely with the response.
		* append means leave everything in place and inject the response after the target.
		* update means empty the target and fill it with the response
	*/

	var ajaxLoad = function(event, link, target, action){

		action = action || 'update';
		var t = target;
		if (action != 'update') t = new Element('div');


		var options = {
			filter: link.get('data', 'ajax-filter'),
			requestPath: link.get('href'),
			spinnerTarget: t,
			target: t,
			ignorePartialRefresh: true,
			ignoreAutoRefresh: true,
			suppressLoadComplete: true,
			retainPath: true,
			callback: function(data){
				switch(action){
					case 'replace':
						data.elements.reverse().injectAfter(target);
						target.destroy();
						break;
					case 'append':
						data.elements.reverse().injectAfter(target);
						break;
					//do nothing for update, as Request.HTML already does it for you
				}
				var state = {
					event: event,
					link: link,
					target: target,
					action: action
				};
				//pass along the data that came back from JFrame's response handler as well as the state of this ajax load.
				this.fireEvent('ajaxLoad', [data, state]);
				this.behavior.fireEvent('update', [data, state]);
			}.bind(this)
		};
		var spinnerTarget = link.get('data', 'spinner-target');
		if (spinnerTarget) {
			spinnerTarget = $(this).getElement(spinnerTarget);
			options.spinnerTarget = spinnerTarget;
		}

		this.load(options);

	};

})();