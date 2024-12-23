import React, { useContext, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import { StyledDialog, StyledButton } from 'vaping-regulation-shared-components';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import {
  IBusinessLocationValues,
  ValidateLocationWithNOI,
  Validation,
  Initial
} from '@/components/form/validations/vBusinessLocation';
import BusinessLocationInputs from '@/components/form/inputs/BusinessLocationInputs';
import ViewLocation from '@/components/MyBusiness/locations/ViewLocation';
import { NoiStatus } from '@/constants/localEnums';
import { LocationUtil } from '@/utils/location.util';

const StyledAddButton = styled(StyledButton)(({ theme }) => ({
  minWidth: '160px',
}));

const StyledAddIcon = styled(AddCircleIcon)(({ theme }) => ({
  fontSize: '16px',
  paddingRight: '8px',
  alignSelf: 'center',
}));

interface LocationsEditFormProps {
  rowData?: IBusinessLocationValues;
  openProps: {
    isOpen: boolean;
    toggleOpen: Dispatch<SetStateAction<boolean>>;
    isAddNew?: boolean;
    toggleEditConfirmOpen?: Dispatch<SetStateAction<boolean>>;
    setConfirmTarget?: Dispatch<SetStateAction<any>>;
    isViewOnly?: boolean;
  };
}

export default function LocationsEditForm({ rowData, openProps }: LocationsEditFormProps) {
  const { isOpen, toggleOpen, isAddNew, isViewOnly } = openProps;
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);
  const [initialErrors, setInitialErrors] = useState<FormikErrors<IBusinessLocationValues>>();
  const [initialTouched, setInitialTouched] = useState<FormikTouched<IBusinessLocationValues>>();
  const getUniqueIdentifier = (location: { doingBusinessAs?: string; addressLine1?: string; webpage?: string; phone?: string; email?: string;}) => {
    if (!location) {
      console.log('getUniqueIdentifier called with null or undefined location');
      return '';
    }
    const identifier = [
      location.doingBusinessAs,
      location.addressLine1,
      location.webpage,
      location.phone,
      location.email
    ].map(val => val || '').join('-');
    return identifier;
  };

  useEffect(() => {
    async function initialValidation() {
      if (rowData) {
        setInitialTouched(null);
        setInitialErrors(null);
        try {
          await Validation.validate(rowData, { abortEarly: false });
        } catch (e) {
          const errorTypeConversion = e as any;
          let errors: { [key: string]: string } = {};
          let touched: { [key: string]: boolean } = {};

          errorTypeConversion.inner.forEach((element: any) => {
            errors[`${element.path}`] = element.message;
            touched[`${element.path}`] = true;
          });
          setInitialErrors(errors);
          setInitialTouched(touched);
        }
      }
    }
    initialValidation();
  }, [rowData]);

  const addLocation = (values: IBusinessLocationValues) => {
    // add new location
    setBusinessInfo({
      ...businessInfo,
      locations: [...businessInfo.locations, LocationUtil.sanitizeSubmittedLocation(values)],
    });
    toggleOpen(false);
  };

  const editLocation = (values: IBusinessLocationValues) => {
    // edit existing location
    if (values?.id) {
      openProps?.setConfirmTarget?.(values);
      openProps?.toggleEditConfirmOpen?.(true);
      return;
    }
    // edit new add location
    const existingLocations = businessInfo.locations.filter((l: any) => !!l.id);
    const addedLocations = businessInfo.locations.filter((l: any) => !l.id);    
    const newAddedLocations = addedLocations.map((element: IBusinessLocationValues) => {
      if (!element) return null;      
      return getUniqueIdentifier(element) === getUniqueIdentifier(rowData)
        ? LocationUtil.sanitizeSubmittedLocation(values)
        : LocationUtil.sanitizeSubmittedLocation(element);
    }).filter(Boolean); //remove any null values
    const newLocations = [...existingLocations, ...newAddedLocations];
    setBusinessInfo({ ...businessInfo, locations: newLocations });
    toggleOpen(false);
  };

  return (
    <div>
      {openProps.isAddNew && (
        <StyledAddButton variant="contained" onClick={() => toggleOpen(true)}>
          <StyledAddIcon />
          Add Location
        </StyledAddButton>
      )}
      {(rowData || isAddNew) &&
      isOpen &&
      rowData?.noi?.status !== NoiStatus.Submitted &&
      !isViewOnly ? (
        <Formik
          initialValues={isAddNew ? Initial : rowData}
          validationSchema={Validation}
          initialErrors={initialErrors}
          initialTouched={initialTouched}
          enableReinitialize
          onSubmit={(values: IBusinessLocationValues) => {
            isAddNew ? addLocation(values) : editLocation(values);
          }}
        >
          {({ values, ...helpers }) => (
            <Form>
              <StyledDialog
                open={openProps.isOpen}
                title={isAddNew ? 'Add Business Location' : 'Edit Business Location'}
                scroll="body"
                maxWidth="xl"
                cancelButtonText="Cancel"
                acceptButtonText="Submit"
                cancelHandler={() => openProps.toggleOpen(false)}
                acceptHandler="submit"
              >
                <BusinessLocationInputs formikValues={values} formikHelpers={helpers} />
              </StyledDialog>
            </Form>
          )}
        </Formik>
      ) : (rowData?.noi?.status === NoiStatus.Submitted && isOpen && !isAddNew) ||
        openProps.isViewOnly ? (
        <Formik
          initialValues={rowData}
          validationSchema={ValidateLocationWithNOI}
          enableReinitialize
          onSubmit={(values: IBusinessLocationValues) => editLocation(values)}
        >
          {() => (
            <Form>
              <StyledDialog
                open={openProps.isOpen}
                title={'View Business Location'}
                scroll="body"
                maxWidth="xl"
                cancelHandler={() => openProps.toggleOpen(false)}
                cancelButtonText="Cancel"
                acceptButtonText="Update"
                acceptHandler="submit"
              >
                <ViewLocation rowData={rowData} allowEdit={true} />
              </StyledDialog>
            </Form>
          )}
        </Formik>
      ) : null}
    </div>
  );
}