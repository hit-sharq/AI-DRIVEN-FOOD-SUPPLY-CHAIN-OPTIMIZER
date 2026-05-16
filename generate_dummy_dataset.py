import numpy as np
from PIL import Image
import os

def create_dummy_image(color, size=(224, 224)):
    """Create a dummy image with a specific color"""
    # Create an array filled with the specified color
    image_array = np.zeros((size[0], size[1], 3), dtype=np.uint8)
    
    # Define colors for different produce types (RGB values)
    colors = {
        'tomatoes': [255, 99, 71],      # Tomato red
        'avocados': [34, 139, 34],      # Avocado green
        'mangoes': [255, 165, 0],       # Mango orange
        'bananas': [255, 255, 0],       # Banana yellow
        'onions': [169, 169, 169],      # Onion gray
        'potatoes': [139, 69, 19],      # Potato brown
        'carrots': [255, 140, 0],       # Carrot orange
        'peppers': [255, 69, 0],        # Pepper red-orange
        'leafy_greens': [0, 128, 0],    # Leafy green
        'citrus': [255, 140, 0]         # Citrus orange
    }
    
    color_rgb = colors.get(color, [128, 128, 128])  # Default to gray
    
    # Fill the image with the color
    image_array[:, :] = color_rgb
    
    # Add some noise to make it look more like an image
    noise = np.random.randint(-30, 30, (size[0], size[1], 3), dtype=np.int16)
    image_array = np.clip(image_array.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    return Image.fromarray(image_array)

def generate_dataset():
    """Generate dummy dataset for each produce category"""
    dataset_path = './dataset'
    
    # Create dataset directory if it doesn't exist
    if not os.path.exists(dataset_path):
        os.makedirs(dataset_path)
    
    # Produce categories
    categories = ['tomatoes', 'avocados', 'mangoes', 'bananas', 'onions', 
                 'potatoes', 'carrots', 'peppers', 'leafy_greens', 'citrus']
    
    # Number of images per category
    images_per_category = 20
    
    for category in categories:
        category_path = os.path.join(dataset_path, category)
        if not os.path.exists(category_path):
            os.makedirs(category_path)
        
        print(f"Generating {images_per_category} images for {category}...")
        
        for i in range(images_per_category):
            # Create dummy image
            img = create_dummy_image(category)
            
            # Save image
            img_path = os.path.join(category_path, f"{category}_{i:03d}.jpg")
            img.save(img_path, "JPEG")
    
    print("Dataset generation complete!")

if __name__ == "__main__":
    generate_dataset()