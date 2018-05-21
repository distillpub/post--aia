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

import {scaleLinear} from 'd3-scale';

const scale = scaleLinear();

export function onscroll() {
  const min = -Math.PI / 12;
  const max = Math.PI / 8;
  const bb = this.refs.root.getBoundingClientRect();
  const s = scale
    .domain([0, window.innerHeight + bb.height])
    .range([max, min])
    .clamp(true);
  const angle = s(bb.bottom);
  if (angle > min && angle < max) {
    this.set({angle});
  }
}