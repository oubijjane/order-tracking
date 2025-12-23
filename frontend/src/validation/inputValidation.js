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
export const car_validation = {
  name: 'carName',
  label: 'Marque',
  type: 'text',
  id: 'carName',
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
export const registration_number_validation = {
  name: 'registrationNumber',
  label: 'Numéro d\'immatriculation',
  type: 'text',
  id: 'registrationNumber',
  placeholder: 'Numéro d\'immatriculation ...',
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

export const image_validation = {
  name: 'image',
  label: 'Image',
  type: 'file',
  id: 'image',
  placeholder: 'Image ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
  },
}