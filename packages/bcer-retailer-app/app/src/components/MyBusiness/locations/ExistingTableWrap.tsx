import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import WarningIcon from '@material-ui/icons/Warning';

import { ExistingTable } from './Tables';
import { BIContext, BusinessInfoContext } from '@/contexts/BusinessInfo';
import BaseForm from '@/components/form/Base';
import { BusinessLocation } from '@/constants/localInterfaces';
import { useAxiosPatch, useAxiosPost } from '@/hooks/axios';
import Loader from '@/components/Sales/Loader';
import { StyledConfirmDateDialog, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import FullScreen from '@/components/generic/FullScreen';

const useStyles = makeStyles({
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
})

export default function ExistingTableWrap() {
  const classes = useStyles();
  const [businessInfo, setBusinessInfo] =
    useContext<[BIContext, Function]>(BusinessInfoContext);
  const { locations } = businessInfo;
  const [locationId, setLocationId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [locationContext, setLocationContext] = useState<BusinessLocation>(null);
  const existingLocations = locations.filter((l) => !!l.id);

  /**
   * api request
   * */

  // close location
  const [
    { response: closeResponse, loading: closeLoading, error: closeError },
    closePatch,
  ] = useAxiosPatch(`/location/close/`, { manual: true });
  // delete location
  /**
   * STUBBED: uncomment once delete endpoint is available
   */
  // const [
  //   { response: deleteResponse, loading: deleteLoading, error: deleteError },
  //   locationDelete,
  // ] = useAxiosPatch(`/location/delete/`, { manual: true });
  // get existing locations
  const [{ data: profile, error: profileError }, postProfile] = useAxiosPost(
    '/users/profile',
    { manual: true }
  );

  /**
   * icon button actions
   */
  // TODO at Edit Ticket
  const handleEdit = (l: BusinessLocation) => {};
  // close locations
  const handleCloseDialog = async (l: BusinessLocation) => {
    setLocationId(l.id);
  };
  const handleCloseConfirm = async ({ date }: { date: Date }) => {
    await closePatch({
      url: `/location/close/${locationId}?closedTime=${moment(date).unix()}`,
    });
    await postProfile();
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

  // TODO Deleted Location by David
  const handleOpenDelete = (l: BusinessLocation) => {
    setDeleteOpen(true);
    setLocationContext(l);
  };

  const handleDelete = async() => {
    /**
     * STUBBED: uncomment once delete endpoint is available and delete console log
     */
    // await locationDelete({
    //   url: `/location/delete/${locationContext?.id}`,
    // })
    // await postProfile()
    setDeleteOpen(false)
    console.log(locationContext)
  };

  return (
    <div>
      <FullScreen fullScreenProp={[isFullScreen, setIsFullScreen]}>
        <ExistingTable
          data={existingLocations}
          fullScreenProp={[isFullScreen, setIsFullScreen]}
          handleActionButton={() => {}}
          handleAction={{
            handleEdit,
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
        <StyledConfirmDateDialog
          open={!!locationId}
          confirmHandler={handleCloseConfirm}
          dialogTitle="Confirm Your Closing Location"
          setOpen={() => setLocationId(null)}
          dialogMessage="You are going to close this location. Please provide the following information below."
          checkboxLabel="I confirm that I wish to close this location. I understand that I will still be required to submit a Sales Report for this location for sales that occurred prior to closing."
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
                  
                  <div className={classes.noiSubmittedBox}>
                    <WarningIcon className={classes.warningIcon}/>
                    <Typography className={classes.noiSubmittedBoxText} >You already have an NOI submitted for this location</Typography>
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
                <Typography variant="subtitle1">Address line 2: {locationContext?.addressLine2}</Typography>
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
                  This feature should not be used for closing locations.
                  If you have closed a location, you must wait until you renew your Notice of Intent to identify the location as "closed" in the BCER.
                </Typography>
              </Grid>
            </Grid>
          }
          checkboxLabel="I understand that this location will be removed permanently from the database and that this action cannot be undone."
        />
      </>
    </div>
  );
}
