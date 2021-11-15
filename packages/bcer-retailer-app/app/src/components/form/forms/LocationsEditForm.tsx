import React, { useContext, Dispatch, SetStateAction, useState } from 'react';
import { Form, Formik } from 'formik';
import { StyledDialog, StyledButton } from 'vaping-regulation-shared-components';
import { makeStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { IBusinessLocationValues, Validation } from '@/components/form/validations/vBusinessLocation';
import { Initial } from '@/components/form/validations/vBusinessLocation';
import BusinessLocationInputs from '@/components/form/inputs/BusinessLocationInputs';

const useStyles = makeStyles({
  addIcon: {
    fontSize: '16px',
    paddingRight: '8px',
    alignSelf: 'center'
  },
  addButton: {
    minWidth: '160px',
  }
})

export default function LocationsEditForm(
  {rowData, openProps} : {
    rowData?: IBusinessLocationValues, 
    openProps: {
      isOpen:boolean, 
      toggleOpen: Dispatch<SetStateAction<boolean>>, 
      isAddNew?: boolean
      toggleEditConfirmOpen?: Dispatch<SetStateAction<boolean>>
      setConfirmTarget?: Dispatch<SetStateAction<any>>
    }
  }
) {
  const classes = useStyles();
  const { isOpen, toggleOpen, isAddNew } = openProps;
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);

  const addLocation = (values: IBusinessLocationValues) => {
    setBusinessInfo({...businessInfo, locations: [...businessInfo.locations, values]})
    toggleOpen(false)
  }

  const editLocation = (values: IBusinessLocationValues) => {
    let newLocations: any[] = [];
    const existingLocations = businessInfo.locations.filter((l: any) => !!l.id);
    const addedLocations = businessInfo.locations.filter((l: any) => !l.id);
    if (values?.id) { // edit existing locations, open the confirm dialog
      openProps?.setConfirmTarget(values);
      openProps?.toggleEditConfirmOpen(true);
      return;
    } else { // edit new add location
      const newAddedLocations = addedLocations.map((element: IBusinessLocationValues, index: number) => {
        if (element.tableData.id === rowData.tableData.id) {
          return values;
        } else return element;
      });
      newLocations = [...existingLocations, ...newAddedLocations];
    }
    setBusinessInfo({...businessInfo, locations: newLocations})
    toggleOpen(false)
  }

  return (
    <div>
      {
        openProps.isAddNew
        ?
          <StyledButton 
            className={classes.addButton} 
            variant="contained" 
            onClick={() => toggleOpen(true)} 
          >
            <AddCircleIcon className={classes.addIcon}/>
            Add Location
          </StyledButton>
        :
          null
      }
      {
        (rowData || isAddNew) && isOpen
        ? 
          <Formik
            initialValues={isAddNew ? Initial : rowData}
            enableReinitialize={true}
            validationSchema={Validation}
            onSubmit={(values: IBusinessLocationValues) => {
              isAddNew
                ?
                  addLocation(values)
                :
                  editLocation(values)
            }}
          >
            <Form>
              <StyledDialog
                open={openProps.isOpen}
                title={isAddNew ? 'Add Business Location' : 'Edit Business Location'}
                scroll='body'
                maxWidth="xl"
                cancelButtonText="Cancel"
                acceptButtonText="Submit"
                cancelHandler={()=>openProps.toggleOpen(false)}
                acceptHandler="submit"
              >
                <BusinessLocationInputs />
              </StyledDialog>
            </Form>
          </Formik>
        : null
      }
    </div>
  )
}