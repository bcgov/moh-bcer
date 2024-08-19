import { GeoCodeUtil } from '@/utils/geoCoder.util';
import * as yup from 'yup';

export const BusinessCsvValidation = yup.object({
  location_type: yup.string().required(),
  addressLine1: yup.string().when('location_type', {
    is: (locationType: string) => locationType === 'physical' || locationType === 'both',
    then: () => yup.string().max(100, 'The address must be less than 100 characters.').required('The address of your place of business is required') as yup.StringSchema<string>,
  }),
  postal: yup.string().when('location_type', {
    is: (locationType: string) => locationType === 'physical' || locationType === 'both',
    then: () => yup.string()
      .required('Postal Code is a required field')
      .matches(
        /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        'Please provide a valid postal code'
      ) as yup.StringSchema<string>,
  }),
  city: yup.string().when('location_type', {
    is: (locationType: string) => locationType === 'physical' || locationType === 'both',
    then: () => yup.string().test('length', 'The city must be less than 50 characters.', val => val?.length <= 50).required('City is a required field') as yup.StringSchema<string>,
  }),
  phone: yup.string()
    .matches(
      /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid phone number'
    )
    .required('A Phone number is required'),
  email: yup.string().email('Invalid Email').required('Email is a required field'),
  underage: yup.string().when('location_type', {
    is: (locationType: string) => locationType === 'physical' || locationType === 'both',
    then: () => yup.string().required('This is a required field').test('length', 'The underage option must be less than 40 characters.', val => val?.length <= 40) as yup.StringSchema<string>,
  }),
  doingBusinessAs: yup.string().test('length', 'The business name must be less than 100 characters.', val => (val?.length <= 100 || val === undefined)),
  health_authority: yup.string().when('location_type', {
    is: (locationType: string) => locationType === 'physical' || locationType === 'both',
    then: () => yup.string().required('Please select your Health Authority').test('length', 'The health authority must be less than 30 characters.', val => val?.length <= 30) as yup.StringSchema<string>,
  }),
  manufacturing: yup.string().required('This is a required field').test('string boolean', 'The manufacturing field must only contain a "Yes" or a "No"', val => (val.toLowerCase() === "yes" || val.toLowerCase() === "no")),
  webpage: yup.string().when('location_type', {
    is: (locationType: string) => locationType === 'online' || locationType === 'both',
    then: () => yup.string()
          .required('Please provide business URL')
          .matches(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
            'Please provide a valid business webpage'
          ) as yup.StringSchema<string>,
  })  
});