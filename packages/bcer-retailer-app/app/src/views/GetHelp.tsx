import React from 'react';
import { makeStyles, Typography } from '@material-ui/core'

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import timeline from '@/assets/images/timeline.png';

const useStyles = makeStyles({
  parent: {
    padding: '1rem 2rem',
    overflowY: 'auto',
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#E0E8F0',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  boldedText: {
    fontWeight: 600
  }
})

export default function GetHelp() {
  const classes = useStyles();

  return (
    <div className={classes.parent} >
      <div className={classes.helpTextWrapper}>
        <ChatBubbleOutlineIcon className={classes.helperIcon} />
        <div>
          The <span className={classes.boldedText} style={{ color: "#0053A4" }} >E-Substances Regulation</span> requires all 
          businesses that sell E-substances or intend to sell E-substances 
          in British Columbia to notify the Ministry of Health of their intent to sell E-substances and to provide annual sales 
          reports for each location of your business. There are date sensitive requirements related to both your Notice of Intent 
          and Sales Reports
        </div>
      </div>
      <Typography variant="h6">If you experience any problems with the system, please send a request to <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Vaping.info@gov.bc.ca" target="_blank" >Vaping.info@gov.bc.ca</a> </Typography>
      <Typography variant="h5">Important Reporting Requirements</Typography>
      <ul>
        <li>
          <Typography variant='body1'>
            <span className={classes.boldedText}>Notice of Intent</span>
            &nbsp;- Business owners must notify the Ministry of Health of their intent to sell restricted E-substances by submitting a 
            Notice of Intent to sell E-Substances to the Ministry of Health. The Notice of Intent to Sell E-Substances is required 
            for each separate sales premises for your business and must be completed 
            <span className={classes.boldedText} style={{ color: "#0053A4" }} >
              &nbsp;at least six (6) weeks before any sale of vapour products can occur.
            </span>
          </Typography>
        </li>
        <li>
          <Typography variant='body1'>
            <span className={classes.boldedText}>Notice of Intent Renewal</span>
            &nbsp;- Each Notice of Intent must be renewed annually between
            <span className={classes.boldedText} style={{ color: "#0053A4" }} >
            &nbsp;October 1st and January 15th.
            </span>
          </Typography>
        </li>
        <li>
          <Typography variant='body1'>
            <span className={classes.boldedText}>Product Report</span>
            &nbsp;- As a business owner who sells or intends to sell E-substances in British Columbia, 
            you are required to provide product information reports for each restricted E-substance you intend to sell. 
            Product reports must be submitted at least 
            <span className={classes.boldedText} style={{ color: "#0053A4" }} >
              &nbsp;6 weeks&nbsp;
            </span>
            prior to selling a restricted E-substance at retail.
          </Typography>
        </li>
        <li>
          <Typography variant='body1'>
            <span className={classes.boldedText}>Manufacturing Report</span>
            &nbsp;- As a business owner, if a retailer formulates, packages, re-packages or prepares restricted E-substances 
            for sale at your sales premises, you are required to provide information about those E-substances. 
            Manufacturing reports must be submitted at least 
            <span className={classes.boldedText} style={{ color: "#0053A4" }} >
              &nbsp;6 weeks&nbsp; 
            </span>
            prior to selling the restricted E-substance at the retail location.
          </Typography>
        </li>
        <li>
          <Typography variant='body1'>
            <span className={classes.boldedText}>Sales Report</span>
            &nbsp;- Prior to 
            <span className={classes.boldedText} style={{ color: "#0053A4" }} >
              &nbsp;January 15 of each year
            </span>
            , business owners must report the vapour product sales that have occurred between 
            <span className={classes.boldedText} style={{ color: "#0053A4" }} >
              &nbsp;October 1 and September 30 the previous year.
            </span>
          </Typography>
        </li>
      </ul>
      <img src={timeline} />
    </div>
  )
}