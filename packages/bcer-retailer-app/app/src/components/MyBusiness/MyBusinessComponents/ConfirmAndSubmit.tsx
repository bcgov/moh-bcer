import React, { useContext, useState, useEffect } from 'react';
import { StyledTable, StyledButton, StyledDialog, StyledConfirmDialog, ProvinceLabels} from 'vaping-regulation-shared-components';
import { Form, Formik } from 'formik';
import { makeStyles } from '@material-ui/core';

import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import { Validation } from '@/components/form/validations/vBusinessDetails';
import { BusinessDetails } from '@/constants/localInterfaces';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import BusinessDetailsEditInputs from '@/components/form/inputs/BusinessDetailsEditInputs';
import { useAxiosPatch } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { LocationUtil } from '@/utils/location.util';
import { getInitialPagination } from '@/utils/util';


const useStyles = makeStyles({
  box: {
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  boxTitle: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
  },
  boxHeader: {
    fontSize: '17px',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '15px',
  },
  boxDescription: {
    fontSize: '14px',
    color: '#3A3A3A',
    lineHeight: '20px',
    paddingBottom: '15px',
  },
  boxRow: {
    display: 'flex',
    paddingBottom: '20px',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  rowTitle: {
    fontSize: '14px',
    color: '#424242',
    width: '300px'
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#3A3A3A',
  },
  editButton: {
    fontSize: '14px',
    width: '150px',
    minWidth: '150px'
  }
})

export default function ConfirmAndSubmit () {
  const classes = useStyles();

  const [businessInfo, setBusinessInfo ] = useContext(BusinessInfoContext);
  const [appGlobal, setAppGlobalContext ] = useContext(AppGlobalContext);
  const [targetRow, setTargetRow] = useState<IBusinessLocationValues>();
  const [isEditOpen, setOpenEdit] = useState<boolean>();
  const [isDeleteOpen, setOpenDelete] = useState<boolean>();
  const [isEditDetailsOpen, setOpenEditDetails] = useState<boolean>();
  const [isAddLocationOpen, setOpenAddLocation] = useState<boolean>(false);
  const viewFullscreenTable = useState<boolean>(false);
  const [{ loading: postLoading, error: postError, data: newSubmission }, patch] = useAxiosPatch(`/submission/${businessInfo.submissionId}`, { manual: true });
  const newLocations = businessInfo.locations.filter((l: any) => !l.id);

  const { locations, details }: {
    details: any,
    locations: Array<any>,
  }  = businessInfo;

  useEffect(() => {
    if (businessInfo?.submissionId) {
      (async() => {
        await patch({ data: { data: businessInfo } });
      })()
    }
  }, [businessInfo])

  useEffect(() => {
    if (postError) {
      setAppGlobalContext({...appGlobal, networkErrorMessage: formatError(postError)});
    }
  }, [postError]);
  
  const confirmDelete = () => {
    const remainder = newLocations.filter((element: IBusinessLocationValues) =>{
      return element.tableData.id !== targetRow.tableData.id
    })
    const existingLocations = businessInfo.locations.filter((l: any) => !!l.id);
    setBusinessInfo({...businessInfo, locations: [...existingLocations, ...remainder]});
    setOpenDelete(false);
  }

  const confirmEditDetails = async(values: BusinessDetails) => {
    setBusinessInfo({...businessInfo, details: values});
    setOpenEditDetails(false);
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
      <div className={classes.box}>
        <div className={classes.boxHeader}>
          Business Detail
          <StyledButton
            variant="outlined"
            className={classes.editButton}
            onClick={() => setOpenEditDetails(true)}
          >
            Edit
          </StyledButton>
        </div>
        <div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Legal name of business
            </div>
            <div className={classes.rowContent}>
              {details.legalName}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Name under which business is conducted
            </div>
            <div className={classes.rowContent}>
              {details.businessName}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Business address line 1
            </div>
            <div className={classes.rowContent}>
              {details.addressLine1}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Business address line 2
            </div>
            <div className={classes.rowContent}>
              {details.addressLine2}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              City
            </div>
            <div className={classes.rowContent}>
              {details.city}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Postal code
            </div>
            <div className={classes.rowContent}>
              {details.postal}
            </div>
          </div>          
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Province
            </div>
            <div className={classes.rowContent}>
              {ProvinceLabels[details.province as keyof typeof ProvinceLabels]}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Business phone number
            </div>
            <div className={classes.rowContent}>
              {details.phone}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Business email
            </div>
            <div className={classes.rowContent}>
              {details.email}
            </div>
          </div>
          <div className={classes.boxRow}>
            <div className={classes.rowTitle}>
              Business web page (optional)
            </div>
            <div className={classes.rowContent}>
              {details.webpage}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.box}>
      {
        newLocations.length 
          ?
        <FullScreen fullScreenProp={viewFullscreenTable}>
          <TableWrapper
            tableHeader='New Business Locations'
            tableSubHeader={`You have ${newLocations?.length} retail entries.`}
            data={newLocations}
            csvProps={{
              headers: Object.keys(BusinessLocationHeaders),
              data: newLocations?.map((l: any) => {
                return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.doingBusinessAs, l.health_authority, l.manufacturing];
              }),
              filename: 'business_locations.csv'
            }}
            fullScreenProp={viewFullscreenTable} 
            isOutlined={false}
          >
            <div style={{ overflowX: 'auto' }}>
              <StyledTable
                columns={LocationUtil.getTableColumns()}
                options={{
                  pageSize: getInitialPagination(newLocations),
                  pageSizeOptions: [5, 10, 20, 30, 50]
                }}
                data={newLocations}
              />
            </div>
          </TableWrapper>
        </FullScreen>
        : null
      }
        </div>
      <LocationsEditForm rowData={targetRow} openProps={{ isOpen: isEditOpen, toggleOpen: setOpenEdit }} />
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
      {
        isEditDetailsOpen
          ?
            <Formik
              initialValues={businessInfo.details}
              validationSchema={Validation}
              onSubmit={(values: BusinessDetails) => confirmEditDetails(values)}
            >
              <Form>
                <StyledDialog
                  open={isEditDetailsOpen}
                  title="Edit Business Details"
                  maxWidth="xl"
                  cancelButtonText="Cancel"
                  acceptButtonText="Submit"
                  cancelHandler={() => setOpenEditDetails(false)}
                  acceptHandler="submit"
                >
                <BusinessDetailsEditInputs/>
                </StyledDialog>
              </Form>
            </Formik>
          :
            null
      }
    </>
  )
}
