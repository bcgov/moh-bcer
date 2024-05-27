import React, { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { StyledButton } from 'vaping-regulation-shared-components';
import { Box, makeStyles, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { SalesReportContext } from '@/contexts/SalesReport';

const PREFIX = 'Success';

const classes = {
  box: `${PREFIX}-box`,
  checkIcon: `${PREFIX}-checkIcon`,
  text: `${PREFIX}-text`
};

const Root = styled('div')({
  [`&.${classes.box}`]: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  [`& .${classes.checkIcon}`]: {
    fontSize: '128px',
    color: '#002C71',
  },
  [`& .${classes.text}`]: {
    fontSize: '24px',
    textAlign: 'center',
  },
});

export default function SuccessSalesReport() {
  const navigate = useNavigate();


  const [salesReport] = useContext(SalesReportContext);

  return (
    <Root className={classes.box}>
      <Box textAlign="center">
        <CheckCircleOutlineIcon className={classes.checkIcon} />
      </Box>
      <Box textAlign="center" paddingTop={1}>
        <Typography className={classes.text}>Thank you!</Typography>
        <Typography className={classes.text}>
          Your Sales Report for <strong>{salesReport.address}</strong> has been
          submitted.
        </Typography>
      </Box>
      <Box paddingTop={2} textAlign="center">
        <StyledButton
          onClick={() => navigate('/sales')}
          variant="contained"
        >
          Return to my Sales Reports
        </StyledButton>
      </Box>
    </Root>
  );
}
