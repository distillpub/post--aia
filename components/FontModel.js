import {Queue} from 'ChunkedQueue.ts';
import {Cache} from 'ModelCache.ts';
import {CheckpointLoader, NDArrayMathGPU, NDArrayMathCPU, Scalar, Array1D} from "deeplearn";
import {arrayToString} from 'Utils.ts';

let variables;
let graph;
let session;
let inputTensor;
let outputTensor;
let math;
let imageData;
let q;

const NUM_LAYERS = 4;
const IMAGE_SIZE = 64;

export default class Model {
  constructor() {
    this.metaData = "A";
    this.dimensions = 40;
    this.inferCache = new Cache(this, this.infer);
    this.inferCache.paused = true;
    this.numberOfValidChars = 62;
    this.range = 0.8;
    // Set up character ID mapping.
    this.charIdMap = {};
    for (let i = 65; i < 91; i++) {
      this.charIdMap[String.fromCharCode(i)] = i - 65;
    }
    for (let i = 97; i < 123; i++) {
      this.charIdMap[String.fromCharCode(i)] = i - 97 + 26;
    }
    for (let i = 48; i < 58; i++) {
      this.charIdMap[String.fromCharCode(i)] = i - 48 + 52;
    }
    math = new NDArrayMathGPU();
  }

  load(cb) {
    const checkpointLoader = new CheckpointLoader('https://storage.googleapis.com/learnjs-data/checkpoint_zoo/fonts/');
    checkpointLoader.getAllVariables().then(vars => {
      variables = vars;
      let mathCPU = new NDArrayMathCPU();
      // Pad the embeddings with zeros. This makes it not prime so we can upload it to the GPU.
      // This will be fixed in a later version of deeplearn.js, but this will do for now.
      const zeros = Array1D.zeros([1, 40]);
      const axis = 0;
      cb();
      this.inferCache.paused = false;
    });
  }

  get(id, args, priority) {
    args.push(this.metaData);

    return new Promise((resolve, reject) => {
      args.push((d) => resolve(d));
      this.inferCache.get(id, args);
    });
  }

  remove(id) {
    // TODO
    // this.queue.remove(id);
  }

  init() {
    this.multiplierScalar = Scalar.new(255);

  }

  infer(args) {
    const embedding = args[0];
    const ctx = args[1];
    const char = args[2];
    const cb = args[3];

    const charId = this.charIdMap[char.charAt(0)];
    if (charId == null) {
      throw(new Error("Invalid character id"))
    }

    const adjusted = math.scope((keep, track) => {
      const idx = track(Array1D.new([charId]));
      const onehotVector = math.oneHot(idx, this.numberOfValidChars).as1D();

      const inputData = math.concat1D(embedding.as1D(), onehotVector);

      let lastOutput = inputData;

      for (let i = 0; i < NUM_LAYERS; i++) {
        const weights = variables[`Stack/fully_connected_${i+1}/weights`];
        const biases = variables[`Stack/fully_connected_${i+1}/biases`];
        lastOutput = math.relu(
            math.add(math.vectorTimesMatrix(lastOutput, weights), biases));
      }

      const finalWeights = variables['fully_connected/weights'];
      const finalBiases = variables['fully_connected/biases'];
      const finalOutput = math.sigmoid(
          math.add(math.vectorTimesMatrix(lastOutput, finalWeights), finalBiases));

      // Convert the inferred tensor to the proper scaling for display then draw it.
      const scaled = math.scalarTimesArray(this.multiplierScalar, finalOutput);
      return math.scalarMinusArray(this.multiplierScalar, scaled);
    });

    const d = adjusted.as3D(IMAGE_SIZE, IMAGE_SIZE, 1);

    // d.data(() =
    d.dataSync();
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

      // d.dispose();

      cb();
      // });
    return d;
  }
}
