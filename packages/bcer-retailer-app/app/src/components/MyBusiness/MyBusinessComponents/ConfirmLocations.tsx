import React, { useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { makeStyles } from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import { StyledButton, StyledTable, StyledConfirmDialog } from 'vaping-regulation-shared-components';

import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import { useCsvValidator } from '@/hooks/useCsvValidator';
import { BusinessCsvValidation } from '@/components/form/validations/CsvSchemas/vBusinessLocationsCsv';
import { editLocationFormatting } from '@/utils/formatting';
import { LocationUtil } from '@/utils/location.util';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  buttonIconLight: {
    paddingRight: '5px',
    color: '#fff',
    fontSize: '20px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  subHeader: {
    fontSize: '16px',
    color: '#A3A3A3',
    paddingBottom: '30px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  tableWrapper: {
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff',
    padding: '20px',
  },
  tableWrapperHeader: {
    fontSize: '17px',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '15px',
  },
  tableWrapperSubheader: {
    fontSize: '14px',
    color: '#3A3A3A',
  }
})

export default function ConfirmLocations () {
  const classes = useStyles();

  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);
  const [targetRow, setTargetRow] = useState<IBusinessLocationValues>();
  const [isEditOpen, setOpenEdit] = useState<boolean>();
  const [isDeleteOpen, setOpenDelete] = useState<boolean>();
  const {errors: uploadErrors, validatedData, validateCSV} = useCsvValidator();

  const newLocations = businessInfo.locations.filter((l: any) => !l.id);

  useEffect(() => {
    validateCSV(BusinessCsvValidation, newLocations)

  }, [businessInfo.locations])

  useEffect(() => {
    if (uploadErrors !== undefined) {
      setBusinessInfo({...businessInfo, uploadErrors: uploadErrors})
    }
  }, [uploadErrors])

  const confirmDelete = () => {
    const remainder = newLocations.filter((element: IBusinessLocationValues) =>{
      return element.tableData.id !== targetRow.tableData.id
    })
    const existingLocations = businessInfo.locations.filter((l: any) => !!l.id);
    setBusinessInfo({...businessInfo, locations: [...existingLocations, ...remainder]});
    setOpenDelete(false);
  }

  const handleDelete = (rowData: IBusinessLocationValues) => {
    setTargetRow(rowData);
    setOpenDelete(true);
  }

  const handleEdit = (rowData: IBusinessLocationValues) => {
    setTargetRow(rowData);
    setOpenEdit(true);
  }

  return (
    <>
      <div className={classes.subHeader} >
        Please confirm your business locations. Ensure that all locations have been entered correctly
        as they are required when submitting reports and your notice of intent to sell e-substances.
      </div>
      <div className={classes.tableWrapper}>
        <div className={classes.tableWrapperHeader}>
          Business Locations
        </div>
        <div className={classes.tableWrapperSubheader}>
          <div className={classes.actionsWrapper} >
            You have {newLocations?.length ? newLocations.length : '0'} retail locations.
            {
              uploadErrors 
                ?
              <CSVLink
                headers={['Row', 'Field', 'Message']}
                data={uploadErrors?.map(error => {
                  return [error.row, error.field, error.message];
                })}
                filename={'location_errors.csv'} className={classes.csvLink} target='_blank'>
                <StyledButton variant='contained' disabled={uploadErrors?.length === 0}>
                  <SaveAltIcon className={classes.buttonIconLight} />
                  Download Errors CSV
                </StyledButton>
              </CSVLink>
                :
              <CSVLink
                headers={Object.keys(BusinessLocationHeaders)}
                data={newLocations?.map((l: any) => {
                  return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                })}
                filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                <StyledButton variant='outlined'>
                  <SaveAltIcon className={classes.buttonIcon} />
                  Download CSV
                </StyledButton>
              </CSVLink>
            }
          </div>
        </div>
        {
          newLocations?.length ?
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
                {title: 'Manufacturing  Premises', field: 'manufacturing', width: 200},
                {title: '', render: LocationUtil.renderNewLocationActions({ handleEdit, handleDelete }), width: 100}
              ]}
              data={validatedData}
              editHandler={(rowData: IBusinessLocationValues) => handleEdit(rowData)}
              deleteHandler={(rowData: IBusinessLocationValues) => handleDelete(rowData)}
            />
          : null
        }
      </div>
      {
        targetRow
          &&
        <LocationsEditForm rowData={editLocationFormatting(targetRow)} 
          openProps={{isOpen: isEditOpen, toggleOpen: setOpenEdit}} 
        />
      }

      {
        isDeleteOpen
          &&
        <StyledConfirmDialog 
          open={isDeleteOpen}
          maxWidth='xs'
          dialogTitle='Delete location'
          checkboxLabel='I understand that I cannot submit a Notice of Intent for this location if I chose to delete it.' 
          dialogMessage='If you delete this location you will be unable to submit a Notice of Intent for this location.' 
          setOpen={() => setOpenDelete(false)} 
          confirmHandler={confirmDelete} 
        />
      }
    </>
  )
}
