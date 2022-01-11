import React, { useState, useContext } from 'react';
import { Form, Formik } from 'formik';
import {
  StyledTable,
  StyledButton,
  StyledDialog,
  StyledConfirmDialog,
} from 'vaping-regulation-shared-components';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';

import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import {
  IBusinessLocationValues,
  Initial,
  Validation,
} from '@/components/form/validations/vBusinessLocation';
import BusinessLocationInputs from '@/components/form/inputs/BusinessLocationInputs';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import { LocationUtil } from '@/utils/location.util';

const useStyles = makeStyles({
  closeButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    color: 'grey',
  },
  buttonWrapper: {
    width: '100%',
    paddingTop: '25px',
    marginTop: '25px',
    borderTop: '1px solid #E1E1E6',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
});

function BusinessLocationForm({ entry }: { entry: string }) {
  const classes = useStyles();
  const [showManualEntryForm, toggleManualEntryForm] = useState(false);
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);
  const [targetRow, setTargetRow] = useState<IBusinessLocationValues>();
  const [isEditOpen, setOpenEdit] = useState<boolean>();
  const [isDeleteOpen, setOpenDelete] = useState<boolean>();

  const newLocations = businessInfo.locations.filter(l => !l.id);

  const confirmDelete = () => {
    const remainder = newLocations.filter((element: IBusinessLocationValues) =>{
      return element.tableData.id !== targetRow.tableData.id
    })
    const existingLocations = businessInfo.locations.filter((l: any) => !!l.id);
    setBusinessInfo({...businessInfo, locations: [...existingLocations, ...remainder]});
    setOpenDelete(false);
  };

  const handleDelete = (rowData: IBusinessLocationValues) => {
    setTargetRow(rowData);
    setOpenDelete(true);
  };

  const handleEdit = (rowData: IBusinessLocationValues) => {
    setTargetRow(rowData);
    setOpenEdit(true);
  };

  return (
    <>
      <div>
        {
          newLocations.length && entry === 'manual'
            ? (
                <div>
                  <StyledTable
                    options={{
                      fixedColumns: {
                        right: 1,
                      },
                    }}
                    columns={[
                      {title: 'Address 1', field: 'addressLine1', width: 150},
                      {title: 'Address 2', field: 'addressLine2', width: 150},
                      {title: 'Postal Code', field: 'postal', width: 150},
                      {title: 'City', field: 'city', width: 150},
                      {title: 'Business Phone', field: 'phone', width: 150},
                      {title: 'Business email', field: 'email', width: 150},
                      {title: 'Health Authority', field: 'health_authority', width: 150},
                      {title: 'Doing Business As', field: 'doingBusinessAs', width: 150},
                      {title: 'Minors Allowed', render: (rowData: IBusinessLocationValues) => rowData.underage === 'other' && rowData.underage_other ? `${rowData.underage_other}` : `${rowData.underage}`, width: 150},
                      {title: 'Manufacturing Premises', field: 'manufacturing', width: 200},
                      {title: '', render: LocationUtil.renderNewLocationActions({ handleEdit, handleDelete }), width: 100}
                    ]}
                    data={newLocations}
                  />
                </div>
              )
            : null
        }
        {entry === 'manual' && (
          <div className={classes.buttonWrapper}>
            <StyledButton
              variant="outlined"
              onClick={() => toggleManualEntryForm(true)}
            >
              <AddCircleOutlinedIcon className={classes.buttonIcon} />
              Add Location
            </StyledButton>
          </div>
        )}
      </div>
      {showManualEntryForm ? (
        <Formik
          initialValues={Initial}
          validationSchema={Validation}
          onSubmit={async (values: IBusinessLocationValues) => {
            setBusinessInfo({
              ...businessInfo,
              locations: [...businessInfo.locations, values],
            });
            toggleManualEntryForm(false);
          }}
        >
        {({ values, ...helpers }) => (
          <Form>
            <StyledDialog
              open={showManualEntryForm}
              title="Add Business Location"
              scroll="body"
              maxWidth="xl"
              onClose={() => toggleManualEntryForm(false)}
              cancelButtonText="Cancel"
              acceptButtonText="Submit"
              cancelHandler={() => toggleManualEntryForm(false)}
              acceptHandler="submit"
            >
              <BusinessLocationInputs formikValues={values} formikHelpers={helpers} />
            </StyledDialog>
          </Form>
        )}
        </Formik>
      ) : null}
      <LocationsEditForm
        rowData={targetRow}
        openProps={{ isOpen: isEditOpen, toggleOpen: setOpenEdit }}
      />
      {isDeleteOpen && (
        <StyledConfirmDialog
          open={isDeleteOpen}
          maxWidth="xs"
          dialogTitle="Delete location"
          checkboxLabel="I understand that I cannot submit a Notice of Intent for this location if I chose to delete it."
          dialogMessage="If you delete this location you will be unable to submit a Notice of Intent for this location."
          setOpen={() => setOpenDelete(false)}
          confirmHandler={confirmDelete}
        />
      )}
    </>
  );
}

export default BusinessLocationForm;
