import { useState, useEffect } from 'react';
import rolesService from '../services/rolesService';


export const useRoleSelection = () => {
    const [roles, setRoles] = useState([]);
    // 1. Fetch Companies on Mount
    useEffect(() => {
        rolesService.getAllRoles()
            .then(data => setRoles(data))
            .catch(err => console.error("Failed to load roles:", err));
    }, []); 
    // 2. Format options for the Dropdown component
    const roleOptions = roles.map(r => ({ value: r.id, label: r.name.replace("ROLE_", "")}));
    return roleOptions;
}