
interface QueueItem {
  cb: () => void;
  id: number;
  priority: number;
}

export class Queue {
  public interval: number;
  public elementsPerChunk: number;
  private _timeoutID: number;
  private _running: boolean;
  private _queue: QueueItem[];
  private _paused = true;

  constructor() {
    this.interval = 1000;
    this.elementsPerChunk = 1;
    this._timeoutID = -1;
    this.clear();
  }

  add(cb: () => void, id: number, priority: number) {
    this.remove(id);
    if (id === undefined) id = -1;
    if (priority === undefined) priority = -1;
    this._queue.push({ cb, id, priority });
    this._queue.sort((a, b) => a.priority - b.priority);
    this._kick();
  }

  clear() {
    clearTimeout(this._timeoutID);
    this._queue = [];
    this._running = false;
  }

  get length() {
    return this._queue.length;
  }

  set paused(p: boolean) {
    this._paused = p;
    if(p === false){
      this._kick();
    }
    console.log("paused", p);
  }

  get paused() {
    return this._paused;
  }

  remove(id: number) {
    this._queue = this._queue.filter(item => id !== item.id);
  }

  _nextChunk() {
    return this._queue.splice(-this.elementsPerChunk);
  }

  _kick() {
    if (!this._running && !this._paused) {
      this._running = true;
      this._timeoutID = setTimeout(this._run.bind(this), this.interval);
    }
  }

  _run() {
    const chunk = this._nextChunk();
    chunk.forEach((item) => {
      item.cb();
    });
    this._running = false;
    if (this._queue.length) this._kick();
  }

}