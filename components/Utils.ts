import {Array1D, Scalar, NDArrayMathCPU} from 'deeplearn';

const math = new NDArrayMathCPU(false);

//
export function interpolateLinear(embedding0, embedding1, ratio) {
  return math.add(embedding0, math.scalarTimesArray(ratio, math.sub(embedding1, embedding0)));
}

export function linearCombination(startPoint, direction, factor) {
  let result =  math.add(startPoint, math.scalarTimesArray(factor, direction));
  return result;
}

export function linearCombinationNormalized(startPoint, direction, factor) {
  const mag = norm(startPoint);
  let result =  math.add(startPoint, math.scalarTimesArray(factor, direction));
  const normalizedResult = math.scalarTimesArray(mag, unit(result));
  return normalizedResult;
}

export function direction(left, right) {
  return unit(math.sub(right, left));
}

//
export function average(arr) {
  if (arr.length === 0) return 0;
  let sum = Array1D.zerosLike(arr[0]);
  arr.forEach(a => {
    sum = math.add(sum, a)
  });
  return math.arrayDividedByScalar(sum, Scalar.new(arr.length));
}

//
export function analogizeOnSphere(latentVector, analogyVector, theta) {
  let lunit = unit(latentVector);
  let lnorm = norm(latentVector);

  const dot = math.dotProduct(analogyVector, lunit);
  const scaled = math.scalarTimesArray(dot, lunit);
  const subtracted = math.sub(analogyVector, scaled);
  const n = unit(subtracted);

  const sin = Scalar.new(Math.sin(theta));
  const cos = Scalar.new(Math.cos(theta));

  const lXcos = math.scalarTimesArray(cos, latentVector)
  const nXsin = math.scalarTimesArray(sin, n);

  const m = math.scalarTimesArray(lnorm, math.add(lXcos, nXsin));
  return m;
}

//
export function norm(v) {
  return math.sqrt(math.sum(math.multiply(v, v)))
}

//
export function unit(v) {
  const n = Scalar.new(norm(v).get())
  if (n.get() === 0) console.warn("Divide by zero")
  return math.arrayDividedByScalar(v, n);
};

