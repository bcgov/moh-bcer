import React, { useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Checkbox, FormControlLabel, makeStyles, Typography } from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import { StyledButton, StyledTable, StyledConfirmDialog, StyledCheckbox } from 'vaping-regulation-shared-components';
import WarningIcon from '@material-ui/icons/Warning';

import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import { useCsvValidator } from '@/hooks/useCsvValidator';
import { BusinessCsvValidation } from '@/components/form/validations/CsvSchemas/vBusinessLocationsCsv';
import { editLocationFormatting } from '@/utils/formatting';
import { LocationUtil } from '@/utils/location.util';
import { Formik, Form } from 'formik';

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
    paddingBottom: '10px',
    alignItems: 'center',
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
    paddingBottom: '10px',
  },
  locationCount: {
    fontSize: '14px',
    color: '#3A3A3A',
    paddingBottom: '10px'
  },
  tableWrapperSubheader: {
    fontSize: '14px',
    color: '#3A3A3A',
  },
  errorCountBox: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #F9F1C6',
    backgroundColor: '#FAF3CA',
    color: '#785400',
    marginBottom: '20px',
    alignItems: 'center',
  },
  warningIcon: {
    color: '#785400',
    padding: '0px 10px 0px 0px'
  },
  errorCountBoxText: {
    fontSize: '16px', 
    fontWeight: 600
  },
  formControl:{
    fontSize: '14px',
    '& .MuiIconButton-colorSecondary':{
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      }
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',

    },
    '& .Mui-checked': {
      color: '#0053A4'
    },
  },
})

export default function ConfirmLocations () {
  const classes = useStyles();

  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);
  const [targetRow, setTargetRow] = useState<IBusinessLocationValues>();
  const [isEditOpen, setOpenEdit] = useState<boolean>();
  const [isDeleteOpen, setOpenDelete] = useState<boolean>();
  const [filterTable, setFilterTable] = useState<boolean>(false);
  const [newLocations, setNewLocations] = useState<Array<IBusinessLocationValues>>([]);
  const {errors: uploadErrors, validatedData, validateCSV} = useCsvValidator();

  useEffect(() => {
    setNewLocations(businessInfo.locations.filter((l: any) => !l.id))
  }, [businessInfo.locations])

  useEffect(() => {
    validateCSV(BusinessCsvValidation, newLocations)
  }, [newLocations])

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
        <Typography className={classes.locationCount}> You have {newLocations?.length ? newLocations.length : '0'} retail locations. </Typography>
        <div className={classes.tableWrapperSubheader}>
          {
            uploadErrors?.length > 0
              &&
            <div className={classes.errorCountBox}>
              <WarningIcon className={classes.warningIcon}/>
              <Typography className={classes.errorCountBoxText}>
                {
                  uploadErrors.length > 1 
                    ?
                      `There are ${uploadErrors.length} errors found. `
                    :
                      `There is 1 error found. `
                }
                You can download the Error Report by clicking on the "Download Error CSV" button.
              </Typography>
            </div>

          }
          <div className={classes.actionsWrapper} >
          <FormControlLabel
            className={classes.formControl}
            label='Only display locations in error'
            labelPlacement="end"
            control={
              <Checkbox
                onChange={(event) => setFilterTable(event.target.checked)}
                color='primary'
              />
            }
          />
            {
              uploadErrors?.length > 0
                ?
              <CSVLink
                headers={['Row', 'Field', 'Message']}
                data={uploadErrors?.map(error => {
                  return [error.row, error.field, error.message];
                })}
                filename={'location_errors.csv'} className={classes.csvLink} target='_blank'>
                <StyledButton variant='contained'>
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
              data={filterTable ? validatedData.filter(e => e.error === true) : validatedData}
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
