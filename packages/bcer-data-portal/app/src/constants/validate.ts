import * as yup from 'yup';

export const userEditValidationSchema = yup.object({
    active: yup.boolean().required('Please choose user status'),
    selectedBusiness: yup.object({id: yup.string()}).nullable().test('business', 'Please select new business', (b) => b?.id),
    mergeData: yup.boolean().required('Please select merge options'),
    confirmed: yup.boolean().required().test('confirmed', 'Please confirm you choice', (value) => value === true)
})