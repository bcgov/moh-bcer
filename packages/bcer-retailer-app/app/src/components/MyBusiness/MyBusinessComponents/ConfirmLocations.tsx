import React, { useContext, useState } from 'react';
import { CSVLink } from 'react-csv';
import { makeStyles } from '@material-ui/core';
import { StyledButton, StyledTable, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import SaveAltIcon from '@material-ui/icons/SaveAlt'

import LocationsEditForm from '@/components/form/forms/LocationsEditForm';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
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
  const [isAddLocationOpen, setOpenAddLocation] = useState<boolean>(false);

  const confirmDelete = () => {
    const remainder = businessInfo.locations.filter((element: IBusinessLocationValues) =>{
      return element.tableData.id !== targetRow.tableData.id
    })
    setBusinessInfo({...businessInfo, locations: remainder});
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
          <LocationsEditForm
            openProps={{
              isOpen: isAddLocationOpen,
              toggleOpen: setOpenAddLocation,
              isAddNew: true,
            }}
          />
        </div>
        <div className={classes.tableWrapperSubheader}>
          <div className={classes.actionsWrapper} >
            You have {businessInfo.locations?.length ? businessInfo.locations.length : '0'} retail locations.
            <CSVLink
              headers={Object.keys(BusinessLocationHeaders)}
              data={businessInfo.locations.map((l) => {
                return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
              })}
              filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
              <StyledButton variant='outlined'>
                <SaveAltIcon className={classes.buttonIcon} />
                Download CSV
              </StyledButton>
            </CSVLink>
          </div>
        </div>
        {
          businessInfo.locations.length ?
            <StyledTable
              columns={[
                {title: 'Address 1', field: 'addressLine1'},
                {title: 'Address 2', field: 'addressLine2'},
                {title: 'Postal Code', field: 'postal'},
                {title: 'City', field: 'city'},
                {title: 'Business Phone', field: 'phone'},
                {title: 'Business email', field: 'email'},
                {title: 'Health Authority', field: 'health_authority'},
                {title: 'Doing Business As', field: 'doingBusinessAs'},
                {title: 'Minors Allowed', render: (rowData: IBusinessLocationValues) => rowData.underage === 'other' && rowData.underage_other ? `${rowData.underage_other}` : `${rowData.underage}`},
                {title: 'Manufacturing  Premises', field: 'manufacturing'}
              ]}
              data={businessInfo.locations}
              isEditable={true}
              editHandler={(rowData: IBusinessLocationValues) => handleEdit(rowData)}
              deleteHandler={(rowData: IBusinessLocationValues) => handleDelete(rowData)}
            />
          : null
        }
      </div>
      <LocationsEditForm rowData={targetRow} openProps={{isOpen: isEditOpen, toggleOpen: setOpenEdit}} />
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
