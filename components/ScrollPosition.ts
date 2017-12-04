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