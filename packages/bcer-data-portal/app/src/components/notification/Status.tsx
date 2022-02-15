import { NotificationRO } from '@/constants/localInterfaces';
import {
  Box,
  Collapse,
  LinearProgress,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import {
  StyledButton,
  StyledWarning,
} from 'vaping-regulation-shared-components';
import StyledToolTip from '../generic/StyledToolTip';

const useStyles = makeStyles(() => ({
  contentBox: {
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    marginTop: '20px',
    padding: '20px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  button: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: '14px',
    '&:hover': {
      color: 'blue',
    },
  },
}));

export interface StatusProps {
  pending: NotificationRO;
}

function Status({ pending }: StatusProps) {
  const classes = useStyles();
  const [details, setDetails] = useState<boolean>(false);
  const total =
    (pending.pending?.length || 0) +
    (pending.success || 0) +
    (pending.fail || 0);
  const progress = Math.round(
    ((total - (pending.pending?.length || 0)) / (total || 1)) * 100
  );

  let timeRequired = ((pending.pending?.length || 1) * 3) / 50;
  timeRequired = timeRequired < 3 ? 3 : timeRequired;
  let [hour, minute] = moment
    .utc(moment.duration(timeRequired, 'minutes').asMilliseconds())
    .format('HH:mm')
    .split(':');

  return (
    <Box className={classes.contentBox}>
      <StyledWarning text="Notification is being sent" />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box>
          <Typography variant="body2" color="textSecondary">
            {total - (pending.pending?.length || 0)}/{total}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="textSecondary">
        estimated time required: {hour != '00' ? `${hour} hour(s)` : ''}{' '}
        {minute} minutes.
      </Typography>
      <Box mb={2} />
      <StyledButton
        variant="small-outlined"
        onClick={() => setDetails(!details)}
      >
        {details ? 'Hide' : 'Details'}
      </StyledButton>
      <Collapse in={details}>
        <Box className={classes.contentBox}>
          <Box display="flex">
            <Box>
              <CSVLink
                headers={['Phone number']}
                data={pending.sent?.map((n) => [n]) || []}
                filename={`sent_list_${pending.id}.csv`}
                target="_blank"
                className={classes.csvLink}
              >
                <StyledToolTip title="Download sent list">
                  <Typography className={classes.button}>
                    {pending?.sent?.length ?? 0} Sent{' '}
                  </Typography>
                </StyledToolTip>
              </CSVLink>
            </Box>
            <Box mx={3}>|</Box>
            <Box>
              <CSVLink
                headers={['Phone number']}
                data={pending.pending?.map((n) => [n]) || []}
                filename={`sent_list_${pending.id}.csv`}
                target="_blank"
                className={classes.csvLink}
              >
                <StyledToolTip title="Download pending list">
                  <Typography className={classes.button}>
                    {pending.pending?.length ?? 0} Pending
                  </Typography>
                </StyledToolTip>
              </CSVLink>
            </Box>
            <Box mx={3}>|</Box>
            <Box>
              <CSVLink
                headers={['Phone Number', 'Reason']}
                data={
                  pending.errorData?.map((e) => [
                    `${e.recipient}`,
                    e.message,
                  ]) ?? []
                }
                target="_blank"
                filename={`text_error_${pending.id}.csv`}
                className={classes.csvLink}
              >
                <StyledToolTip title="Download error report">
                  <Typography className={classes.button}>
                    {pending.fail > 0 ? pending.fail : '0'} Failed
                  </Typography>
                </StyledToolTip>
              </CSVLink>
            </Box>
          </Box>
          <Box my={2}>
            <Typography variant="subtitle2">Title (optional)</Typography>
            <Typography>{pending.title || 'N/A'}</Typography>
            <Box mb={2} />
            <Typography variant="subtitle2">Message</Typography>
            <Typography>{pending.message}</Typography>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default Status;
