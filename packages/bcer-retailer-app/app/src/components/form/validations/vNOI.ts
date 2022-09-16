import * as yup from 'yup';

export interface INoiValues {
  email: string;
  webpage: string;
  legalName: string;
  businessName: string;
  address: string;
  city: string;
  postal: string;
  phone: string;
  underage: string;
  underage_other: string;
  ha: string;
  doingBusinessAs: string;
  manufacturing?: boolean;
}

export const Initial = {
  email: '',
  webpage: '',
  legalName: '',
  businessName: '',
  address: '',
  city: '',
  postal: '',
  phone: '',
  underage: '',
  underage_other: '',
  ha: '',
  doingBusinessAs: '',
};

export const Validation = yup.object({
  type: yup.string().oneOf(['new', 'update', 'renew']).required(),
  email: yup.string().email('Invalid Email').required('Email is a required field'),
  webpage: yup.string().url(),
  legalName: yup.string().required('The legal name of your business is required'),
  businessName: yup.string().required('The name of your business is required'),
  address: yup.string().required('The address of your place of business is required'),
  city: yup.string().required('City is a required field'),
  postal: yup.string().required('Postal Code is a required field'),
  phone: yup.string()
    .matches(
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid phone number'
    )
    .required('A Phone number is required'),
  underage: yup.string().required('This is a required field'),
  underage_other: yup.string().when('underage', {
    is: 'other',
    then: yup.string().required('Please provide details')
  }),
  doingBusinessAs: yup.string(),
  ha: yup.string().required('Please select your Health Authority'),
  manufacturing: yup.boolean().oneOf([true, false], 'x'),
});
