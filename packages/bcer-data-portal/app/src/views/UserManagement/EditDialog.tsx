import { Business, UserDetails } from '@/constants/localInterfaces';
import { userEditValidationSchema } from '@/constants/validate';
import { UserManagementUtil } from '@/util/userManagement.util';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import {
  InputFieldError,
  StyledAutocomplete,
  StyledCheckbox,
  StyledDialog,
  StyledRadioGroup,
  StyledWarning,
} from 'vaping-regulation-shared-components';

interface EditDialogProps {
  businessData: Business[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetUser: UserDetails;
  submitHandler: (data: any) => void;
  buttonLoading?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#333',
  },
  boldText: {
    size: '16px',
    lineHeight: '24px',
    fontWeight: 'bold',
  },
  helperText: {
    size: '13px',
    lineHeight: '20px',
  },
  mergeContainer: {
    padding: '10px 20px 0px',
    backgroundColor: '#E1E1E6',
    borderRadius: '4px',
  },
}));

function EditDialog({
  businessData,
  open,
  setOpen,
  targetUser,
  submitHandler,
  buttonLoading,
}: EditDialogProps) {
  const classes = useStyles();
  return (
    <Formik
      initialValues={UserManagementUtil.getUserUpdateInitialValues(targetUser)}
      onSubmit={submitHandler}
      validationSchema={userEditValidationSchema}
    >
      {({ values, ...helpers }) => (
        <Form>
          <StyledDialog
            open={open}
            cancelButtonText="Cancel"
            acceptButtonText="Save Changes"
            acceptHandler={() => helpers.submitForm()}
            cancelHandler={() => setOpen(false)}
            title="Edit Info"
            acceptDisabled={buttonLoading}
          >
            <Box className={classes.root}>
              <Box display="flex" alignItems="center" marginY={2}>
                <Typography>User name</Typography>
                <Box marginX={2} />
                <Typography className={classes.boldText}>
                  {`${targetUser?.firstName || ''} ${
                    targetUser?.lastName || ''
                  }`}
                </Typography>
              </Box>
              <Typography className={classes.boldText}>
                Business Name
              </Typography>
              <Typography className={classes.helperText}>
                Select other Business Name in the field below if you want to
                move this user to other business.
              </Typography>
              <StyledAutocomplete
                options={
                  businessData?.filter(
                    (b) => b.id != targetUser?.business?.id
                  ) || []
                }
                getOptionLabel={(b: Business) => b.businessName || b.legalName}
                onChange={(e: any, newValue: Business) => {
                  helpers.setFieldValue('selectedBusiness', newValue);
                }}
              />
              {helpers.errors.selectedBusiness && (
                <InputFieldError
                  error={<ErrorMessage name={'selectedBusiness'} />}
                />
              )}
              {values.selectedBusiness && (
                <Box>
                  <StyledWarning
                    text={`User can have all the access to ${
                      values.selectedBusiness?.businessName ||
                      values.selectedBusiness?.legalName
                    }`}
                  />
                  <Box className={classes.mergeContainer}>
                    <Box mt={2}>
                      <StyledRadioGroup
                        label={`Do you you want to merge all data from "${
                          targetUser?.business?.businessName ||
                          targetUser?.business?.legalName
                        }"
                        business to "${
                          values.selectedBusiness.businessName ||
                          values.selectedBusiness.legalName
                        }". All the data including Users,
                        Business name, Address and Email address.`}
                        name="mergeData"
                        options={[
                          { label: 'Yes', value: true },
                          { label: 'No', value: false },
                        ]}
                        row={true}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              <StyledCheckbox
                name="confirmed"
                label={`I understand that I will be required to wait for 6 weeks 
                  from the time that I file or update my product report before I can sell my product.`}
              />
            </Box>
          </StyledDialog>
        </Form>
      )}
    </Formik>
  );
}

export default EditDialog;
