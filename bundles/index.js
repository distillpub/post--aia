import {Array1D, NDArray, NDArrayMathCPU} from 'deeplearn';
import {randomUniform} from 'd3-random';
import {range} from 'd3-array';
import FontModel from 'FontModel.js';
import {average, norm, unit} from "Utils.ts";
import {IsometricProjector as Projector} from 'IsometricProjector.ts';
import {font as fontFunction} from 'ManifoldFunctions.ts';

import {
  f31207, f47540, f1521, f26989, f29116, f28805, f23816,
  f1283,f1257,f1332,f1497,f1509,f1590,f1580,f1649,f1971,f1992,f2003,f2127,f2266,f2592,f2561,f4465,
  f7238,f1557,f24314,f46774,f19558,f38134,f20907,f11500,f35559,f18778,f34845,f39762,f13192,f2490,f2528,f2558,
  f2369,f2557,f2646,f2654,f2722,f2766,f2807,f2856,f2907,f2980,f3071,f3117,f3558,f3801,f3957,f4086,
  f2372,f2558,f2647,f2655,f2721,f2767,f2806,f2857,f2908,f2981,f3072,f3118,f3559,f3804,f3956,f4085,
  f1462,f1658,f1990,f2001,f2062,f2719,f2707,f5487,f7589,f6773,f7011,f8230,f8321,f13394,f14343,f14444,
  f1435,f1481,f1995,f2009,f2081,f2229,f2738,f2908,f5436,f5481,f5525,f5540,f5986,f6439,f6464,f6501
} from 'FontExamples.ts';

const math = new NDArrayMathCPU(false);
const fonts = new FontModel();

const baseFonts = [
  f29116, f31207, f47540, f1521, f26989, f28805, f23816
];

const analogies = [
  {
    label: 'Bold',
    magnitude: 0,
    left: [f1283,f1257,f1332,f1497,f1509,f1590,f1580,f1649,f1971,f1992,f2003,f2127,f2266,f2592,f2561,f4465],
    right: [f7238,f1557,f24314,f46774,f19558,f38134,f20907,f11500,f35559,f18778,f34845,f39762,f13192,f2490,f2528,f2558]
  },
  {
    label: 'Italic',
    magnitude: 0,
    left: [f2369,f2557,f2646,f2654,f2722,f2766,f2807,f2856,f2907,f2980,f3071,f3117,f3558,f3801,f3957,f4086],
    right: [f2372,f2558,f2647,f2655,f2721,f2767,f2806,f2857,f2908,f2981,f3072,f3118,f3559,f3804,f3956,f4085]
  },
  {
    label: 'Condensed',
    magnitude: 0,
    left: [f1462,f1658,f1990,f2001,f2062,f2719,f2707,f5487,f7589,f6773,f7011,f8230,f8321,f13394,f14343,f14444],
    right: [f1435,f1481,f1995,f2009,f2081,f2229,f2738,f2908,f5436,f5481,f5525,f5540,f5986,f6439,f6464,f6501]
  }
];

const userTool = {
  magnitude: 0.25,
  left: [],
  right: []
};

const isometricProjector = new Projector();

//
// Import and initialize all the diagrams.
//

import Boldify from '../figures/Boldify.html';
const boldify = new Boldify({target: document.querySelector('#boldify')});

import Serifify from '../figures/Serifify.html';
const serifify = new Serifify({target: document.querySelector('#serifify')});

import BoldifyWithExamples from '../figures/BoldifyWithExamplesStatic.html';
const boldifyWithExamples = new BoldifyWithExamples({target: document.querySelector('#boldify-with-examples')});

import Descartes from '../figures/Descartes.html';
new Descartes({target: document.querySelector('#descartes')});

import BoldNaive from '../figures/BoldNaive.html';
new BoldNaive({target: document.querySelector('#bold-naive')});

import AlternateUses from '../figures/AlternateUses.html';
new AlternateUses({target: document.querySelector('#alternate-uses')});

import LatentSpaceTypeface from '../figures/LatentSpaceTypeface.html';
new LatentSpaceTypeface({
  target: document.querySelector('#latent-space-typeface'),
  data: {
    fn: fontFunction
  }
});

import LatentSpaceTypefaceSample from '../figures/LatentSpaceTypefaceSample.html';
const latentSpaceTypefaceSample = new LatentSpaceTypefaceSample({
  target: document.querySelector('#latent-space-typeface-sample'),
  data: {
    fn: fontFunction
  }
});

