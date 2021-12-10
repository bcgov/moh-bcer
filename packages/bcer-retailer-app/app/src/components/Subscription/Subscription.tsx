import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { StyledButton } from 'vaping-regulation-shared-components';
import SubscriptionDialog from './SubscriptionDialog';
import { useSubscription } from '@/hooks/useSubscription';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px',
    backgroundColor: '#002C71',
    borderRadius: '4px',
    display: 'flex',
    color: 'white',
  },
  containerSubscribed: {
    padding: '20px',
    borderRadius: '4px',
    border: '2px solid #002C71',
    display: 'flex',
    color: '#002C71',
  },
  notifIcon: {
    color: 'inherit',
  },
  buttonWrapper: {
    backgroundColor: 'white',
    display: 'inline-block',
    borderRadius: '4px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    paddingBottom: '10px',
  },
  helperText: {
    fontSize: '18px',
    paddingBottom: '10px',
  },
  subscribedButton: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
    backgroundColor: 'rgba(51,51,51,0.4)'
  },
}));

function Subscription() {
  const classes = useStyles();
  const {
    subscriptionData,
    subscriptionPatchLoading,
    openDialog,
    setOpenDialog,
    updateSubscription,
    getInitialFormData,
  } = useSubscription();
  return (
    <Box mb={2} className={subscriptionData?.confirmed ? classes.containerSubscribed : classes.container}>
      <Box flex={0.06}>
        <NotificationsActiveIcon
          fontSize="large"
          className={classes.notifIcon}
        />
      </Box>
      <Box flex={0.94}>
        <Typography className={classes.title}>
          Subscribe To Our System Notification
        </Typography>
        <Typography className={classes.helperText}>
          Get SMS Notification from BC E-substances Reporting. Please click on
          the subscribe button below to start receiving SMS Notification.
        </Typography>
        <Box display='flex'>
          <Box className={classes.buttonWrapper}>
            <StyledButton
              variant="outlined"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              {subscriptionData?.confirmed ? (
                <Box className={classes.subscribedButton}>
                  <DoneAllIcon /> Subscribed
                </Box>
              ) : (
                <>Subscribe Now</>
              )}
            </StyledButton>
          </Box>
          <Box px={2}/>
          {subscriptionData?.confirmed && (
            <StyledButton variant="contained">Unsubscribe</StyledButton>
          )}
        </Box>
      </Box>
      {openDialog && (
        <SubscriptionDialog
          open={openDialog}
          setOpen={setOpenDialog}
          onSubmit={updateSubscription}
          data={subscriptionData}
          getInitialFormData={getInitialFormData}
        />
      )}
    </Box>
  );
}

export default Subscription;
