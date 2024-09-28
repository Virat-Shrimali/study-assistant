import * as tf from '@tensorflow/tfjs';

export const loadModel = async () => {
  try {
    const model = await tf.loadLayersModel('/model.json');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
  }
};
