export const company_name_validation = {
  name: 'companyName',
  label: 'Assurance',
  type: 'text',
  id: 'companyName',
  placeholder: 'Assurance ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const company_name_search = {
  name: 'companyName',
  label: 'Assurance',
  type: 'text',
  id: 'companyName',
  placeholder: 'Assurance ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const window_price_input = {
  name: 'price',
  label: 'Prix',
  type: 'number',
  id: 'price',
  placeholder: 'Prix ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const transit_company_name_search = {
  name: 'name',
  label: 'Transport',
  type: 'text',
  id: 'name',
  placeholder: 'Transport ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const car_brand_validation = {
  name: 'brand',
  label: 'Marque',
  type: 'text',
  id: 'brand',
  placeholder: 'Marque',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const window_brand_selection = {
  name: 'windowBrandId',
  label: 'Marque de vitre',
  type: 'select',
  id: 'windowBrandId',
  placeholder: 'Marque de vitre',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const window_detail_selection = {
  name: 'windowDetailId',
  label: 'offre de vitre',
  type: 'select',
  id: 'windowDetailId',
  placeholder: 'offre de vitre',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const car_model_validation = {
  name: 'carModelId',
  label: 'Modèle',
  type: 'select',
  id: 'carModel',
  placeholder: 'Modèle',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
  },
}

export const car_model_input = {
  name: 'model',
  label: 'Modèle',
  type: 'text',
  id: 'model',
  placeholder: 'Modèle',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
  },
}

export const comment_validation  = {
  name: 'comment',
  label: 'Commentaire',
  type: 'text',
  id: 'comment',
  placeholder: 'commentaire ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
  },
}

export const brand_validation = {
  name: 'brandId',
  label: 'Marque',
  type: 'select',
  id: 'brandId',
  placeholder: 'Marque',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
  },
}
export const destination_validation = {
  name: 'destination',
  label: 'Destination',
  multiline: true,
  id: 'destination',
  placeholder: ' destination ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const destination_search = {
  name: 'destination',
  label: 'Destination',
  multiline: true,
  id: 'destination',
  placeholder: ' destination ...',
  validation: {
    required: {
      value: false,
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const user_name_validation = {
  name: 'username',
  label: 'Nom d\'utilisateur',
  type: 'text',
  id: 'username',
  placeholder: 'Nom d\'utilisateur ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const password_validation = {
  name: 'password',
  label: 'Mot de passe',
  type: 'password',
  id: 'password',
  placeholder: 'Mot de passe ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const password_validation_edit = {
  name: 'password',
  label: 'Mot de passe',
  type: 'password',
  id: 'password',
  placeholder: 'Mot de passe ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const email_validation = {
  name: 'email',
  label: 'email',
  type: 'email',
  id: 'email',
  placeholder: 'email ...',
  validation: {
    required: {
      value: false,
    },
    maxLength: {
      value: 50,
      message: '30 characters max',
    },
  },
}
export const registration_number_validation = {
  name: 'registrationNumber',
  label: 'Numéro d\'immatriculation',
  type: 'text',
  id: 'registrationNumber',
  placeholder: 'Numéro d\'immatriculation ...',
  validation: {
    required: {
      value: true,
      message: 'Ce champ est obligatoire',
    },
    // Adding the Moroccan Plate Regex here
    pattern: {
      value: /^(?:\d{5}[A-Za-z\u0600-\u06FF]\d{2}|[A-Za-z]{2}\d{6})$/,
      message: 'Format invalide (Ex: 12345A06, WW123456, FA123456)',
    },
    maxLength: {
      value: 8, // Changed to 8 since you want strict format
      message: '8 caractères exactement',
    },
    minLength: {
      value: 8,
      message: '8 caractères exactement',
    },
  },
}
export const registration_number_search = {
  name: 'registrationNumber',
  label: 'Numéro d\'immatriculation',
  type: 'text',
  id: 'registrationNumber',
  placeholder: 'Numéro d\'immatriculation ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const Phone_number_input = {
  name: 'phoneNumber',
  label: 'Numéro de téléphone',
  type: 'text',
  id: 'phoneNumber',
  placeholder: 'Numéro de téléphone ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '10 characters max',
    },
  },
}

export const year_validation = {
  name: 'year',
  label: 'Année',
  type: 'number',
  id: 'year',
  placeholder: 'Année ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    max: {
      value: new Date().getFullYear(),
      message: `Year can't be in the future`,
    },
  },
  min: {
    value: 1886,
    message: `Year seems too old`,
  },
  step : 1,
}

export const window_type_validation = {
  name: 'windowType',
  label: 'Type de vitre',
  type: 'select',
  id: 'windowType',
  placeholder: 'Type de vitre',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const company_validation = {
  name: 'companyId',
  label: 'Assurance',
  type: 'select',
  id: 'companyId',
  placeholder: 'Assurance ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const role_validation = {
  name: 'roleId',
  label: 'rôle',
  type: 'select',
  id: 'roleId',
  placeholder: 'rôle ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const status_validation = {
  name: 'status',
  label: 'statut',
  type: 'select',
  id: 'status',
  placeholder: 'active ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const company_search = {
  name: 'companyId',
  label: 'Assurance',
  type: 'select',
  id: 'companyId',
  placeholder: 'Assurance ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const company_multi_select = {
  name: 'companies',
  label: 'Assurance',
  type: 'multiSelect',
  id: 'companies',
  placeholder: 'Assurance ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const role_one_select = {
  name: 'roles',
  label: 'rôle',
  type: 'select',
  id: 'roles',
  placeholder: 'rôle ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const status_search = {
  name: 'status',
  label: 'statut',
  type: 'select',
  id: 'status',
  placeholder: 'statut ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const comment_search = {
  name: 'commentId',
  label: 'commentaire',
  type: 'select',
  id: 'commentId',
  placeholder: 'commentaire ...',
  validation: {
    required: {
      value: true,
      message: 'commentaire obligatoire',
    },
    maxLength: {
      value: 30,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const file_number_validation = {
  name: 'fileNumber',
  label: 'numero de dossier',
  type: 'text',
  id: 'commentId',
  placeholder: 'numero de dossier ...',
  validation: {
    required: {
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const city_validation = {
  name: 'cityId',
  label: 'Ville',
  type: 'select',
  id: 'cityId',
  placeholder: 'Ville ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}
export const city_validation_text = {
  name: 'cityName',
  label: 'Ville',
  type: 'text',
  id: 'cityName',
  placeholder: 'Ville ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const city_search = {
  name: 'cityId',
  label: 'Ville',
  type: 'select',
  id: 'cityId',
  placeholder: 'Ville ...',
  validation: {
    required: {
      value: false
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
  },
}

export const image_validation = {
  name: 'images', // Changed to plural for clarity
  label: 'Images',
  type: 'file',
  id: 'images',
  multiple: true, // This allows selecting multiple files in the browser
  placeholder: 'Upload images...',
  validation: {
    required: {
      value: true,
      message: 'At least one image is required',
    },
  },
}
// in your validation file
export const transit_company_search = {
    name: 'transitCompanyId',
    label: 'Transporteur',
    id: 'transitCompanyId',
    validation: {
        required: {
            value: true,
            message: 'Requis',
        },
    },
};

export const declaration_number_input = {
    name: 'declarationNumber',
    label: 'Numéro de déclaration',
    type: 'text',
    id: 'declarationNumber',
    placeholder: 'Ex: TR-2026-XYZ',
    
};