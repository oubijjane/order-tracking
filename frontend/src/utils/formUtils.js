
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
    { value: 'CANCELLED', label: 'Annulé' }, 
    { value: 'REPAIRED', label: 'Réparé' },
    { value: 'IN_TRANSIT', label: 'En transite' },
    { value: 'RECEIVED', label: 'Reçu' },
    { value: 'RETURN', label: 'Retour' }
  ];

  export const ORDER_STATUS_MAP = Object.fromEntries(
  ORDER_STATUS.map(s => [s.value, s.label])
);

export const handleDecision = async (id, decision, action) => {
        try {
            await action.patch(`/orders/${id}/status?status=${decision}`);
            // Refresh the list from the server to see the update
        } catch (err) {
            alert("Error updating status: " + err.message);
        }
};

export const statusLabel = (statusValue, userRoles = []) => {
    let possibleTransitions = [];

    // 1. Define logical flow
    switch(statusValue) {
        case 'PENDING':      possibleTransitions = ['IN_PROGRESS']; break;
        case 'IN_PROGRESS':  possibleTransitions = ['AVAILABLE', 'NOT_AVAILABLE']; break;
        case 'AVAILABLE':    possibleTransitions = ['SENT', 'CANCELLED']; break;
        case 'NOT_AVAILABLE':possibleTransitions = ['AVAILABLE', 'CANCELLED']; break;
        case 'SENT':         possibleTransitions = ['IN_TRANSIT']; break;
        case 'IN_TRANSIT':   possibleTransitions = ['RECEIVED']; break;
        case 'RECEIVED':     possibleTransitions = ['REPAIRED', 'RETURN']; break;
        default:             possibleTransitions = [];
    }

    // 2. Role validation helpers
    const isAdmin = userRoles.includes('ROLE_ADMIN');
    const isGestionnaire = userRoles.includes('ROLE_GESTIONNAIRE');
    const isGaragiste = userRoles.includes('ROLE_GARAGISTE');
    const isLogisticien = userRoles.includes('ROLE_LOGISTICIEN');

    return possibleTransitions.filter(nextStatus => {
        if (isAdmin) return true; // Admin can do everything

        switch(nextStatus) {
            case 'IN_PROGRESS':
            case 'AVAILABLE':
            case 'NOT_AVAILABLE':
                return isLogisticien; // Logisticiens start the process
            
            case 'SENT':
            case 'CANCELLED':
                return isGestionnaire || isGaragiste;

            case 'IN_TRANSIT':
                return isLogisticien;

            case 'RECEIVED':
                return isLogisticien || isGaragiste;

            case 'REPAIRED':
                return isGaragiste;

            case 'RETURN':
                return isLogisticien || isGaragiste;

            default:
                return false;
        }
    });
};
// Helper to format data for backend
export const formatOrderPayload = (data) => {
    return {
        carModelId: data.carModelId ? parseInt(data.carModelId, 10) : null,
        companyId: data.companyId ? parseInt(data.companyId, 10) : null,
        cityId: data.cityId ? parseInt(data.cityId, 10) : null,
        orderItem: {
            registrationNumber: data.registrationNumber,
            comment: data.comment || '',
            windowType: data.windowType || null
        }
    };
};

export const formatNewUserPayload = (data) => {
    return {
        username: data.username || '',
        email: data.email || '',
        password: data.password || '',
        cityId: data.cityId ? parseInt(data.cityId, 10) : null,
        
    };
};
export const formatEditUserPayload = (data) => {
    // 1. Ensure roles is always an array of numbers
    let rolesArray = [];
    if (Array.isArray(data.roles)) {
        rolesArray = data.roles.map(id => parseInt(id, 10));
    } else if (data.roles) {
        rolesArray = [parseInt(data.roles, 10)]; // If it's a single string, make it an array
    }

    // 2. Ensure companies is always an array of numbers
    const companiesArray = Array.isArray(data.companies) 
        ? data.companies.map(id => parseInt(id, 10)) 
        : [];

    return {
        username: data.username,
        email: data.email,
        // Only send password if it has been changed/typed
        password: data.password || '', 
        cityId: data.cityId ? parseInt(data.cityId, 10) : null,
        status: data.status === true || data.status === 'true',
        roles: rolesArray,
        companies: companiesArray
    };
};  
export const formatDate = (dateString) => {
    if (!dateString) return "Jamais";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};