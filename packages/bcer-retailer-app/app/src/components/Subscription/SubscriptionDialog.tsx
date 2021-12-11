import { subscriptionValidationSchema } from '@/components/form/validations/vSubscription';
import {
  Subscription,
  SubscriptionFormData,
} from '@/constants/localInterfaces';
import { GeneralUtil } from '@/utils/util';
import { Form, Formik } from 'formik';
import React from 'react';
import {
  StyledCheckbox,
  StyledDialog,
  StyledTextField,
  StyledTextInput,
} from 'vaping-regulation-shared-components';

interface SubscriptionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: SubscriptionFormData, type: 'subscribe' | 'unsubscribe') => void;
  data: Subscription;
  getInitialFormData: () => SubscriptionFormData;
}

function SubscriptionDialog({
  open,
  setOpen,
  onSubmit,
  getInitialFormData,
}: SubscriptionDialogProps) {
  function formatPhoneNumber(event: any, setFieldValue: any) {
    setFieldValue(
      event.target.name,
      GeneralUtil.formatPhoneNumber(event.target.value)
    );
  }

  return (
    <Formik
      initialValues={getInitialFormData()}
      onSubmit={(values)=>onSubmit(values, 'subscribe')}
      validationSchema={subscriptionValidationSchema}
    >
      {({ values, ...helpers }) => (
        <Form>
          <StyledDialog
            open={open}
            cancelButtonText="Cancel"
            acceptButtonText="Save Changes"
            acceptHandler={() => helpers.submitForm()}
            cancelHandler={() => setOpen(false)}
            title="Subscribe To SMS Notification"
          >
            <StyledTextField
              onChange={(event: any) => {
                formatPhoneNumber(event, helpers.setFieldValue);
              }}
              label="Primary Phone Number"
              name="phoneNumber1"
              fullWidth
              variant="filled"
            />
            <StyledTextField
              onChange={(event: any) => {
                formatPhoneNumber(event, helpers.setFieldValue);
              }}
              label="Secondary Phone Number (optional)"
              name="phoneNumber2"
              fullWidth
              variant="filled"
            />
            <StyledCheckbox
              name="confirmed"
              label="I give permission to the Ministry of Health to send me notifications and reminders on the provided phone numbers"
            />
          </StyledDialog>
        </Form>
      )}
    </Formik>
  );
}

export default SubscriptionDialog;
