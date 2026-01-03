import { useState } from 'react';
export function ImageGallery({ images, selectedImgIndex, setSelectedImgIndex, IMAGE_BASE_URL }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!images || images.length === 0) {
        return <div className="no-image-placeholder"><p>Aucune image</p></div>;
    }

    const currentImg = `${IMAGE_BASE_URL}${images[selectedImgIndex].url}`;

    return (
        <div className="image-card">
            <div className="image-gallery">
                <div className="main-image-container" onClick={() => setIsModalOpen(true)}>
                    <img src={currentImg} alt="Car Damage" onError={(e) => { e.target.src = '/placeholder.png'; }} />
                </div>
                {images.length > 1 && (
                    <div className="thumbnail-grid">
                        {images.map((img, idx) => (
                            <img 
                                key={img.id || idx}
                                src={`${IMAGE_BASE_URL}${img.url}`} 
                                className={`thumbnail-item ${idx === selectedImgIndex ? 'active' : ''}`}
                                onClick={() => setSelectedImgIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <button className="modal-nav-btn prev" onClick={(e) => { e.stopPropagation(); setSelectedImgIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}>&#10094;</button>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
                        <img src={currentImg} alt="Full Size" />
                        <div className="modal-counter">{selectedImgIndex + 1} / {images.length}</div>
                    </div>
                    <button className="modal-nav-btn next" onClick={(e) => { e.stopPropagation(); setSelectedImgIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}>&#10095;</button>
                </div>
            )}
        </div>
    );
}