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

// inspired via https://bl.ocks.org/mbostock/6047b93d9d37bc1d8f89

export class IsometricProjector {
  private matrix:Array<number>;
  private _identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0
  ];

  private _height: number = 100;
  private _width: number = 100;
  private _scale: number = 1.55;

  private _angle: number = 0;
  private _angleX: number = 0;
  private _angleY: number = 0;
  private _angleZ: number = 0.2;

  private _context: CanvasRenderingContext2D;

  private _isometricAngle = Math.PI / 6;
  private projection = [
    Math.cos(this._isometricAngle), Math.cos(Math.PI - this._isometricAngle),
    -Math.sin(this._isometricAngle), -Math.sin(Math.PI - this._isometricAngle)
  ];

  constructor(width = 100, height = 100, scale = 1.55) {
    this.width = width;
    this.height = height;
    this.scale = scale;
  }

  project(x0:number, y0:number, z0:number) {

    // Transform
    const xt = x0 * this.matrix[0] + y0 * this.matrix[1] + z0 * this.matrix[2] + this.matrix[3];
    const yt = x0 * this.matrix[4] + y0 * this.matrix[5] + z0 * this.matrix[6] + this.matrix[7];
    const zt = x0 * this.matrix[8] + y0 * this.matrix[9] + z0 * this.matrix[10] + this.matrix[11];

    // Project
    const xp = xt * this.projection[0] + yt * this.projection[1];
    const yp = xt * this.projection[2] + yt * this.projection[3] - zt;

    return {
      x: xp + this.width / 2,
      y: yp + this.height / 2
    };
  }

  private apply() {
    this.matrix = this._identityMatrix.slice();

    // Scale
    const s = this.width / this.scale;
    this.matrix[0] *= s;
    this.matrix[1] *= s;
    this.matrix[2] *= s;
    this.matrix[4] *= s;
    this.matrix[5] *= s;
    this.matrix[6] *= s;
    this.matrix[8] *= s;
    this.matrix[9] *= s;
    this.matrix[10] *= s;

    // Viewport angle rotation about a custom unit vector

    let a, b, c, d, e, f, g, h, i, j, k, l, cos, sin;

    cos = Math.cos(this.angle);
    sin = Math.sin(this.angle);

    let ux = -1 / Math.sqrt(2);
    let uy = 1 / Math.sqrt(2);
    let uz = 0;

    let m0 = cos + ux * ux * (1 - cos);
    let m1 = ux * uy * (1 - cos);
    let m2 = uy * sin;

    let m3 = uy * ux * (1 - cos);
    let m4 = cos + uy * uy * (1 - cos);
    let m5 = -ux * sin;

    let m6 = -uy * sin;
    let m7 = ux * sin;
    let m8 = cos;

    a = this.matrix[0];
    b = this.matrix[1];
    c = this.matrix[2];
    d = this.matrix[3];
    e = this.matrix[4];
    f = this.matrix[5];
    g = this.matrix[6];
    h = this.matrix[7];
    i = this.matrix[8];
    j = this.matrix[9];
    k = this.matrix[10];
    l = this.matrix[11];

    this.matrix[0] = a * m0 + b * m3 + c * m6;
    this.matrix[1] = a * m1 + b * m4 + c * m7;
    this.matrix[2] = a * m2 + b * m5 + c * m8;

    this.matrix[4] = e * m0 + f * m3 + g * m6;
    this.matrix[5] = e * m1 + f * m4 + g * m7;
    this.matrix[6] = e * m2 + f * m5 + g * m8;

    this.matrix[8] = i * m0 + j * m3 + k * m6;
    this.matrix[9] = i * m1 + j * m4 + k * m7;
    this.matrix[10] =i * m2 + j * m5 + k * m8;


    // Rotate Z
    cos = Math.cos(this.angleZ);
    sin = Math.sin(this.angleZ);
    a = this.matrix[0];
    b = this.matrix[1];
    c = this.matrix[2];
    d = this.matrix[3];
    e = this.matrix[4];
    f = this.matrix[5];
    g = this.matrix[6];
    h = this.matrix[7];
    i = this.matrix[8];
    j = this.matrix[9];
    k = this.matrix[10];
    l = this.matrix[11];
    this.matrix[0] = a * cos + b * sin;
    this.matrix[1] = a * -sin + b * cos;
    this.matrix[4] = e * cos + f * sin;
    this.matrix[5] = e * -sin + f * cos;
    this.matrix[8] = i * cos + j * sin;
    this.matrix[9] = i * -sin + j * cos;

    // // Rotate Y
    // cos = Math.cos(-this.angleY);
    // sin = Math.sin(-this.angleY);
    // a = this.matrix[0];
    // b = this.matrix[1];
    // c = this.matrix[2];
    // d = this.matrix[3];
    // e = this.matrix[4];
    // f = this.matrix[5];
    // g = this.matrix[6];
    // h = this.matrix[7];
    // i = this.matrix[8];
    // j = this.matrix[9];
    // k = this.matrix[10];
    // l = this.matrix[11];
    // this.matrix[0] = a * cos + b * -sin;
    // this.matrix[2] = a * sin + c * cos;
    // this.matrix[4] = e * cos + g * -sin;
    // this.matrix[6] = e * sin + g * cos;
    // this.matrix[8] = i * cos + k * -sin;
    // this.matrix[10] = i * sin + k * cos;

    // // Rotate X
    // cos = Math.cos(this.angleX);
    // sin = Math.sin(this.angleX);
    // a = this.matrix[0];
    // b = this.matrix[1];
    // c = this.matrix[2];
    // d = this.matrix[3];
    // e = this.matrix[4];
    // f = this.matrix[5];
    // g = this.matrix[6];
    // h = this.matrix[7];
    // i = this.matrix[8];
    // j = this.matrix[9];
    // k = this.matrix[10];
    // l = this.matrix[11];
    // this.matrix[1] = b * cos + c * sin;
    // this.matrix[2] = b * -sin + c * cos;
    // this.matrix[5] = f * cos + g * sin;
    // this.matrix[6] = f * -sin + g * cos;
    // this.matrix[9] = j * cos + k * sin;
    // this.matrix[10] = j * -sin + k * cos;


  }

  // Drawing call proxies for canvas contexts

  moveTo(x0:number, y0:number, z0:number) {
    const p = this.project(x0, y0, z0);
    this.context.moveTo(p.x, p.y);
  }

  lineTo(x0:number, y0:number, z0:number) {
    const p = this.project(x0, y0, z0);
    this.context.lineTo(p.x, p.y);
  }

  set context(ctx:CanvasRenderingContext2D) {
    this._context = ctx;
  }

  get context() {
    return this._context;
  }

  // Getters/Setters

  set width(w:number) {
    this._width = w;
    this.apply();
  }

  get width() {
    return this._width;
  }

  set height(h:number) {
    this._height = h;
    this.apply();
  }

  get height() {
    return this._height;
  }

  set scale(s:number) {
    this._scale = s;
    this.apply();
  }

  get scale() {
    return this._scale;
  }

  // set angleX(a: number) {
  //   if(!isNaN(a)) {
  //     this._angleX = a;
  //     this.apply();
  //   }
  // }

  // get angleX() {
  //   return this._angleX;
  // }

  // set angleY(a: number) {
  //   if(!isNaN(a)) {
  //     this._angleY = a;
  //     this.apply();
  //   }
  // }

  // get angleY() {
  //   return this._angleY;
  // }

  set angleZ(a: number) {
    if(!isNaN(a)) {
      this._angleZ = a;
      this.apply();
    }
  }

  get angleZ() {
    return this._angleZ;
  }

  set angle(a: number) {
    if(!isNaN(a)) {
      this._angle = a;
      this.apply();
    }
  }

  get angle() {
    return this._angle;
  }


}