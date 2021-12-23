import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, InputAdornment, makeStyles, Typography } from '@material-ui/core'
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { Form, Formik } from 'formik';
import { CSVLink } from 'react-csv';
import moment from 'moment';

import { StyledTextField, StyledButton } from 'vaping-regulation-shared-components'
import SendIcon from '@/assets/images/send.png';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { Notifications, Subscribers } from '@/constants/localEnums';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';

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
    marginTop: '20px'
  },
  endAdornment: {
    display: 'block',
    position: 'relative',
    bottom: '-40px'
  },
  sendIcon: {
    height: '24px',
    width: '24px',
    padding: '0px 5px 0px 5px',
  },
  contentTitle: {
    fontSize: '20px',
    color: '#0053A4'
  },
  activityContainer: {
    overflowY: 'scroll',
    height: '320px'
  },
  activityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakElement: {
    borderBottom: '1px solid #CDCED2'
  },
  dateTime: {
    color: 'rgba(51, 51, 51, 0.7)'
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
  }

})

export default function SendNotification() {
  const classes = useStyles();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [activities, setActivities] = useState();

  const [{ loading: postLoading, error: postError, data: postData, response: postResponse }, postMessage] = useAxiosPost('/data/notification', { manual: true });
  const [{ loading: loadingActivities, error: activitiesError, response: activitiesResponse, data: activityLog }, getActivityLog] = useAxiosGet('/data/notification', { manual: false });
  const [{ loading: loadingSubscribers, error: subscribersError, response: subscribersResponse, data: subscribers }, getSubscribers] = useAxiosGet('/data/notification/subscribers', { manual: false });

  const submitMessage = async(values: {title: string, message: string}) => {
    await postMessage({
      data: values
    })
  }

  useEffect(() => {
    if (activitiesError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(activitiesError),

      })
    }
  }, [activitiesError])

  useEffect(() => {
    if (postResponse) {
      getActivityLog()
    }
  }, [postResponse])

  useEffect(() => {
    if (subscribersError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(subscribersError),

      })
    }
  }, [subscribersError])

  useEffect(() => {
    if (postError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(postError),

      })
    }
  }, [postError])

  return (
    <Box className={classes.contentWrapper}>
      <Box className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Typography variant="h5">Send Notifications</Typography>
            <Typography variant="body1">
            Write and send text messages to all subscribed retailers.
            </Typography>
          </Grid>
          <Grid item xs={7} >
            <Box padding={4} className={classes.contentBox}>
              <Formik
                initialValues={{title: '', message: ''}}
                onSubmit={(values) => submitMessage(values)}
              >
                {({values, handleSubmit}) => (
                <Form>
                  <StyledTextField
                    label={<Typography  variant="subtitle2">Title (optional)</Typography>}
                    name="title"
                    fullWidth
                  />
                  <StyledTextField
                    label={<Typography  variant="subtitle2">Message</Typography>}
                    name="message"
                    fullWidth
                    multiline={true}
                    rows={5}
                    InputProps={{ endAdornment: <InputAdornment className={classes.endAdornment} position="end">{values.message.length}/612</InputAdornment>
                    }}
                  />
                  <StyledButton onClick={handleSubmit} variant="contained" size="medium">
                  <img src={SendIcon} className={classes.sendIcon} />
                    Send Notification
                  </StyledButton>
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
                There are {'some number'} recipients in the list. You can download the recipient list by clicking the <span style={{fontWeight: 600}}>"Download"</span> button.
              </Typography>
              {
                subscribers?.length > 0
                  &&
                <CSVLink
                    headers={Object.keys(subscribers)}
                    data={subscribers.map((s: Subscribers) => {
                      return [s.id, s.createdAt, s.updatedAt, s.phoneNumber1, s.phoneNumber2, s.confirmed];
                    })}
                    filename={'subscribers.csv'} className={classes.csvLink} target='_blank'
                >
                  <StyledButton variant="contained" className={classes.downloadButton}>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              }
            </Box>
            <Box className={classes.contentBox} padding={4}>
              <Typography className={classes.contentTitle}>
                Activity Log
              </Typography>
              <Box className={classes.activityContainer}> 
                    {
                      activityLog?.length > 0
                        &&
                      activityLog.reverse().map((a: Notifications) => (
                        <div> 
                          <div className={classes.activityRow}> 
                            <Typography variant="subtitle2">{a.title}</Typography>
                            <Typography className={classes.dateTime}>{moment(a.createdAt).format('YYYY-MM-DD')}</Typography>
                          </div>
                          <div className={classes.activityRow}>
                            <Typography variant="body2" style={{display: 'flex'}}>
                              <div style={{color: '#2E8540'}}>
                                {a.success > 0 ? a.success : '0'} Delivered
                              </div>
                                &nbsp;|&nbsp;
                              <div style={{color: '#D8292F'}}>
                                {a.fail > 0 ? a.fail : '0'} Failed
                              </div>
                            </Typography>
                            <Typography className={classes.dateTime}>{moment(a.createdAt).format('hh:mm')}</Typography>
                          </div>
                          <div className={classes.breakElement}/>
                        </div>
                      ))
                    }
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}