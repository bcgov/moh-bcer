import { BusinessLocation } from '@/constants/localInterfaces';
import { NoiPdfUtil } from '@/utils/noi.util';
import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import noiImage from '../../assets/images/noi.png';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '781px',
    width: '535px',
    position: 'relative',
  },
  headerWrapper: {
    position: 'absolute',
    zIndex: 100,
    top: '128px',
    left: '28px',
    width: '100%',
  },
  header: {
    fontSize: '20px',
    lineHeight: '27px',
    textAlign: 'center',
    color: '#002C71',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  headerV2: {
    fontSize: '20px',
    lineHeight: '27px',
    textAlign: 'center',
    color: '#002C71',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  subHeader: {
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'center',
    color: '#002C71',
  },
  bodyWrapper: {
    position: 'absolute',
    zIndex: 100,
    top: '212px',
    left: '110px',
    width: '375px',
    paddingTop: '15px',
  },
  bodyWrapperV2: {
    position: 'absolute',
    zIndex: 100,
    top: '212px',
    left: '100px',
    width: '395px',
    paddingTop: '5px',
  },
  infoWrapper: {
    display: 'flex',
    marginBottom: '20px',
  },
  infoWrapperV3: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  infoLabel: {
    color: '#333',
    fontSize: '14px',
    lineHeight: '19px',
    flex: 0.55,
  },
  infoLabelV2: {
    color: '#333',
    fontSize: '12px',
    lineHeight: '17px',
    flex: 0.45,
  },
  infoData: {
    color: '#333',
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 'bold',
    flex: 0.5,
    overflowWrap: 'anywhere',
  },
  infoDataV2: {
    color: '#333',
    fontSize: '12px',
    lineHeight: '17px',
    fontWeight: 'bold',
    flex: 0.5,
    overflowWrap: 'anywhere',
  },
  infoDataV3: {
    color: '#333',
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: 'bold',
    flex: 0.5,
    overflowWrap: 'anywhere',
  },
  bottomTextWrapper: {
    marginBottom: '24px',
  },
  bottomTextWrapperV3: {
    margin: '20px 0 30px',
  },
  bottomText: {
    fontSize: '16px',
    lineHeight: '22px',
    textAlign: 'center',
    color: '#002C71',
  },
  date: {
    fontSize: '12px',
    lineHeight: '19px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    padding: '0 7px 7px',
    marginBottom: '5px',
    color: '#333',
  },
  dateLabel: {
    fontSize: '12px',
    LineHeight: '17px',
    textAlign: 'center',
    color: '#333',
  },
}));

type PdfProps = {
  location: BusinessLocation;
  legalName: string;
};

function Pdf({ location, legalName }: PdfProps) {
  const classes = useStyles();
  const { responsiveClass } = new NoiPdfUtil(
    location,
    legalName,
    classes
  ).build();
  const formattedData = NoiPdfUtil.formatNoiData(location, legalName);
  return (
    <Box className={classes.container}>
      <img src={noiImage} style={{ height: '841px', width: '595px' }} />
      <Box className={classes.headerWrapper}>
        <Typography className={responsiveClass.header}>
          B.C. E-Substances Regulation
        </Typography>
        <Typography className={classes.subHeader}>
          Notice of Intent to Sell E-Substances
        </Typography>
        <Typography className={classes.subHeader}>
          Confirmation of Submission
        </Typography>
      </Box>
      <Box className={responsiveClass.bodyWrapper}>
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            Business Name:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.businessName}
          </Typography>
        </Box>
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            Business Legal Name:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.legalName}
          </Typography>
        </Box>
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            Location:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.address}
            <span style={{ display: 'inline-block' }}>
              {formattedData.postal}
            </span>
          </Typography>
        </Box>
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            Location Age Restricted:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.ageRestricted}
          </Typography>
        </Box>
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            Manufacture e-substances:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.manufacturing}
          </Typography>
        </Box>
        <Box className={responsiveClass.bottomTextWrapper}>
          <Typography className={classes.bottomText}>
            This e-substance retailer has submitted their Notice of Intent and
            is eligible to sell e-substances 6 weeks after the submission date.
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography className={classes.date}>
              {formattedData.submissionDate}
            </Typography>
            <Typography className={classes.dateLabel}>
              Date Submitted
            </Typography>
          </Box>
          {!!formattedData.renewalDate && (
            <Box>
              <Typography className={classes.date}>
                {formattedData.renewalDate}
              </Typography>
              <Typography className={classes.dateLabel}>
                Date Renewed
              </Typography>
            </Box>
          )}
          <Box>
            <Typography className={classes.date}>
              {formattedData.expiryDate}
            </Typography>
            <Typography className={classes.dateLabel}>
              Date of Expiry
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Pdf;
