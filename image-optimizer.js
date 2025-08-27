/**
 * Image Optimizer for Portfolio
 * 
 * This script optimizes all images in the project for web use.
 * It requires the 'sharp' library to be installed:
 * npm install sharp
 * 
 * Usage: node image-optimizer.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories to scan for images
const imageDirs = [
    './images',
    './images/projects',
    './images/certifications',
    './images/blog',
    './images/testimonials',
    './images/flags'
];

// Output directory for optimized images
const outputDir = './images/optimized';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Image optimization settings
const settings = {
    jpeg: { quality: 80, progressive: true },
    png: { compressionLevel: 9, progressive: true },
    webp: { quality: 80 }
};

// Max image dimensions
const maxWidth = 1200;
const maxHeight = 1200;

// Process images
const processImages = async () => {
    try {
        // Create a list of all image files
        let imageFiles = [];
        
        // Scan all directories for images
        for (const dir of imageDirs) {
            if (!fs.existsSync(dir)) continue;
            
            const files = fs.readdirSync(dir);
            const images = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
            }).map(file => path.join(dir, file));
            
            imageFiles = [...imageFiles, ...images];
        }
        
        console.log(`Found ${imageFiles.length} images to optimize.`);
        
        // Process each image
        for (const inputPath of imageFiles) {
            const fileName = path.basename(inputPath);
            const outputPath = path.join(outputDir, fileName);
            
            // Skip directories
            if (fs.statSync(inputPath).isDirectory()) continue;
            
            // Get file extension
            const ext = path.extname(inputPath).toLowerCase();
            
            console.log(`Optimizing: ${inputPath}`);
            
            try {
                // Process based on file type
                if (['.jpg', '.jpeg'].includes(ext)) {
                    await sharp(inputPath)
                        .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
                        .jpeg(settings.jpeg)
                        .toFile(outputPath);
                } else if (ext === '.png') {
                    await sharp(inputPath)
                        .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
                        .png(settings.png)
                        .toFile(outputPath);
                } else if (ext === '.webp') {
                    await sharp(inputPath)
                        .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
                        .webp(settings.webp)
                        .toFile(outputPath);
                }
                
                console.log(`Optimized: ${outputPath}`);
            } catch (error) {
                console.error(`Error processing ${inputPath}:`, error);
            }
        }
        
        console.log('Image optimization complete!');
        console.log(`Optimized images are in: ${outputDir}`);
        console.log('Review the optimized images and replace originals if satisfied.');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
};

// Run the process
processImages();
