import React from 'react';
import { makeStyles, Typography, Paper } from '@material-ui/core';

import { SuccessStepEnum } from '@/constants/localEnums';
import SuccessStep from '@/components/successStep/SuccessStep';
import FileCheckGreen from '@/assets/images/file-check-green.png';

const useStyles = makeStyles({
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    marginBottom: '30px'
  },
  successBanner: {
    display: 'flex',
    backgroundColor: '#E7F9EA',
    borderRadius: '4px',
    padding: '20px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  bannerIcon: {
    height: '45px',
    paddingRight: '20px'
  },
  bannerText: {
    fontWeight: 600,
    color: '#3A3A3A'
  },
  description: {
    color: '#565656',
    paddingBottom: '20px'
  },
  stepsSubtitle: {
    paddingBottom: '20px'
  },
})


export default function ProductReportSubmission () {
  const classes = useStyles();

  return (
    <div>
      <Paper variant='outlined' className={classes.box} >
        <div className={classes.successBanner}>
          <img src={FileCheckGreen} className={classes.bannerIcon} />
          <Typography variant='body2' className={classes.bannerText} >Your Product Report has been submited.</Typography>
        </div>
        <Typography variant='body1' className={classes.description}>
          You have successfully uploaded the product report for the locations selected. You can see your 
          submitted reports in the "Submitted reports" section of this page.
        </Typography>
        <Typography variant="subtitle1" className={classes.stepsSubtitle}>Next steps</Typography>
        <SuccessStep active={false} completed={true} step={SuccessStepEnum.noi}/>
        <SuccessStep active={false} completed={true} step={SuccessStepEnum.product}/>
        <SuccessStep active={true} completed={false} step={SuccessStepEnum.manufacturing}/>
      </Paper>
    </div>
  )
}
