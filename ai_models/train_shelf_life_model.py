import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os
import json

# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_PATH = './dataset'  # Path to dataset folder with subfolders for each produce type

# Define produce categories and their typical shelf life ranges (in days)
# This is used for creating regression labels
SHELF_LIFE_RANGES = {
    'tomatoes': (3, 10),
    'avocados': (2, 7),
    'mangoes': (5, 14),
    'bananas': (3, 8),
    'onions': (14, 30),
    'potatoes': (21, 60),
    'carrots': (14, 30),
    'peppers': (5, 14),
    'leafy_greens': (3, 7),
    'citrus': (14, 30)
}

def create_data_generators():
    """Create data generators for training and validation"""
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
        validation_split=0.2
    )
    
    train_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    validation_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    return train_generator, validation_generator

def create_model(num_classes):
    """Create the model using transfer learning with MobileNetV2"""
    base_model = MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    base_model.trainable = False
    
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def create_regression_model():
    """Create a regression model for shelf-life prediction"""
    base_model = MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    base_model.trainable = False
    
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='linear')  # Output shelf life in days
    ])
    
    model.compile(
        optimizer='adam',
        loss='mean_squared_error',
        metrics=['mae']
    )
    
    return model

def prepare_regression_data(generator):
    """Convert classification generator to regression data"""
    images = []
    labels = []
    
    # Get class indices
    class_indices = generator.class_indices
    classes = list(class_indices.keys())
    
    # Reset generator
    generator.reset()
    
    for i in range(len(generator)):
        batch_images, batch_labels = generator[i]
        images.append(batch_images)
        
        # Convert categorical labels to shelf life values
        batch_shelf_life = []
        for label in batch_labels:
            class_idx = np.argmax(label)
            class_name = classes[class_idx]
            min_life, max_life = SHELF_LIFE_RANGES.get(class_name, (3, 10))
            # Random shelf life within the range for this class
            shelf_life = np.random.uniform(min_life, max_life)
            batch_shelf_life.append(shelf_life)
        
        labels.append(np.array(batch_shelf_life))
    
    return np.vstack(images), np.hstack(labels)

def main():
    print("Creating data generators...")
    train_gen, val_gen = create_data_generators()
    
    print(f"Found {train_gen.num_classes} classes: {list(train_gen.class_indices.keys())}")
    
    # For classification approach
    print("\n=== Training Classification Model ===")
    classification_model = create_model(train_gen.num_classes)
    classification_model.summary()
    
    print("\nTraining classification model...")
    classification_model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen
    )
    
    # Save classification model
    classification_model.save('ai_models/shelf_life_classification_model.h5')
    print("Classification model saved!")
    
    # For regression approach (more accurate for shelf life prediction)
    print("\n=== Training Regression Model ===")
    regression_model = create_regression_model()
    regression_model.summary()
    
    print("Preparing regression data...")
    train_images, train_labels = prepare_regression_data(train_gen)
    val_images, val_labels = prepare_regression_data(val_gen)
    
    print("\nTraining regression model...")
    regression_model.fit(
        train_images, train_labels,
        epochs=EPOCHS,
        validation_data=(val_images, val_labels)
    )
    
    # Save regression model
    regression_model.save('ai_models/shelf_life_regression_model.h5')
    print("Regression model saved!")
    
    # Convert to TensorFlow Lite
    print("\nConverting to TensorFlow Lite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(regression_model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()
    
    with open('ai_models/shelf_life_model.tflite', 'wb') as f:
        f.write(tflite_model)
    
    print("TensorFlow Lite model saved!")
    
    # Save class mapping for reference
    class_mapping = {v: k for k, v in train_gen.class_indices.items()}
    with open('ai_models/class_mapping.json', 'w') as f:
        json.dump(class_mapping, f)
    
    print("Training complete!")

if __name__ == "__main__":
    main()