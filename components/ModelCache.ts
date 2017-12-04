
import { Queue } from './ChunkedQueue.ts';

export class Cache {

  private thisArg: object;
  private fn: (args: Array<{}>) => void;
  private queue = new Queue();
  private _paused = false;

  constructor(thisArg: object, fn: (args: Array<{}>) => void) {
    this.thisArg = thisArg;
    this.fn = fn;

    this.queue.interval = 100;
    this.queue.elementsPerChunk = 26;
  }

  get(id: number, argsArray: Array<{}>) {
    //TODO actually cache/retrieve the values.

    return new Promise((resolve, reject) => {
      const value = this.fn.call(this.thisArg, argsArray);
      this.queue.add(() => {
        this.fn.call(this.thisArg, argsArray);
        resolve(value);
      }, id, 0);
    });
  }

  set paused(p: boolean) {
    this._paused = p;
  }

  get paused() {
    return this._paused;
  }

}