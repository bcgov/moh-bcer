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


export default function NoiSubmission () {
  const classes = useStyles();

  return (
    <div>
      <Paper variant='outlined' className={classes.box} >
        <div className={classes.successBanner}>
          <img src={FileCheckGreen} className={classes.bannerIcon} />
          <Typography variant='body2' className={classes.bannerText} >Your Notice of Intent has been submited.</Typography>
        </div>
        <Typography variant='body1' className={classes.description}>
          To continue to sell vape products you must also submit the following items: 
          Product Reports and Manufacturing Reports (if your retail locations also manufacture e-vape products)
        </Typography>
        <Typography variant="subtitle1" className={classes.stepsSubtitle}>Next steps</Typography>
        <SuccessStep active={false} completed={true} step={SuccessStepEnum.noi}/>
        <SuccessStep active={true} completed={false} step={SuccessStepEnum.product}/>
        <SuccessStep active={true} completed={false} step={SuccessStepEnum.manufacturing}/>
        <SuccessStep active={true} completed={false} step={SuccessStepEnum.sale}/>
      </Paper>
    </div>
  )
}
