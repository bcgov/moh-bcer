import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  InputAdornment,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { Form, Formik } from 'formik';
import { CSVLink } from 'react-csv';
import moment from 'moment';

import {
  StyledTextField,
  StyledButton,
  StyledSuccessIcon,
  StyledConfirmDialog,
  StyledDialog,
  StyledCheckbox,
  StyledCheckboxInput,
} from 'vaping-regulation-shared-components';
import SendIcon from '@/assets/images/send.png';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { Subscribers } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import { useToast } from '@/hooks/useToast';
import Status from '@/components/notification/Status';
import { NotificationRO } from '@/constants/localInterfaces';
import StyledToolTip from '@/components/generic/StyledToolTip';
import { notificationValidationSchema } from '@/constants/validate';

const useStyles = makeStyles({
  contentWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '1440px',
    width: '95%',
    padding: '20px 30px',
  },
  contentBox: {
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    marginTop: '20px',
  },
  endAdornment: {
    display: 'block',
    position: 'relative',
    bottom: '-40px',
  },
  sendIcon: {
    height: '24px',
    width: '24px',
    padding: '0px 5px 0px 5px',
  },
  contentTitle: {
    fontSize: '20px',
    color: '#0053A4',
  },
  activityContainer: {
    overflowY: 'scroll',
    height: '320px',
  },
  activityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakElement: {
    borderBottom: '1px solid #CDCED2',
  },
  dateTime: {
    color: 'rgba(51, 51, 51, 0.7)',
  },
  csvLink: {
    textDecoration: 'none',
  },
  downloadButton: {
    marginTop: '25px',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: 'white',
    fontSize: '20px',
  },
  success: {
    marginTop: '20px',
    backgroundColor: 'rgba(41,216,47,0.1)',

    display: 'flex',
    alignItems: 'center',
  },
  successText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2E8540',
    marginLeft: '15px',
  },
});

