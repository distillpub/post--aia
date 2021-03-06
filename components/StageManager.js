// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Example:
// distill.stageManager.add(HTMLElement, {enterStage: callback, exitStage: callback});
//
// Possible callbacks available:
// onEnterBackstage
// onEnterStage
// onEnterSpotlight
// onExitSpotlight
// onExitStage
// onExitBackstage

var distill = distill || {};

distill.stageManager = {

  // A list of the elements that we want to manage.
  cast: [],

  // Add event listeners, setup, etc.
  initialize: function() {
    var that = this;
    window.addEventListener("scroll", function(e) {
      that.cache(); //TODO take out...
      that.scan();
    });
    window.addEventListener("resize", function(e) {
      that.cache();
    });
    this.cache();
  },

  // Cache our position calculations so we can do a scan super fast.
  cache: function() {
    this.cast.forEach(function(actress) {
      var rect = actress.el.getBoundingClientRect();
      actress.top = window.pageYOffset + rect.top;
      actress.bottom = window.pageYOffset + rect.top + rect.height;
      actress.center = actress.top + rect.height / 2;
    });
    this.scan();
  },

  // Because this is unbounded on scroll events, should be super fast.
  scan: function() {
    var stageTop = window.pageYOffset;
    var stageBottom = window.pageYOffset + window.innerHeight;
    var backstageTop = stageTop - 500;
    var backstageBottom = stageBottom + 500;
    var spotlightTop = stageTop + window.innerHeight / 4;
    var spotlightBottom = stageBottom - window.innerHeight / 4;
    this.cast.forEach(function(actress) {
      var backstage = (actress.top < backstageBottom && actress.bottom > backstageTop);
      var stage = (actress.top < stageBottom && actress.bottom > stageTop);
      var spotlight = (actress.center < spotlightBottom && actress.center > spotlightTop);

      if (backstage !== actress.backstage) {
        if (backstage) {
          if (typeof actress.callbacks.enterBackstage === "function") actress.callbacks.enterBackstage.call(actress.el);
        } else {
          if (typeof actress.callbacks.exitBackstage === "function") actress.callbacks.exitBackstage.call(actress.el);
        }
        actress.backstage = backstage;
      }

      if (stage !== actress.stage) {
        if (stage) {
          if (typeof actress.callbacks.enterStage === "function") actress.callbacks.enterStage.call(actress.el);
        } else {
          if (typeof actress.callbacks.exitStage === "function") actress.callbacks.exitStage.call(actress.el);
        }
        actress.stage = stage;
      }

      if (spotlight !== actress.spotlight) {
        if (spotlight) {
          if (typeof actress.callbacks.enterSpotlight === "function") actress.callbacks.enterSpotlight.call(actress.el);
        } else {
          if (typeof actress.callbacks.exitSpotlight === "function") actress.callbacks.exitSpotlight.call(actress.el);
        }
        actress.spotlight = spotlight;
      }

    });
  },

  // Add an element to the cast and define callbacks for state changes.
  add: function(element, callbacks) {
    this.cast.push({
      el: element,
      callbacks: callbacks ? callbacks : {},
      backstage: false,
      stage: false,
      spotlight: false
    });
    this.cache();
  },

  // Remove an element from the cast.
  remove: function(element) {
    this.cast = this.cast.filter(function(e) { return e !== element; });
  }
};

distill.stageManager.initialize();
