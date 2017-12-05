
import { Queue } from './ChunkedQueue.ts';
import { Array1D } from 'deeplearn';

export class Cache {

  private thisArg: object;
  private fn: (args: Array<{}>) => void;
  private queue = new Queue();

  constructor(thisArg: object, fn: (args: Array<{}>) => void) {
    this.thisArg = thisArg;
    this.fn = fn;

    this.queue.interval = 20;
    this.queue.elementsPerChunk = 26;
  }

  get(id: number, argsArray: Array<{}>) {
    // console.log((argsArray[0] as Array1D).dataSync())
    return new Promise((resolve, reject) => {
      //TODO actually cache/retrieve the values.
      // resolve(value) if id is in the cache
      // console.log(id);

      this.queue.add(() => {
        const value = this.fn.call(this.thisArg, argsArray);
        this.fn.call(this.thisArg, argsArray);
        resolve(value);
      }, id, 0);
    });
  }

  set paused(p: boolean) {
    this.queue.paused = p;
  }

  get paused() {
    return this.queue.paused;
  }

}