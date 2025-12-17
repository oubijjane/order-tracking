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
  name: 'carModel',
  label: 'Modèle',
  type: 'text',
  id: 'carModel',
  placeholder: 'Modèle',
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