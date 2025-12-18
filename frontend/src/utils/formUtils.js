// constants/windowTypes.js (or inside formUtils)
export const WINDOW_TYPES = [
    { value: 'PARE_BRISE', label: 'Pare-brise' },
    { value: 'COTE_AVANT', label: 'Côté avant' },
    { value: 'COTE_ARRIERE', label: 'Côté arrière' },
    { value: 'LUNETTE_ARRIERE', label: 'Lunette arrière' }
];

// Helper to format data for backend
export const formatOrderPayload = (data) => {
    return {
        carModelId: data.carModelId ? parseInt(data.carModelId, 10) : null,
        orderItem: {
            companyName: data.companyName,
            registrationNumber: data.registrationNumber,
            year: data.year ? parseInt(data.year, 10) : undefined,
            destination: data.destination,
            comment: data.comment || '',
            image: data.image || 'placeholder.jpg',
            windowType: data.windowType || 'PARE_BRISE'
        }
    };
};