export default function SendNotification() {
  const classes = useStyles();
  const { openToast } = useToast();
  const [pending, setPending] = useState<NotificationRO>();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [open, setOpen] = useState<boolean>(false);

  const [
    {
      loading: postLoading,
      error: postError,
      data: postData,
      response: postResponse,
    },
    postMessage,
  ] = useAxiosPost('/data/notification', { manual: true });
  const [
    {
      loading: loadingActivities,
      error: activitiesError,
      response: activitiesResponse,
      data: activityLog,
    },
    getActivityLog,
  ] = useAxiosGet<NotificationRO[]>('/data/notification', { manual: true });
  const [
    {
      loading: loadingSubscribers,
      error: subscribersError,
      response: subscribersResponse,
      data: subscribers,
    },
    getSubscribers,
  ] = useAxiosGet('/data/notification/subscribers', { manual: false });

  const submitMessage = async (
    values: { title: string; message: string },
    resetForm: Function
  ) => {
    try {
      await postMessage({
        data: values,
      });
      openToast({
        successMessages: ['Message Saved successfully!'],
        type: 'success',
      });
      resetForm();
      setOpen(false);
    } catch (e) {
      openToast({
        errorMessages: ['Could not send message!'],
        type: 'error',
      });
    } finally {
      getActivityLog();
    }
  };

  useEffect(() => {
    if (activitiesError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(activitiesError),
      });
    }
  }, [activitiesError]);

  useEffect(() => {
    if (postResponse) {
      getActivityLog();
    }
  }, [postResponse]);

  useEffect(() => {
    if (activityLog?.length) {
      let temp: NotificationRO;
      for (let n of activityLog) {
        if (!n.completed && n.pending?.length) {
          temp = n;
          break;
        }
      }
      setPending(temp);
    }
  }, [activityLog]);

  useEffect(() => {
    if (subscribersError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(subscribersError),
      });
    }
  }, [subscribersError]);

  useEffect(() => {
    if (postError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(postError),
      });
    }
  }, [postError]);

  useEffect(() => {
    getActivityLog();
    const interval = setInterval(getActivityLog, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className={classes.contentWrapper}>
      <Box className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Send Notifications</Typography>
            <Typography variant="body1">
              Write and send text messages to all subscribed retailers.
            </Typography>
          </Grid>
          <Grid item xs={7}>
            {pending ? (
              <Status pending={pending} />
            ) : (
              <Box className={classes.success}>
                <StyledSuccessIcon />
                <Typography className={classes.successText}>
                  No Pending Notification
                </Typography>
              </Box>
            )}
            <Box padding={4} className={classes.contentBox}>
              <Formik
                initialValues={{ title: '', message: '', confirm: false }}
                onSubmit={(values, { resetForm }) =>
                  submitMessage(values, resetForm)
                }
                validationSchema={notificationValidationSchema}
                enableReinitialize
              >
                {({ values, handleSubmit, errors, setFieldValue }) => (
                  <Form>
                    <StyledTextField
                      label={
                        <Typography variant="subtitle2">
                          Title (optional)
                        </Typography>
                      }
                      name="title"
                      fullWidth
                    />
                    <StyledTextField
                      label={
                        <Typography variant="subtitle2">Message</Typography>
                      }
                      name="message"
                      fullWidth
                      multiline={true}
                      rows={5}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            className={classes.endAdornment}
                            position="end"
                          >
                            {values.message.length}/612
                          </InputAdornment>
                        ),
                      }}
                    />
                    <StyledToolTip
                      title={
                        pending
                          ? "Can't send new notification while an existing notification is being sent!"
                          : ''
                      }
                    >
                      <Box display="inline">
                        <StyledButton
                          onClick={() => setOpen(true)}
                          variant="contained"
                          size="medium"
                          disabled={postLoading || pending}
                        >
                          <img src={SendIcon} className={classes.sendIcon} />
                          Send Notification
                        </StyledButton>
                      </Box>
                    </StyledToolTip>
                    {open && (
                      <StyledDialog
                        open={open}
                        title="Send Notification"
                        acceptButtonText="Send"
                        acceptHandler="submit"
                        cancelHandler={() => {
                          setOpen(false);
                          setFieldValue('confirm', false);
                        }}
                        cancelButtonText="Back"
                        acceptDisabled={postLoading}
                      >
                        <Typography variant="subtitle2">
                          Title (optional)
                        </Typography>
                        <Typography>{values.title || 'N/A'}</Typography>
                        <Box mb={2} />
                        <Typography variant="subtitle2">Message</Typography>
                        <Typography>{values.message}</Typography>
                        {errors.message && (
                          <Typography color="error">
                            {errors.message}
                          </Typography>
                        )}
                        <Box mb={2} />
                        <StyledCheckboxInput
                          name="confirm"
                          label="Please confirm the content of the message"
                          showError={true}
                        />
                      </StyledDialog>
                    )}
                  </Form>
                )}
              </Formik>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box className={classes.contentBox} padding={4}>
              <Typography className={classes.contentTitle}>
                Recipient List
              </Typography>
              <Typography variant="body1">
                There are {'some number'} recipients in the list. You can
                download the recipient list by clicking the{' '}
                <span style={{ fontWeight: 600 }}>"Download"</span> button.
              </Typography>
              {subscribers?.length > 0 && (
                <CSVLink
                  headers={[
                    'Business Name',
                    'Created At',
                    'Updated At',
                    'Phone number 1',
                    'Phone number 2',
                    'Confirmed',
                  ]}
                  data={subscribers.map((s: Subscribers) => {
                    return [
                      s.business?.businessName,
                      moment(s.createdAt).format('DD MMM yyyy'),
                      moment(s.updatedAt).format('DD MMM yyyy'),
                      s.phoneNumber1,
                      s.phoneNumber2,
                      s.confirmed ? 'Yes' : 'No',
                    ];
                  })}
                  filename={'subscribers.csv'}
                  className={classes.csvLink}
                  target="_blank"
                >
                  <StyledButton
                    variant="contained"
                    className={classes.downloadButton}
                  >
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              )}
            </Box>
            <Box className={classes.contentBox} padding={4}>
              <Typography className={classes.contentTitle}>
                Activity Log
              </Typography>
              <Box className={classes.activityContainer}>
                {activityLog?.length > 0 &&
                  activityLog.map((a: NotificationRO) => (
                    <div
                      style={{
                        backgroundColor:
                          a.pending?.length && !a.completed
                            ? '#FAF3CA'
                            : 'none',
                        padding: '10px',
                      }}
                      key={a.id}
                    >
                      <div className={classes.activityRow}>
                        <Typography variant="subtitle2">
                          {a.title || a.message?.slice(0, 15) + ' ...'}
                        </Typography>
                        <Typography className={classes.dateTime}>
                          {moment(a.createdAt).format('YYYY-MM-DD')}
                        </Typography>
                      </div>
                      <div className={classes.activityRow}>
                        <Typography variant="body2" style={{ display: 'flex' }}>
                          <div style={{ color: '#2E8540' }}>
                            {a.success > 0 ? a.success : '0'} Delivered
                          </div>
                          &nbsp;|&nbsp;
                          <CSVLink
                            headers={['Phone Number', 'Reason']}
                            data={
                              a.errorData?.map((e) => [
                                `${e.recipient}`,
                                e.message,
                              ]) ?? []
                            }
                            target="_blank"
                            filename={`text_error_${a.id}.csv`}
                            className={classes.csvLink}
                          >
                            <div style={{ color: '#D8292F' }}>
                              {a.fail > 0 ? a.fail : '0'} Failed
                            </div>
                          </CSVLink>
                        </Typography>
                        <Typography className={classes.dateTime}>
                          {moment(a.createdAt).format('hh:mm')}
                        </Typography>
                      </div>
                      <div className={classes.breakElement} />
                    </div>
                  ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
