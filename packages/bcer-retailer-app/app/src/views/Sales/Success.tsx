import React, { useContext } from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { SalesReportContext } from '@/contexts/SalesReport';

const useStyles = makeStyles({
  box: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  checkIcon: {
    fontSize: '128px',
    color: '#002C71',
  },
  text: {
    fontSize: '24px',
    textAlign: 'center',
  },
});

export default function SuccessSalesReport() {
  const history = useHistory();
  const classes = useStyles();

  const [salesReport] = useContext(SalesReportContext);

  return (
    <div className={classes.box}>
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
          onClick={() => history.push('/sales')}
          variant="contained"
        >
          Return to my Sales Reports
        </StyledButton>
      </Box>
    </div>
  );
}
