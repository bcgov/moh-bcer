import * as yup from 'yup';
import { Ingredient } from '@/constants/localInterfaces';

export interface ManufacturingReportValues {
  productName: string;
  ingredients: Ingredient[];
}

export const Initial = {
  productName: '',
  ingredients: [{
    name: '',
    scientificName: '',
    manufacturerName: '',
    manufacturerAddress: '',
    manufacturerPhone: '',
    manufacturerEmail: '',
  }],
};

export const Validation = yup.object().shape({
  productName: yup.string().min(3).required('You must provide a product name'),
  ingredients: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      scientificName: yup.string().when('name', {
        is: (name: string) => name?.length,
        then: () => yup.string().notRequired(),
        otherwise: () => yup.string().min(1).required('A common name or a scientific name is required'),
      }),
      manufacturerName: yup.string().min(1).required('Manufacturer name is required'),
      manufacturerAddress: yup.string().min(1).required('Manufacturer address is required'),
      manufacturerPhone: yup.string()
        .matches(
          /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
          'Please provide a valid phone number'
        ).required('A phone number is required'),
      manufacturerEmail: yup.string().email('Please provide a valid email').required('An email is required'),
    })
  ).required('This manufacturing report must specify at least one ingredient').min(1),
});
