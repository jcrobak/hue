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
description: When the user clicks a link with the class '.ccs-submit_form' submit the parent form.
provides: [CCS.JFrame.SubmitLink]
requires: [/CCS.JFrame]
script: CCS.JFrame.SubmitLink.js

...
*/

CCS.JFrame.addGlobalLinkers({
	/*
		submit the form that the element is in.
	*/
	'.ccs-submit_form': function(event, el) {
		el.getParent('form').retrieve('form.request').setOptions({extraData: el.getJSONData('extra-data')}).send();
	}

});