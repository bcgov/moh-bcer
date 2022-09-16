import { BusinessLocation } from '@/constants/localInterfaces';
import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ClearIcon from '@material-ui/icons/Clear';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import StyledToolTip from '@/components/generic/StyledToolTip';
import { CSSProperties } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: '#E1E1E6',
    alignItems: 'center',
  },
  warnTextContainer: {
    backgroundColor: 'rgba(255, 200, 0, 0.2)',
    alignItems: 'center',
  },
  errorTextContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    alignItems: 'center',
  },
  businessContainer: {
    borderRight:"1px solid #333",
  },
  locationText: {
    color: '#333',
    fontSize: '1rem',
  },
  businessText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  toolTip: {
    fontSize: '14px',
  },
  iconHover: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export interface LocationViewProps {
  content: BusinessLocation;
  showOnMapHandler: (l: BusinessLocation) => void;
  removeLocationHandler: (l: BusinessLocation) => void;
}


function LocationView({
  content,
  showOnMapHandler,
  removeLocationHandler,
}: LocationViewProps) {
  const classes = useStyles();
  const address = content?.geoAddress || `${content.addressLine1}, ${
    content.addressLine2 ? `${content.addressLine2},` : ''
  } ${content.city}, ${content.postal}`;

  const formattedAddress =
    address.length > 28 ? `${address.slice(0, 24)} ...` : address;

  const businessName = `${
    content.business?.businessName ?? content.business?.legalName
  }`;
  const formattedBusinessName =
    businessName.length > 10 ? `${businessName.slice(0, 7)} ...` : businessName;

  const { latitude, longitude, geoAddressConfidence } = content;
  let showStyle = classes.textContainer;
  if(geoAddressConfidence === 'RANGE_INTERPOLATED' || geoAddressConfidence === 'APPROXIMATE'){
    showStyle = classes.warnTextContainer;
  }

  if(!latitude || !longitude) {
    showStyle = classes.errorTextContainer;
  }

  return (
    <Box className={classes.container}>
      <Box display="flex" flex={80} p={1} className={showStyle}>
        <Box flex={0.3}  className={classes.businessContainer} pl={1}>
          <StyledToolTip title={businessName}>
            <Typography className={classes.businessText}>
              {formattedBusinessName}
            </Typography>
          </StyledToolTip>
        </Box>
        <Box flex={0.7} pl={1}>
          <StyledToolTip title={address}>
            <Typography className={classes.locationText}>
              {formattedAddress}
            </Typography>
          </StyledToolTip>
        </Box>
      </Box>
      <Box flex={0.2} px={1}>
        <Box display="flex" justifyContent="space-between">
          <StyledToolTip title="Show in map">
            <MyLocationIcon
              className={classes.iconHover}
              onClick={() => showOnMapHandler(content)}
            />
          </StyledToolTip>
          <StyledToolTip
            title="Remove location"
            onClick={() => removeLocationHandler(content)}
          >
            <ClearIcon className={classes.iconHover} htmlColor="red" />
          </StyledToolTip>
          <StyledToolTip title="Drag to rearrange">
            <HorizontalSplitIcon className={classes.iconHover} />
          </StyledToolTip>
        </Box>
      </Box>
    </Box>
  );
}

export default LocationView;