const lightPoints = range(15).map(i => [randomUniform(-0.35, -0.15)(), randomUniform(0.05, 0.35)()]);
const boldPoints = range(15).map(i => [randomUniform(0.15, 0.35)(), randomUniform(-0.15, 0.15)()]);

import BoldifyVectorDefined from '../figures/BoldifyVectorDefined.html';
const boldifyVectorDefined = new BoldifyVectorDefined({
  target: document.querySelector('#boldify-vector-defined'),
  data: {
    projector: isometricProjector,
    lightPoints: lightPoints,
    boldPoints: boldPoints
  }
});

import BoldifyVectorSampled from '../figures/BoldifyVectorSampled.html';
const boldifyVectorSampled = new BoldifyVectorSampled({
  target: document.querySelector('#boldify-vector-sampled'),
  data: {
    projector: isometricProjector,
    lightPoints: lightPoints,
    boldPoints: boldPoints
  }
});

import BoldifyToolExamples from '../figures/BoldifyToolExamples.html';
const boldifyToolExamples = new BoldifyToolExamples({
  target: document.querySelector('#boldify-tool-examples')
});

import BoldifyToolExamplesPositive from '../figures/BoldifyToolExamplesPositive.html';
const boldifyToolExamplesPositive = new BoldifyToolExamplesPositive({
  target: document.querySelector('#boldify-tool-examples-positive')
});

import BoldifyParallel from '../figures/BoldifyParallel.html';
const boldifyParallel = new BoldifyParallel({
  target: document.querySelector('#boldify-parallel'),
  data: {
    projector: isometricProjector,
    lightPoints: lightPoints,
    boldPoints: boldPoints
  }
});

import IgansBasic from '../figures/IgansBasic.html';
const igansBasic = new IgansBasic({
  target: document.querySelector('#igans-basic'),
  data: {
    projector: isometricProjector,
  }
});

import IgansConstraint from '../figures/IgansConstraint.html';
const igansConstraint = new IgansConstraint({
  target: document.querySelector('#igans-constraint'),
  data: {
    projector: isometricProjector,
  }
});

import IgansMinimization from '../figures/IgansMinimization.html';
const igansMinimization = new IgansMinimization({
  target: document.querySelector('#igans-minimization'),
  data: {
    projector: isometricProjector,
  }
});


function centroid(model, samples) {
  if (samples.length) {
    return average(samples);
  } else {
    return Array1D.zeros([model.dimensions]);
  }
}

function averageMagnitude(samples) {
  if (samples.length) {
    const avg = average(samples.map(s => norm(s)))
    return avg;
  } else {
    return Scalar.new(0);
  }
}


//
// Initialize and load the font weights. Can be quite large
//

document.querySelector("#boldify").addEventListener("ready", () => {
  console.log("ready");
});

analogies.forEach(a => {
  a.leftSamples = a.left.map(d => d);
  a.rightSamples = a.right.map(d => d);
  a.leftAverageMagnitude = averageMagnitude(a.leftSamples).get();
  a.rightAverageMagnitude = averageMagnitude(a.rightSamples).get();
  a.leftCentroid = centroid(fonts, a.leftSamples);
  a.rightCentroid = centroid(fonts, a.rightSamples);
  a.direction = unit(math.sub(a.rightCentroid, a.leftCentroid));
});


fonts.load(() => {
  fonts.init();
  boldify.set({loading: false});
  serifify.set({loading: false});
});

  boldify.set({
    model: fonts,
    analogies: analogies,
    baseFonts: baseFonts
  });

  serifify.set({
    model: fonts,
    baseFonts: baseFonts,
    userTool: userTool
  });

  boldifyWithExamples.set({
    model: fonts,
    analogies: analogies,
    userTool: userTool
  });

  latentSpaceTypefaceSample.set({
    model: fonts
  });

  boldifyVectorDefined.set({
    model: fonts,
    analogy: analogies[0]
  });

  boldifyVectorSampled.set({
    model: fonts,
    analogy: analogies[0]
  });

  boldifyToolExamples.set({
    model: fonts,
    analogy: analogies[0]
  });

  boldifyToolExamplesPositive.set({
    model: fonts,
    analogy: analogies[0]
  });

  boldifyParallel.set({
    model: fonts,
    analogy: analogies[0]
  });
// });


