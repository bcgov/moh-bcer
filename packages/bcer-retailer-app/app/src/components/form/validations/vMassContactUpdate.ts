import * as yup from 'yup';

export const massContactValidationSchema = yup.object().shape({
  phone: yup.string()
        .matches(
          /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
          'Please provide a valid phone number'
        ).required('A phone number is required'),
  email: yup.string().email('Please provide a valid email').required('An email is required'),
  ids: yup.array().of(yup.string()).min(1, "Must select at least one location"),
})