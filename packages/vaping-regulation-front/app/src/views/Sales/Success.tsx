import React, { useContext } from 'react'
import { StyledButton } from 'vaping-regulation-shared-components';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { SalesReportContext } from '@/contexts/SalesReport';

const useStyles = makeStyles({
  box: {
    display: 'flex',
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
})

export default function SuccessSalesReport() {
  const history = useHistory();
  const classes = useStyles();

  const [salesReport, ] = useContext(SalesReportContext);

  return (
    <>
      <Box textAlign='center' paddingTop={'60px'}>
        <Typography variant={'subtitle1'}>
          Thank you. Your Sales Report for { salesReport.address } has been submitted.
        </Typography>
      </Box>
      <Box textAlign='center'>
        <CheckCircleOutlineIcon className={classes.checkIcon} />
      </Box>
      <Box paddingY={1} textAlign='center'>
        <StyledButton
          onClick={() => history.push('/sales/select')}
          variant='contained'
        >
          Submit for Another Location
        </StyledButton>
      </Box>
      <Box paddingY={1} textAlign='center'>
        <StyledButton
          onClick={() => history.push('/sales')}
          variant='contained'
        >
          Back to Sales Overview
        </StyledButton>
      </Box>
    </>
  )
}