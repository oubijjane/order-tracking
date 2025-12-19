// constants/windowTypes.js (or inside formUtils)
export const WINDOW_TYPES = [
    { value: 'PARE_BRISE', label: 'Pare-brise' },
    { value: 'VITRE_AVANT_GAUCHE', label: 'Vitre avant gauche' },
    { value: 'VITRE_AVANT_DROITE', label: 'Vitre avant droite' },
    { value: 'VITRE_ARRIERE_GAUCHE', label: 'Vitre arrière gauche' },
    { value: 'VITRE_ARRIERE_DROITE', label: 'Vitre arrière droite' },
    { value: 'VITRE_LATERALE_GAUCHE', label: 'Vitre latérale gauche' },
    { value: 'VITRE_LATERALE_DROITE', label: 'Vitre latérale droite' },
    { value: 'DEFLECTEUR_AVANT_GAUCHE', label: 'Déflecteur avant gauche' },
    { value: 'DEFLECTEUR_AVANT_DROITE', label: 'Déflecteur avant droite' },
    { value: 'CUSTAUDE_ARRIERE_GAUCHE', label: 'Custaude arrière gauche' },
    { value: 'CUSTAUDE_ARRIERE_DROITE', label: 'Custaude arrière droite' },
    { value: 'LUNETTE_ARRIERE', label: 'Lunette arrière' }
];
export const ORDER_STATUS = [
    { value: 'PENDING', label: 'En attente' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'AVAILABLE', label: 'Disponible' },
    { value: 'NOT_AVAILABLE', label: 'Non Disponible' },
    { value: 'SENT', label: 'Envoyer' },
    { value: 'CANCELLED', label: 'Annulé' }
  ];
  
// Helper to format data for backend
export const formatOrderPayload = (data) => {
    return {
        carModelId: data.carModelId ? parseInt(data.carModelId, 10) : null,
        companyId: data.companyId ? parseInt(data.companyId, 10) : null,
        cityId: data.cityId ? parseInt(data.cityId, 10) : null,
        orderItem: {
            registrationNumber: data.registrationNumber,
            year: data.year ? parseInt(data.year, 10) : undefined,
            comment: data.comment || '',
            windowType: data.windowType || null
        }
    };
};