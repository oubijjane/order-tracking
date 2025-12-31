import imageCompression from 'browser-image-compression';
import { useState } from 'react';

export const useImageResizer = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const resizeImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/jpeg'
        };

        try {
            setIsProcessing(true);
            const compressedBlob = await imageCompression(file, options);
            
            const compressedFile = new File([compressedBlob], file.name, {
                type: 'image/jpeg',
            });

            setIsProcessing(false);
            return compressedFile; 
        } catch (error) {
            console.error("Compression failed:", error);
            setIsProcessing(false);
            throw error;
        }
    };

    // Helper to process many images at once
    const resizeMultipleImages = async (files) => {
        // Promise.all runs the compression in parallel
        return await Promise.all(files.map(file => resizeImage(file)));
    };

    return { isProcessing, resizeImage, resizeMultipleImages };
};