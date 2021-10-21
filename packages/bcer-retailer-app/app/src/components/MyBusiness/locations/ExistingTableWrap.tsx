import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';

import { ExistingTable } from './Tables';
import { BIContext, BusinessInfoContext } from '@/contexts/BusinessInfo';
import BaseForm from '@/components/form/Base';
import { BusinessLocation } from '@/constants/localInterfaces';
import { useAxiosPatch, useAxiosPost } from '@/hooks/axios';
import Loader from '@/components/Sales/Loader';
import { StyledConfirmDateDialog } from 'vaping-regulation-shared-components';
import FullScreen from '@/components/generic/FullScreen';

export default function ExistingTableWrap() {
  /**
   * state
   * */
  const [businessInfo, setBusinessInfo] =
    useContext<[BIContext, Function]>(BusinessInfoContext);
  const { locations } = businessInfo;
  const [locationId, setLocationId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const existingLocations = locations.filter((l) => !!l.id);

  /**
   * api request
   * */

  // close location
  const [
    { response: closeResponse, loading: closeLoading, error: closeError },
    closePatch,
  ] = useAxiosPatch(`/location/close/`, { manual: true });
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
  const handleDelete = (l: BusinessLocation) => {};

  return (
    <div>
      <FullScreen fullScreenProp={[isFullScreen, setIsFullScreen]}>
        <ExistingTable
          data={existingLocations}
          handleActionButton={() => {}}
          fullScreenProp={[isFullScreen, setIsFullScreen]}
          handleAction={{
            handleEdit,
            handleClose: handleCloseDialog,
            handleDelete,
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
      </>
    </div>
  );
}
