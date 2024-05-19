const tf = require("@tensorflow/tfjs");
// const tfn = require("@tensorflow/tfjs-node");
const converter = require("@tensorflow/tfjs-converter");
const fs = require("fs");
const path = require("path");

// let model = undefined;
// const path = "https://modeltest1.netlify.app/model.json";

// async function loadModel() {
//   model = await tf.loadLayersModel(path);
// }

// loadModel();

// const modelPath = path.join("backend", "models", "models", "model.json"); // Adjust path based on model location
// const buffer = fs.readFileSync(modelPath);
// console.log(modelPath);

// async function loadModel() {
//   try {
//     const modelPath =
//       "D:/My Projects/Face-Emotion-Detection/backend/models/models/model.json";
//     const modelData = JSON.parse(fs.readFileSync(modelPath, "utf8"));
//     const model = await tf.loadLayersModel(tf.io.fromMemory(modelData));
//     model.summary();
//     console.log(model.summary());
//   } catch (error) {
//     console.log(error);
//   }
// }

// loadModel();

// const model = tf.loadLayersModel(buffer);

// converter.save_keras_model(model, "models"); // Adjust output directory

// const MODEL_PATH = "../backend/models/models/model.json";
// const modelUrl = `file://${MODEL_PATH}`;

// async function loadModel() {
//   const handler = tfn.io.fileSystem("../backend/model.json");
//   const model = await tf.loadLayersModel(handler);
//   console.log("hi");
//   const response = await fetch("./backend/PrivateTest_10131363.jpg");
//   const imageData = await response.arrayBuffer();

//   // 2. Decode the image using tf.browser.decodeImage
//   const tensor = tf.browser.decodeImage(imageData);

//   // 3. Preprocess the image
//   const image = tf.expandDims(tensor, 0); // Add batch dimension
//   const normalizedImage = image.div(tf.scalar(255.0)); // Normalize pixel values

//   // 4. Load the model (assuming you already have a loaded model variable)
//   const prediction = model.predict(normalizedImage);

//   // 5. Get the most likely class index
//   const classIndex = prediction.argMax(1).dataSync()[0];

//   console.log("Predicted class index:", classIndex);

//   // return model;
// }

// async function main() {
//   const model = await loadModel();

//   // Manually set the input shape of the model
//   model.inputs[0].shape = [null, 48, 48, 3];

//   // Now you can use the model for predictions or further processing
//   console.log(model.summary());
// }

// main().catch((error) => {
//   console.error("Error:", error);
// });

// const model = loadModel()
//   .then((model) => {
//     // Model loaded, you can use it for predictions or further processing
//     console.log(model.summary());
//   })
//   .catch((error) => {
//     console.error("Error loading the model:", error);
//   });
// console.log("hello");
// In your Node.js script

// const { execSync } = require("child_process");
const { execSync } = require("child_process");

function callPythonFunction(arg1, arg2) {
  try {
    // Execute the Python script synchronously
    const output = execSync(`python app.py ${arg1} ${arg2}`).toString().trim();
    // Assuming the Python function returns a single value
    return output;
  } catch (error) {
    // Handle errors if any
    console.error("Error executing Python script:", error);
    return null;
  }
}

// Example usage
const result = callPythonFunction(2, 2);
console.log("Result from Python:", result);
