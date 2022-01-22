import * as yup from 'yup';
export const subscriptionValidationSchema = yup.object({
    phoneNumber1: yup.string().required('Primary Phone Number is required').matches(/^\(\d{3}\)\s\d{3}-\d{4}$/, 'Please Provide a valid 10 digit phone number'),
    phoneNumber2: yup.string().optional().matches(/^\(\d{3}\)\s\d{3}-\d{4}$/, 'Please Provide a valid 10 digit phone number'),
    confirmed: yup.boolean().test('confirmation', 'Please confirm', (v) => v === true),
})