import React from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles, Typography, Paper } from '@mui/material';

import { SuccessStepEnum } from '@/constants/localEnums';
import SuccessStep from '@/components/successStep/SuccessStep';
import FileCheckGreen from '@/assets/images/file-check-green.png';

const PREFIX = 'ProductReportSubmission';

const classes = {
  box: `${PREFIX}-box`,
  successBanner: `${PREFIX}-successBanner`,
  bannerIcon: `${PREFIX}-bannerIcon`,
  bannerText: `${PREFIX}-bannerText`,
  description: `${PREFIX}-description`,
  stepsSubtitle: `${PREFIX}-stepsSubtitle`
};

const Root = styled('div')({
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    marginBottom: '30px'
  },
  [`& .${classes.successBanner}`]: {
    display: 'flex',
    backgroundColor: '#E7F9EA',
    borderRadius: '4px',
    padding: '20px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  [`& .${classes.bannerIcon}`]: {
    height: '45px',
    paddingRight: '20px'
  },
  [`& .${classes.bannerText}`]: {
    fontWeight: 600,
    color: '#3A3A3A'
  },
  [`& .${classes.description}`]: {
    color: '#565656',
    paddingBottom: '20px'
  },
  [`& .${classes.stepsSubtitle}`]: {
    paddingBottom: '20px'
  },
});


export default function ProductReportSubmission () {


  return (
    <Root>
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
    </Root>
  );
}
