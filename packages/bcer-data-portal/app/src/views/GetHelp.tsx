import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core'

import clockIcon from '@/assets/images/clock.png';
import sendIcon from '@/assets/images/send.png';

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
    <div className={classes.contentWrapper} >
      <div className={classes.content} >
        <Grid item container xs={8}>
          <Typography variant="subtitle2">
            The E-Substances Regulation requires all businesses who sell E-substances or intend to sell E-substances in British Columbia 
            to notify the Ministry of Health of their intent to sell E-substances and to provide annual sales reports for each location of your business.  
            There are date sensitive requirements related to both your Notice of Intent and Sales Reports.
          </Typography>
        </Grid>
        <Typography variant="h5">Important Dates To Be Aware Of</Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="body1">
              <span style={{fontWeight: 600}}>Notice of Intent</span> - Business owners must notify the Ministry of Health of their intent to sell restricted 
              E-substances by submitting a Notice of Intent to sell E-Substances to the Ministry of Health. The Notice of Intent to Sell E-Substances is 
              required for each separate sales premises for your business and must be completed at least six (6) weeks before any sale of vapour products 
              can occur. 
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" >
              <span style={{fontWeight: 600}}>Notice of Intent Renewal</span> - Each Notice of Intent must be renewed annually by January 15th.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <span style={{fontWeight: 600}}>Sales Report</span> - Prior to January 15 of each year, business owners must report the vapour 
              product sales that have occurred between October 1 and September 30 each year.
            </Typography>
          </Grid>
          <Grid item>
            <div className={classes.failureTextContainer}>
              Business owners that fail to submit their Notice of Intent and that fail to comply with the new reporting requirements may be subject to offences under the Public Health Act.
            </div>
          </Grid>
        </Grid>
        <Typography variant="h5">Technical support</Typography>
        <Typography variant="body1">
          For technical support please contact our support team:<br /><br />
          <div className={classes.contactMethodContainer}>
            <img src={sendIcon} className={classes.icon} />
            Support Email: <a href="mailto:vaping.info@gov.bc.ca">vaping.info@gov.bc.ca</a>
          </div>
        </Typography>
      </div>
    </div>
  )
}