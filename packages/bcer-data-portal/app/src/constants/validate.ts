import * as yup from 'yup';

export const userEditValidationSchema = yup.object({
    active: yup.boolean().required('Please choose user status'),
    selectedBusiness: yup.object({id: yup.string()}).nullable().test('business', 'Please select new business', (b) => b?.id),
    mergeData: yup.boolean().required('Please select merge options'),
    confirmed: yup.boolean().required().test('confirmed', 'Please confirm you choice', (value) => value === true)
})

export const noteValidateSchema = yup.object({
    content: yup.string().required('Content can not be empty').max(1024, 'Must be less than 1024 characters')
})

export const notificationValidationSchema = yup.object({
    title: yup.string().optional(),
    message: yup.string().required('Message can not be empty').max(612, 'Must be less than 612 characters'),
    confirm: yup.boolean().required().test('confirm', 'Please confirm', (v) => !!v)
})

export const faqValidationSchema = yup.object({
  title: yup.string().required('Question cannot be empty'),
  description: yup.string().required('Response cannot be empty')
})