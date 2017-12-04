export function generateArrow(x1:number, y1:number, x2:number, y2:number, flangeSize:number, padding1:number, padding2:number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  let multiplier1 = padding1 / length;
  const dx1 = dx * multiplier1;
  const dy1 = dy * multiplier1;

  let multiplier2 = padding2 / length;
  const dx2 = dx * multiplier2;
  const dy2 = dy * multiplier2;

  var px = y1 - y2;
  var py = x2 - x1;
  let plength = Math.sqrt(px * px + py * py);
  let pmultiplier = flangeSize / plength;

  const px1 = px * pmultiplier;
  const py1 = py * pmultiplier;

  const sx = dx * pmultiplier;
  const sy = dy * pmultiplier;

  const a1 = x1 + dx1;
  const b1 = y1 + dy1;
  const a2 = x2 - dx2;
  const b2 = y2 - dy2;

  return [
    [[a1, b1], [a2, b2]],
    [[a2 + px1 - sx, b2 + py1 - sy], [a2, b2], [a2 - px1 - sx, b2 - py1 -sy]]
  ];
}