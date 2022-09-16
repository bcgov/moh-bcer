import * as yup from 'yup';

const lengthTest = (length: number) => {
  return (val: string) => val?.length <= length;
};

export const ProductReportCsvValidation = yup.object({
  type: yup
    .string()
    .nullable()
    .required('Type is required')
    .test('length', 'Type must be less than 100 characters.', lengthTest(100)),
  brandName: yup
    .string()
    .nullable()
    .required('Brand Name is required')
    .test(
      'length',
      'Brand Name must be less than 40 characters.',
      lengthTest(40)
    ),
  productName: yup
    .string()
    .nullable()
    .required('Product Name is required')
    .test(
      'length',
      'Product Name must be less than 100 characters.',
      lengthTest(100)
    ),
  manufacturerName: yup
    .string()
    .nullable()
    .required('Manufacturer Name is required')
    .test(
      'length',
      'Manufacturer Name must be less than 50 characters.',
      lengthTest(50)
    ),
  manufacturerContact: yup.string().nullable().max(50),
  manufacturerAddress: yup
    .string()
    .nullable()
    .required('Manufacturer Address is required')
    .test(
      'length',
      'Manufacturer Address must be less than 160 characters.',
      lengthTest(160)
    ),
  manufacturerEmail: yup
    .string()
    .nullable()
    .required('Manufacturer Email is a required field')
    .email(
      'Please provide a valid Manufacturer Email (e.g. example@mail.com)'
    ),
  manufacturerPhone: yup
    .string()
    .nullable()
    .required('Manufacturer Phone number is required')
    .matches(
      /(\+)?(1(-|\.)?(\()?\d{3}(\))?(-|\.)?\d{3}(-|\.)?\d{4})(:\d{1,4})?|(\d{3}(-|\.)?\d{3}(-|\.)?\d{4})(:\d{1,4})?$/,
      'Please provide a valid Manufacturer phone number (e.g. XXX-XXX-XXXX)'
    ),
  concentration: yup
    .string()
    .nullable()
    .required('Concentration is required')
    .matches(
      /^\d{1,3}(\.\d{1,2})?$/,
      'Concentration must be a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
    ),
  containerCapacity: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^\d{1,3}(\.\d{1,2})?$/,
      'Container Capacity must be a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
    )
    .when('cartridgeCapacity', {
      is: (cartCap) => !cartCap?.length,
      then: () =>
        yup
          .string()
          .nullable()
          .required('Container Capacity (or Cartridge Capacity) is required')
          .matches(
            /^\d{1,3}(\.\d{1,2})?$/,
            'Container Capacity must be a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
          ),
    }),
  cartridgeCapacity: yup
    .string()
    .nullable()
    .matches(
      /^\d{1,3}(\.\d{1,2})?$/,
      'Cartridge Capacity must be empty or a valid number upto 999 with max 2 digit floating points eg 10, 32.87 etc'
    )
    .optional(),
  ingredients: yup
    .string()
    .nullable()
    .required('Ingredients are required')
    .test(
      'length',
      'Ingredients must be less than 255 characters',
      lengthTest(255)
    ),
  flavour: yup
    .string()
    .nullable()
    .required('Flavour is required')
    .test(
      'length',
      'Flavour must be less than 100 characters.',
      lengthTest(100)
    ),
});
