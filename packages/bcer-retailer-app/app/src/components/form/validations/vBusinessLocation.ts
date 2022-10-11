import * as yup from 'yup';
import { NoiStatus } from '@/constants/localEnums';
import { GeoCodeUtil } from '@/utils/geoCoder.util';

export interface IBusinessLocationValues {
  location_type: string,
  id?: string;
  addressLine1: string;
  geoAddressConfidence: string;
  postal: string;
  city: string;
  phone: string;
  email: string;
  underage: string;
  underage_other?: string;
  health_authority: string;
  health_authority_other?: string;
  health_authority_display?: string;
  doingBusinessAs: string;
  manufacturing: string;
  latitude: string;
  longitude: string;
  tableData?: {
    id: number
  },
  noi?: {
    created_at: Date;
    status: NoiStatus;
    renewed_at: Date;
    updated_at: Date;
    expiry_date: Date;
  }
  error?: boolean;
  webpage: string;
}

export const Initial = {
  location_type: '',
  addressLine1: '',
  geoAddressConfidence: '',
  postal: '',
  city: '',
  phone: '',
  email: '',
  underage: '',
  underage_other: '',
  health_authority: '',
  health_authority_other: '',
  doingBusinessAs: '',
  manufacturing: '',
  latitude: '',
  longitude: '',
  webpage: ''
};

export const Validation = yup.object({
  location_type: yup.string().required(),
  addressLine1: yup.string().when('location_type', {
    is: (locationType) => locationType === 'physical' || locationType === 'both',
    then: yup.string()
          .required('The address of your place of business is required')
          .test('exists', `Address couldn't be found or is incorrect`,async (val) => await GeoCodeUtil.isValidAddress(val)),
  }), 
  addressLine2: yup.string().test('length', 'The address must be less than 100 characters.', val => (val?.length <= 100 || val === undefined)),
  postal: yup.string().when('location_type', {
    is: (locationType) => locationType === 'physical' || locationType === 'both',
    then: yup.string()
          .required('Postal Code is a required field')
          .matches(
            /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            'Please provide a valid postal code'
          )          
  }),
  city: yup.string().when('location_type', {
    is: (locationType) => locationType === 'physical' || locationType === 'both',
    then: yup.string()
          .test('length', 'The city must be less than 50 characters.', val => val?.length <= 50).required('City is a required field')
  }),
  phone: yup.string()
    .matches(
      /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid phone number'
    )
    .required('A Phone number is required'),
  email: yup.string().email('Invalid Email').required('Email is a required field'),
  underage: yup.string().when('location_type', {
    is: (locationType) => locationType === 'physical' || locationType === 'both',
    then: yup.string().required('This is a required field')
  }),
  underage_other: yup.string().when('underage', {
    is: 'other',
    then: yup.string().required('Please provide details')
  }),
  doingBusinessAs: yup.string().test('length', 'The business name must be less than 100 characters.', val => (val?.length <= 100 || val === undefined)),
  health_authority: yup.string().when('location_type', {
    is: (locationType) => locationType === 'physical' || locationType === 'both',
    then: yup.string().required('Please select your Health Authority')
  }),
  health_authority_other: yup.string().when('health_authority', {
    is: 'other',
    then: yup.string().required('Please provide details')
  }),
  manufacturing: yup.string().required('This is a required field'),
  webpage: yup.string().when('location_type', {
    is: (locationType) => locationType === 'online' || locationType === 'both',
    then: yup.string()
          .required('Please provide business URL')
          .matches(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
            'Please provide a valid business webpage'
          )
  })
});

export const ValidateLocationWithNOI = yup.object({
  phone: yup.string()
    .matches(
      /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid phone number'
    )
    .required('A Phone number is required'),
  email: yup.string().email('Invalid Email').required('Email is a required field'),
})
