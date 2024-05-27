import { BusinessLocation } from '@/constants/localInterfaces';
import { styled } from '@mui/material/styles';
import { NoiPdfUtil } from '@/utils/noi.util';
import { Box, makeStyles, Typography } from '@mui/material';
import React from 'react';
import noiImage from '../../assets/images/noi.png';

const PREFIX = 'Pdf';

const classes = {
  container: `${PREFIX}-container`,
  headerWrapper: `${PREFIX}-headerWrapper`,
  header: `${PREFIX}-header`,
  headerV2: `${PREFIX}-headerV2`,
  subHeader: `${PREFIX}-subHeader`,
  bodyWrapper: `${PREFIX}-bodyWrapper`,
  bodyWrapperV2: `${PREFIX}-bodyWrapperV2`,
  infoWrapper: `${PREFIX}-infoWrapper`,
  infoWrapperV3: `${PREFIX}-infoWrapperV3`,
  infoLabel: `${PREFIX}-infoLabel`,
  infoLabelV2: `${PREFIX}-infoLabelV2`,
  infoData: `${PREFIX}-infoData`,
  infoDataV2: `${PREFIX}-infoDataV2`,
  infoDataV3: `${PREFIX}-infoDataV3`,
  bottomTextWrapper: `${PREFIX}-bottomTextWrapper`,
  bottomTextWrapperV3: `${PREFIX}-bottomTextWrapperV3`,
  bottomText: `${PREFIX}-bottomText`,
  date: `${PREFIX}-date`,
  dateLabel: `${PREFIX}-dateLabel`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`&.${classes.container}`]: {
    height: '781px',
    width: '535px',
    position: 'relative',
  },

  [`& .${classes.headerWrapper}`]: {
    position: 'absolute',
    zIndex: 100,
    top: '128px',
    left: '28px',
    width: '100%',
  },

  [`& .${classes.header}`]: {
    fontSize: '20px',
    lineHeight: '27px',
    textAlign: 'center',
    color: '#002C71',
    fontWeight: 'bold',
    marginBottom: '10px',
  },

  [`& .${classes.headerV2}`]: {
    fontSize: '20px',
    lineHeight: '27px',
    textAlign: 'center',
    color: '#002C71',
    fontWeight: 'bold',
    marginBottom: '5px',
  },

  [`& .${classes.subHeader}`]: {
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'center',
    color: '#002C71',
  },

  [`& .${classes.bodyWrapper}`]: {
    position: 'absolute',
    zIndex: 100,
    top: '212px',
    left: '110px',
    width: '375px',
    paddingTop: '15px',
  },

  [`& .${classes.bodyWrapperV2}`]: {
    position: 'absolute',
    zIndex: 100,
    top: '212px',
    left: '100px',
    width: '395px',
    paddingTop: '5px',
  },

  [`& .${classes.infoWrapper}`]: {
    display: 'flex',
    marginBottom: '20px',
  },

  [`& .${classes.infoWrapperV3}`]: {
    marginBottom: '20px',
    textAlign: 'center',
  },

  [`& .${classes.infoLabel}`]: {
    color: '#333',
    fontSize: '14px',
    lineHeight: '19px',
    flex: 0.55,
  },

  [`& .${classes.infoLabelV2}`]: {
    color: '#333',
    fontSize: '12px',
    lineHeight: '17px',
    flex: 0.45,
  },

  [`& .${classes.infoData}`]: {
    color: '#333',
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 'bold',
    flex: 0.5,
    overflowWrap: 'anywhere',
  },

  [`& .${classes.infoDataV2}`]: {
    color: '#333',
    fontSize: '12px',
    lineHeight: '17px',
    fontWeight: 'bold',
    flex: 0.5,
    overflowWrap: 'anywhere',
  },

  [`& .${classes.infoDataV3}`]: {
    color: '#333',
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: 'bold',
    flex: 0.5,
    overflowWrap: 'anywhere',
  },

  [`& .${classes.bottomTextWrapper}`]: {
    marginBottom: '24px',
  },

  [`& .${classes.bottomTextWrapperV3}`]: {
    margin: '20px 0 30px',
  },

  [`& .${classes.bottomText}`]: {
    fontSize: '16px',
    lineHeight: '22px',
    textAlign: 'center',
    color: '#002C71',
  },

  [`& .${classes.date}`]: {
    fontSize: '12px',
    lineHeight: '19px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    padding: '0 7px 7px',
    marginBottom: '5px',
    color: '#333',
  },

  [`& .${classes.dateLabel}`]: {
    fontSize: '12px',
    LineHeight: '17px',
    textAlign: 'center',
    color: '#333',
  }
}));

type PdfProps = {
  location: BusinessLocation;
  legalName: string;
};

function Pdf({ location, legalName }: PdfProps) {

  const { responsiveClass } = new NoiPdfUtil(
    location,
    legalName,
    classes
  ).build();
  const formattedData = NoiPdfUtil.formatNoiData(location, legalName);
  return (
    <StyledBox className={classes.container}>
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
            Type of Location:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.formattedLocationType}
          </Typography>
        </Box>
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
        {formattedData.locationType === 'online' ?
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            URL:
          </Typography>
          <Typography className={responsiveClass.infoData}>
            {formattedData.webpage}            
          </Typography>
        </Box>:
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
        </Box>}
        <Box className={responsiveClass.infoWrapper}>
          <Typography className={responsiveClass.infoLabel}>
            Location permits all ages:
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
            This e-substance retailer has submitted their Notice of Intent and is eligible to sell 
            e-substances as of {formattedData.effectiveOperationDate}.
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
    </StyledBox>
  );
}

export default Pdf;
