import { massContactValidationSchema } from '@/components/form/validations/vMassContactUpdate';
import Loader from '@/components/Sales/Loader';
import { BusinessLocation } from '@/constants/localInterfaces';
import { useAxiosPatch } from '@/hooks/axios';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import { useToast } from '@/hooks/useToast';
import { LocationUtil } from '@/utils/location.util';
import { Box, Typography } from '@material-ui/core';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  InputFieldError,
  StyledConfirmDialog,
  StyledDialog,
  StyledTable,
  StyledTextField,
  StyledTextInput,
} from 'vaping-regulation-shared-components';

export interface UpdateLocationContact {
  email: string;
  phone: string;
  ids: string[];
}

export interface MassUpdateLocationProps {
  setMultipleUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingLocations: BusinessLocation[];
  refreshData: Function;
}

function MassUpdateLocation({
  setMultipleUpdateOpen,
  existingLocations,
  refreshData,
}: MassUpdateLocationProps) {
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const [openConfirm, setOpenConfirm] = useState(false);
  const { openToast } = useToast();
  const [updateValues, setUpdateValues] = useState<UpdateLocationContact>();
  const data = useMemo(
    () =>
      existingLocations.map((m: BusinessLocation) => {
        return { ...m, tableData: { checked: true } };
      }),
    [existingLocations]
  );

  const initialIds = useMemo(
    () => existingLocations.map((m: BusinessLocation) => m.id),
    [existingLocations]
  );

  const [{ loading, error }, patch] = useAxiosPatch(
    '/location/update-contact',
    { manual: true }
  );

  useEffect(() => {
    showNetworkErrorMessage(error);
  }, [error]);

  const submit = async () => {
    const { data } = await patch({ data: updateValues });
    const success: string[] = [];
    const error: string[] = [];
    if (data.success) {
      success.push(
        `Successfully updated contact info for ${data.success} locations`
      );
    }
    if (data.fail) {
      error.push(`Failed to update contact into for ${data.fail} locations`);
    }
    setMultipleUpdateOpen(false);
    openToast({
      successMessages: success,
      errorMessages: error,
      type: error?.length ? 'warning' : 'success',
    });
    refreshData();
  };

  return (
    <Box>
      <Formik
        initialValues={{
          email: '',
          phone: '',
          ids: initialIds,
        }}
        validationSchema={massContactValidationSchema}
        onSubmit={(v) => {
          setUpdateValues(v);
          setOpenConfirm(true);
        }}
      >
        {({ values, ...helpers }) => (
          <Form>
            <StyledDialog
              open={true}
              title="Update contact details for multiple locations "
              acceptButtonText="Update"
              acceptHandler="submit"
              cancelHandler={() => setMultipleUpdateOpen(false)}
              cancelButtonText="Back"
              maxWidth="md"
            >
              <Box display="flex" mb={2}>
                <Box flex={0.48}>
                  <StyledTextField name="email" label="Business Email" />
                </Box>
                <Box flex={0.04} />
                <Box flex={0.48}>
                  <StyledTextField name="phone" label="Business Phone Number" />
                </Box>
              </Box>
              <StyledTable
                columns={LocationUtil.getTableColumns([
                  'address1',
                  'city',
                  'postal',
                  'doingBusinessAs',
                  'phone',
                  'email',
                  'status',
                ])}
                data={data || []}
                options={{
                  selection: true,
                  pageSize: 5,
                  pageSizeOptions: [5, 10, 20],
                }}
                onSelectionChange={(rowData: any) => {
                  helpers.setFieldValue(
                    'ids',
                    rowData?.map((r: any) => r.id) ?? []
                  );
                }}
              />
              {helpers.touched?.ids && !!helpers.errors?.ids ? (
                <InputFieldError error={<ErrorMessage name="ids" />} />
              ) : (
                <Box height={'22px'}> </Box>
              )}
            </StyledDialog>
            <Loader
              message="Updating contact info. Please wait ..."
              open={loading}
            />
          </Form>
        )}
      </Formik>
      {openConfirm && (
        <StyledConfirmDialog
          open={openConfirm}
          maxWidth="xs"
          dialogTitle="Update Contact Information"
          checkboxLabel="I confirm that the information I entered is correct"
          dialogMessage="You are about to update the contact information for all the selected locations"
          setOpen={() => setOpenConfirm(false)}
          confirmHandler={submit}
          acceptDisabled={loading}
        />
      )}
    </Box>
  );
}

export default MassUpdateLocation;
