import React from 'react';
import { makeStyles, Typography } from '@material-ui/core'

import clockIcon from '@/assets/images/clock.png';
import sendIcon from '@/assets/images/send.png';

const useStyles = makeStyles({
  parent: {
    padding: '1rem 2rem',
    overflowY: 'auto',
  },
  failureTextContainer: {
    background: 'rgba(255,83,74,0.1)',
    padding: '.5rem 1rem',
    height: '91px',
    display: 'flex',
    width: '90%',
    borderRadius: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  contactMethodContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '20px',
  },
  icon: {
    height: '18px',
    width: '18px',
    paddingRight: '20px',
  },
  phoneNumber: {
    color: '#0053A4',
    textDecoration: 'underline',
    fontWeight: 'bold',
    paddingLeft: '5px'
  }
})

export default function GetHelp() {
  const classes = useStyles();

  return (
    <div className={classes.parent} >
      <Typography variant="h5">Important Dates To Be Aware Of</Typography>
      <Typography variant="body1">
        For any business that sells or intends to sell E-substances on September 15, 2020, you must complete this
        form and submit Product Reports or Manufacturing Reports at least 6 weeks prior September 15, 2020.
        This document will provide you with information on submitting your Product Reports or Manufacturing Reports.<br /><br />
        By completing the following information, you will be submitting your Notice of Intent to sell e-substances in British Columbia.<br /><br />
        Upon completion of the Notice of Intent to sell restricted e-substances, you will have the option to print a copy of the Notice for your records.<br /><br />
      </Typography>
      <div className={classes.failureTextContainer}>
        Business owners that fail to submit their Notice of Intent and that fail to comply with the new reporting requirements may be subject to offences under the Public Health Act.
      </div>
      <Typography variant="h5">Technical support</Typography>
      <Typography variant="body1">
        For technical support please contact our support team:<br /><br />
        <div className={classes.contactMethodContainer}>
          <img src={sendIcon} className={classes.icon} />
          Support Email: <a href="mailto:vaping.info@gov.bc.ca">vaping.info@gov.bc.ca</a>
        </div>
      </Typography>
    </div>
  )
}