# Shelf-Life Prediction Model

This directory contains the computer vision model for predicting the shelf-life of produce.

## Model Description
We plan to use a convolutional neural network (CNN) trained on images of produce (tomatoes, avocados, mangoes, etc.) labeled with their remaining shelf-life (in days or hours).

### Architecture (Planned)
- Input: RGB image of produce (224x224 pixels)
- Base model: MobileNetV2 or EfficientNet-Lite (for on-device inference)
- Head: Global average pooling + Dense layer (regression output for shelf-life)
- Output: Single float value representing estimated shelf-life in days

## Training Data
We need a dataset of produce images with corresponding shelf-life labels.
Sources:
- Open-source datasets (e.g., PlantVillage, though it's for disease, we can adapt)
- Custom data collection: Vendors take daily photos of produce and log spoilage time
- Data augmentation: Rotations, flips, brightness adjustments to simulate market conditions

## Model Conversion
After training in TensorFlow/Keras, we convert to TensorFlow Lite for on-device inference:
```python
import tensorflow as tf

# Assuming `model` is the trained Keras model
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open('shelf_life_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Current Status
This is a placeholder. The actual model file (`shelf_life_model.tflite`) will be generated after training.

## Next Steps for Model Development
1. Collect and label a dataset of produce images with shelf-life measurements
2. Train a regression model using transfer learning (MobileNetV2/EfficientNet)
3. Validate accuracy against real-world spoilage rates
4. Convert to TensorFlow Lite and test on-device performance
5. Integrate with the mobile app (Flutter/React Native) using TensorFlow Lite plugin

## Files in this Directory
- `README.md`: This file
- `shelf_life_model.tflite`: Placeholder (to be replaced with actual model)
- `train_model.py`: Training script (to be developed)
- `convert_to_tflite.py`: Conversion script (to be developed)

## Notes for Production
- Model should be updated quarterly with new data
- Consider using transfer learning with domain adaptation for different produce types
- Implement confidence estimation to flag low-prediction-reliability cases
- Monitor for concept drift (changes in produce quality, lighting conditions, etc.)