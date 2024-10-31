import React, { useState } from 'react';
import { Box, Collapse, LinearProgress, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { StyledButton, StyledWarning } from 'vaping-regulation-shared-components';
import StyledToolTip from '../generic/StyledToolTip';
import { NotificationRO } from '@/constants/localInterfaces';

const ContentBox = styled(Box)({
  border: '1px solid #CDCED2',
  borderRadius: '4px',
  marginTop: '20px',
  padding: '20px',
});

const CsvLink = styled(CSVLink)({
  textDecoration: 'none',
});

const Button = styled(Typography)({
  fontWeight: 'bold',
  color: '#444',
  fontSize: '14px',
  '&:hover': {
    color: 'blue',
  },
});

export interface StatusProps {
  pending: NotificationRO;
}

function Status({ pending }: StatusProps) {
  const [details, setDetails] = useState<boolean>(false);
  const total = (pending.pending?.length || 0) + (pending.success || 0) + (pending.fail || 0);
  const progress = Math.round(((total - (pending.pending?.length || 0)) / (total || 1)) * 100);

  let timeRequired = ((pending.pending?.length || 1) * 3) / 50;
  timeRequired = timeRequired < 3 ? 3 : timeRequired;
  let [hour, minute] = moment
    .utc(moment.duration(timeRequired, 'minutes').asMilliseconds())
    .format('HH:mm')
    .split(':');

  return (
    <ContentBox>
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
        estimated time required: {hour !== '00' ? `${hour} hour(s)` : ''} {minute} minutes.
      </Typography>
      <Box mb={2} />
      <StyledButton variant="small-outlined" onClick={() => setDetails(!details)}>
        {details ? 'Hide' : 'Details'}
      </StyledButton>
      <Collapse in={details}>
        <ContentBox>
          <Box display="flex">
            <Box>
              <CsvLink
                headers={['Phone number']}
                data={pending.sent?.map((n) => [n]) || []}
                filename={`sent_list_${pending.id}.csv`}
                target="_blank"
              >
                <StyledToolTip title="Download sent list">
                  <Button>{pending?.sent?.length ?? 0} Sent </Button>
                </StyledToolTip>
              </CsvLink>
            </Box>
            <Box mx={3}>|</Box>
            <Box>
              <CsvLink
                headers={['Phone number']}
                data={pending.pending?.map((n) => [n]) || []}
                filename={`sent_list_${pending.id}.csv`}
                target="_blank"
              >
                <StyledToolTip title="Download pending list">
                  <Button>{pending.pending?.length ?? 0} Pending</Button>
                </StyledToolTip>
              </CsvLink>
            </Box>
            <Box mx={3}>|</Box>
            <Box>
              <CsvLink
                headers={['Phone Number', 'Reason']}
                data={pending.errorData?.map((e) => [`${e.recipient}`, e.message]) ?? []}
                target="_blank"
                filename={`text_error_${pending.id}.csv`}
              >
                <StyledToolTip title="Download error report">
                  <Button>{pending.fail > 0 ? pending.fail : '0'} Failed</Button>
                </StyledToolTip>
              </CsvLink>
            </Box>
          </Box>
          <Box my={2}>
            <Typography variant="subtitle2">Title (optional)</Typography>
            <Typography>{pending.title || 'N/A'}</Typography>
            <Box mb={2} />
            <Typography variant="subtitle2">Message</Typography>
            <Typography>{pending.message}</Typography>
          </Box>
        </ContentBox>
      </Collapse>
    </ContentBox>
  );
}

export default Status;