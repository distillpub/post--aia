
export function plane(x:number, y:number) {
  return {xp: x, yp: y, zp: 0};
}

export function font(x, y) {
  const x1 = Math.max(-0.4, Math.min(0.4, 0.8 * (x - 0.07 * Math.sin(6 * y + 4) + x / 0.6 * y * y)));
  const y1 = Math.max(-0.4, Math.min(0.4, 0.8 * (y - 0.07 * Math.sin(8 * x) + y / 0.6 * x * x)));
  const z1 = Math.sin(x * 20 + y * 3) / 40 + Math.sin(x * 7 - 3) / 10 + Math.sin(y * 10 + x * 3) / 20 + Math.sin(y * 20) / 60;
  return {xp: x1, yp: y1, zp: z1};
}

export function image(x, y) {
  const x1 = 0.8 * (x - 0.03 * Math.sin(6 * y + 4) + x / 0.8 * y * y);
  const y1 = 0.8 * (y - 0.03 * Math.sin(8 * x) + y / 0.8 * x * x);
  const z1 = Math.sin(y * 10 + x * 3) / 20 + Math.sin(y * 20) / 60 //+ Math.sin(x * 20 + y * 3) / 40 + Math.sin(x * 7 - 3) / 10 + ;
  return {xp: x, yp: y, zp: z1};
}