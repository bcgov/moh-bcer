import * as yup from 'yup';

const lengthTest = (length: number) => {
  return (val: string) => val.length <= length;
};

export const ProductReportCsvValidation = yup.object({
  type: yup
    .string()
    .required('Type is required')
    .test(
      'length',
      'Type must be less than 100 characters.',
      lengthTest(100)
    ),
  brandName: yup
    .string()
    .required('Brand Name is required')
    .test(
      'length',
      'Brand Name must be less than 40 characters.',
      lengthTest(40)
    ),
  productName: yup
    .string()
    .required('Product Name is required')
    .test(
      'length',
      'Product Name must be less than 100 characters.',
      lengthTest(100)
    ),
  manufacturerName: yup
    .string()
    .required('Manufacturer Name is required')
    .test(
      'length',
      'Manufacturer Name must be less than 50 characters.',
      lengthTest(50)
    ),
  manufacturerContact: yup
    .string()
    .optional()
    .test(
      'length',
      'Manufacturer Contact Person must be less than 50 characters.',
      lengthTest(50)
    ),
  manufacturerAddress: yup
    .string()
    .required('Manufacturer Address is required')
    .test(
      'length',
      'Manufacturer Address must be less than 160 characters.',
      lengthTest(160)
    ),
  manufacturerEmail: yup
    .string()
    .required('Manufacturer Email is a required field')
    .email('Invalid Manufacturer Email'),
  manufacturerPhone: yup
    .string()
    .required('Manufacturer Phone number is required')
    .matches(
      /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid Manufacturer phone number'
    ),
  concentration: yup
    .string()
    .required('Concentration is required')
    .matches(
      /\d{1,3}(\.\d{0,2})?/,
      'Concentration must be a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
    ),
  containerCapacity: yup
    .string()
    .required('Container Capacity is required')
    .matches(
      /\d{1,3}(\.\d{0,2})?/,
      'Container Capacity must be a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
    ),
  cartridgeCapacity: yup
    .string()
    .required('Cartridge Capacity is required')
    .matches(
      /\d{1,3}(\.\d{0,2})?/,
      'Cartridge Capacity must be a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
    ),
  ingredients: yup
    .string()
    .required('Ingredients are required')
    .test(
      'length',
      'Ingredients must be less than 255 characters',
      lengthTest(255)
    ),
  flavour: yup
    .string()
    .required('Flavour is required')
    .test(
      'length',
      'Flavour must be less than 100 characters.',
      lengthTest(100)
    ),
});
