import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { Grid, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

import { ExistingTable } from './Tables';
import { BIContext, BusinessInfoContext } from '@/contexts/BusinessInfo';
import { BusinessLocation } from '@/constants/localInterfaces';
import { useAxiosGet, useAxiosPatch, useAxiosPost } from '@/hooks/axios';
import Loader from '@/components/Sales/Loader';
import { StyledConfirmDateDialog, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import FullScreen from '@/components/generic/FullScreen';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import { LocationUtil } from '@/utils/location.util';
import { editLocationFormatting } from '@/utils/formatting';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import MassUpdateLocation from './MassUpdateLocation';

const classes = {
  noiSubmittedBox: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #F9F1C6',
    backgroundColor: '#FAF3CA',
    color: '#785400',
    marginBottom: '20px',
  },
  warningIcon: {
    color: '#785400'
  },
  noiSubmittedBoxText: {
    fontSize: '16px', 
    fontWeight: 600
  }
};

export default function ExistingTableWrap() {
  const [businessInfo, setBusinessInfo] = useContext<[BIContext, Function]>(BusinessInfoContext);
  const { locations } = businessInfo;
  const [locationId, setLocationId] = useState<string | null>(null);
  const [targetRow, setTargetRow] = useState<BusinessLocation>(null);
  const [targetConfirmRow, setTargetConfirmRow] = useState<BusinessLocation>(null);
  const [isEditOpen, setOpenEdit] = useState<boolean>();
  const [isViewOnly, setViewOnly] = useState<boolean>();
  const [isEditConfirmOpen, setOpenEditConfirm] = useState<boolean>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [locationContext, setLocationContext] = useState<BusinessLocation>(null);
  const existingLocations = locations?.filter((l) => !!l.id);
  const addedLocations = businessInfo.locations.filter((l: any) => !l.id);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [multipleUpdateOpen, setMultipleUpdateOpen] = useState(false);
  /**
   * api request
   * */

  // close location
  const [
    { response: closeResponse, loading: closeLoading, error: closeError },
    closePatch,
  ] = useAxiosPatch(`/location/close/`, { manual: true });

  // delete location
  const [
    { response: deleteResponse, loading: deleteLoading, error: deleteError },
    locationDelete,
  ] = useAxiosPatch(`/location/delete/`, { manual: true });

  // get existing locations
  const [{ data: profile, error: profileError }, postProfile] = useAxiosPost(
    '/users/profile',
    { manual: true }
  );

  //get status
  const [{ data: status, error: statusError }, getStatus] = useAxiosGet(`/users/status`, {manual: true});

  useEffect(() => {
    if (status && !statusError) {
      setAppGlobal({
        ...appGlobal,
        ...status,
      })
    }
  }, [status]);

  const refreshData = async() => {
    await postProfile();
    getStatus();
  }

  // update locations
  const [{ loading: postLoading, error: postError, data: newSubmission }, patch] = useAxiosPatch(`/edit`, { manual: true });

  /**
   * icon button actions
   */
   const handleEdit = (l: BusinessLocation) => {
    setOpenEdit(true);
    setTargetRow(l);
    setViewOnly(false);
  };

   const handleView = (l: BusinessLocation) => {
    handleEdit(l);
    setViewOnly(true);
  };

  const handleEditConfirm = async () => {
    const newExistingLocations = existingLocations.map((element: BusinessLocation) => {
      if (element.id === targetConfirmRow.id) {
        return LocationUtil.sanitizeSubmittedLocation(targetConfirmRow)
      } else return LocationUtil.sanitizeSubmittedLocation(element);
    });
    const newLocations = [...newExistingLocations, ...addedLocations];
    const newBusinessInfo = {...businessInfo, locations: newLocations }
    if (newBusinessInfo?.submissionId) {
      await patch({ url: `/location/edit/${targetConfirmRow.id}`, data: LocationUtil.sanitizeSubmittedLocation(targetConfirmRow) });
    }
    await refreshData();
    setBusinessInfo(newBusinessInfo);
    setOpenEditConfirm(false);
    setOpenEdit(false);
    setViewOnly(false);
    setTargetRow(null);
    setTargetConfirmRow(null);
  }
  // close locations
  const handleCloseDialog = async (l: BusinessLocation) => {
    setLocationId(l.id);
  };
  const handleCloseConfirm = async ({ date }: { date: Date }) => {
    await closePatch({
      url: `/location/close/${locationId}?closedTime=${moment(date).unix()}`,
    });
    await refreshData();
    setLocationId(null);
  };
  useEffect(() => {
    if (!profileError && profile) {
      setBusinessInfo({
        ...businessInfo,
        locations: profile?.business?.locations,
      });
    }
  }, [profile, profileError]);

  const handleOpenDelete = (l: BusinessLocation) => {
    setDeleteOpen(true);
    setLocationContext(l);
  };

  const handleDelete = async() => {
    await locationDelete({
      url: `/location/delete/${locationContext?.id}`,
    })
    await refreshData();
    setDeleteOpen(false)
  };

  return (
    <div>
      <FullScreen fullScreenProp={[isFullScreen, setIsFullScreen]}>
        <ExistingTable
          data={existingLocations ? existingLocations : []}
          fullScreenProp={[isFullScreen, setIsFullScreen]}
          handleActionButton={() => setMultipleUpdateOpen(true)}
          handleAction={{
            handleEdit,
            handleView,
            handleClose: handleCloseDialog,
            handleDelete: handleOpenDelete,
          }}
        />
      </FullScreen>
      {/* loader, dialog,...etc */}
      <>
        <Loader
          open={closeLoading}
          message="Closing the location. Please wait…"
        />
        <Loader
          open={postLoading}
          message="Updating the location. Please wait…"
        />
        <StyledConfirmDateDialog
          open={!!locationId}
          confirmHandler={handleCloseConfirm}
          dialogTitle="Confirm Your Closing Location"
          setOpen={() => setLocationId(null)}
          dialogMessage="You are about to close this location. Please provide the Closing Date."
          checkboxLabel="I confirm that I wish to close this location. I understand that I will still be required to submit a Sales Report for the sales that occurred prior to closing."
          maxDate={LocationUtil.getLocationCloseWindow().max}
          minDate={LocationUtil.getLocationCloseWindow().min}
        />
        <Loader
          open={deleteLoading}
          message="Deleting the location. Please wait…"
        />
        <StyledConfirmDialog
          open={isDeleteOpen}
          confirmHandler={handleDelete}
          dialogTitle="Delete Location"
          setOpen={() => setDeleteOpen(false)}
          dialogMessage={
            <Grid container>
              {
                locationContext?.noi?.status === 'submitted'
                  &&
                <Grid item xs={12}>
                  <div style={classes.noiSubmittedBox}>
                    <WarningIcon sx={classes.warningIcon}/>
                    <Typography sx={classes.noiSubmittedBoxText} >You already have an NOI submitted for this location</Typography>
                  </div>
                </Grid>
              }
              <Grid item xs={12}>
                <Typography variant="body1">You are about to delete the following location:</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Address line 1: {locationContext?.addressLine1}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">City: {locationContext?.city}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Postal code: {locationContext?.postal}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Doing business as: {locationContext?.doingBusinessAs}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Please note that this feature should only be used for locations that were added in error. 
                  If you wish to close this location, you can use the Closing Location button instead.
                </Typography>
              </Grid>
            </Grid>
          }
          checkboxLabel="I understand that this location will be removed permanently from the database and that this action cannot be undone."
        />
        {
          targetRow
           &&
          <LocationsEditForm
            rowData={editLocationFormatting(targetRow)}
            openProps={{ isOpen: isEditOpen, toggleOpen: setOpenEdit, isAddNew: false, toggleEditConfirmOpen: setOpenEditConfirm, setConfirmTarget: setTargetConfirmRow, isViewOnly }}
          />
        }
        {
          isEditConfirmOpen && 
          <StyledConfirmDialog
            open={isEditConfirmOpen}
            maxWidth='sm'
            dialogTitle="Confirm Your Submission"
            checkboxLabel='I agree that the location information entered is correct.'
            dialogMessage='You are about to submit an update for the selected retail location.'
            setOpen={() => setOpenEditConfirm(false)}
            confirmHandler={handleEditConfirm}
            acceptButtonText={'Submit'}
          />
        }
        {
          multipleUpdateOpen && existingLocations &&
          <MassUpdateLocation
            setMultipleUpdateOpen={setMultipleUpdateOpen}
            existingLocations={existingLocations}
            refreshData={refreshData}
          />
        }
      </>
    </div>
  );
}
