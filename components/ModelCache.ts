
import { Queue } from './ChunkedQueue.ts';
import { Array1D } from 'deeplearn';
import savedCache from 'SavedCache.ts';

export class Cache {

  private thisArg: object;
  private fn: (args: Array<{}>) => void;
  private cache = savedCache;
  private queue = new Queue();
  private useCache = true;
  private storeValues = false;

  constructor(thisArg: object, fn: (args: Array<{}>) => void) {
    this.thisArg = thisArg;
    this.fn = fn;
    this.queue.interval = 20;
    this.queue.elementsPerChunk = 26;
    console.log(this);
  }

  get(id: number, argsArray: Array<{}>) {
    return new Promise((resolve, reject) => {
      //TODO actually cache/retrieve the values.
      // resolve(value) if id is in the cache
      // console.log(id);
      const key = argsArray[2] + Array.prototype.slice.call((argsArray[0] as Array1D).dataSync()).join(",");
      if (this.cache.has(key) && this.useCache) {
        const IMAGE_SIZE = 64;
        const values = this.cache.get(key);
        let array = Array1D.new(values);
        const d = array.as3D(IMAGE_SIZE, IMAGE_SIZE, 1)
        const ctx = argsArray[1] as CanvasRenderingContext2D;
        const imageData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);
        let pixelOffset = 0;
        for (let i = 0; i < d.shape[0]; i++) {
          for (let j = 0; j < d.shape[1]; j++) {
            const value = d.get(i, j, 0);
            imageData.data[pixelOffset++] = value;
            imageData.data[pixelOffset++] = value;
            imageData.data[pixelOffset++] = value;
            imageData.data[pixelOffset++] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);

      } else {
        this.queue.add(() => {
          const output = this.fn.call(this.thisArg, argsArray);
          const value = Array.prototype.slice.call(output.dataSync()).map(d => Math.round(d));
          if (this.storeValues){
            this.cache.set(key, value);
          }
          resolve(output);
          output.dispose();
        }, id, 0);
      }


    });
  }



  serialize() {
    let output = "export default new Map([\n";
    this.cache.forEach((value, key, map) => {
      output += `['${key}',[${value.join(",")}]],\n`;
    });
    output += "]);";
    return output;
  }

  set paused(p: boolean) {
    this.queue.paused = p;
  }

  get paused() {
    return this.queue.paused;
  }

}