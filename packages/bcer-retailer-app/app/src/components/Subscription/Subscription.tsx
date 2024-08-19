import { Box, Typography } from '@mui/material';
import React from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { StyledButton } from 'vaping-regulation-shared-components';
import SubscriptionDialog from './SubscriptionDialog';
import { useSubscription } from '@/hooks/useSubscription';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SubscriptionSkeleton from '../skeletons/SubscriptionSkeleton';
import UnSubscribeDialog from './UnSubscribeDialog';

const classes = {
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
  subscribedButtonWrapper: {
    backgroundColor: 'rgba(51,51,51,0.4)',
    display: 'inline-block',
    borderRadius: '4px',
  },
  subscribedButtonText: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
  }
};

function Subscription() {
  const {
    subscriptionData,
    subscriptionLoading,
    subscriptionPatchLoading,
    openSubscribe,
    setOpenSubscribe,
    openUnsubscribe,
    setOpenUnsubscribe,
    updateSubscription,
    getInitialFormData,
    unSubscribe,
  } = useSubscription();

  return !subscriptionLoading ? (
    <Box
      mb={2}
      sx={
        subscriptionData?.confirmed
          ? classes.containerSubscribed
          : classes.container
      }
    >
      <Box flex={0.06}>
        <NotificationsActiveIcon
          fontSize="large"
          sx={classes.notifIcon}
        />
      </Box>
      <Box flex={0.94}>
        <Typography sx={classes.title}>
          Subscribe To Our Text System Notification
        </Typography>
        <Typography sx={classes.helperText}>
          Get SMS Notification from BC E-substances Reporting. Please click on
          the subscribe button below to start receiving SMS Notification.
        </Typography>
        <Box display="flex">
          <Box sx={classes.buttonWrapper}>
            <StyledButton
              variant="outlined"
              onClick={() => setOpenSubscribe(true)}
            >
              {subscriptionData?.confirmed ? (
                <Box sx={classes.subscribedButtonText}>
                  <DoneAllIcon /> Subscribed
                </Box>
              ) : (
                <>Subscribe Now</>
              )}
            </StyledButton>
          </Box>
          <Box px={2} />
          {subscriptionData?.confirmed && (
            <StyledButton
              variant="contained"
              onClick={() => setOpenUnsubscribe(true)}
            >
              Unsubscribe
            </StyledButton>
          )}
        </Box>
      </Box>
      {openSubscribe && (
        <SubscriptionDialog
          open={openSubscribe}
          setOpen={setOpenSubscribe}
          onSubmit={updateSubscription}
          data={subscriptionData}
          getInitialFormData={getInitialFormData}
        />
      )}
      {openUnsubscribe && (
        <UnSubscribeDialog
          open={openUnsubscribe}
          setOpen={setOpenUnsubscribe}
          onSubmit={unSubscribe}
          loading={subscriptionPatchLoading}
        />
      )}
    </Box>
  ) : (
    <Box sx={classes.containerSubscribed} height={144} mb={2}>
      <SubscriptionSkeleton />
    </Box>
  );
}

export default Subscription;
