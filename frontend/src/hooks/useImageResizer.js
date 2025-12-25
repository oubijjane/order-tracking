import imageCompression from 'browser-image-compression';
import { useState } from 'react';

export const useImageResizer = () => {
    const [resizedFile, setResizedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const resizeImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/jpeg' // Optional: force JPEG for smaller size
        };

        try {
            setIsProcessing(true);
            const compressedBlob = await imageCompression(file, options);
            
            // Create a File object from the Blob to keep the original name
            const compressedFile = new File([compressedBlob], file.name, {
                type: 'image/jpeg',
            });

            setResizedFile(compressedFile);
            setPreviewUrl(URL.createObjectURL(compressedFile)); // For the UI preview
            setIsProcessing(false);
            
            return compressedFile; 
        } catch (error) {
            console.error("Compression failed:", error);
            setIsProcessing(false);
            throw error;
        }
    };

    const reset = () => {
        setResizedFile(null);
        setPreviewUrl(null);
    };

    return { resizedFile, previewUrl, isProcessing, resizeImage, reset };
};
