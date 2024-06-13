import * as yup from 'yup';

export interface BusinessDetailsValues {
  email: string;
  webpage: string;
  legalName: string;
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postal: string;
  phone: string;
}

export const Initial = {
  email: '',
  webpage: '',
  legalName: '',
  businessName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postal: '',
  phone: ''
};


export const Validation = yup.object({
  email: yup.string().email('Invalid email').required('Email is a required field'),
  webpage: yup.string().test('length', 'The URL must be less than 100 characters.', val => (val?.length <= 100 || val === undefined)),
  legalName: yup.string().test('length', 'The business legal name must be less than 100 characters.', val => val?.length <= 100).required('The legal name of your business is required'),
  businessName: yup.string().test('length', 'The business name must be less than 100 characters.', val => val?.length <= 100).required('The name of your business is required'),
  addressLine1: yup.string().test('length', 'The address must be less than 100 characters.', val => val?.length <= 100).required('The address of your place of business is required'),
  addressLine2: yup.string().test('length', 'The address must be less than 100 characters.', val => (val?.length <= 100 || val === undefined)),
  city: yup.string().test('length', 'The city must be less than 50 characters.', val => val?.length <= 50).required('City is a required field'), 
  province: yup.string().required('Province is a required field'),
  postal: yup.string()
    .matches(
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      'Please provide a valid postal code'
    )
    .required('Postal code is a required field'),
  phone: yup.string()
    .matches(
      /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid phone number'
    )
    .required('A phone number is required'),
});
