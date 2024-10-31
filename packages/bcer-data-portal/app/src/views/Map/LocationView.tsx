import React from 'react';
import { BusinessLocation } from '@/constants/localInterfaces';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ClearIcon from '@mui/icons-material/Clear';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import StyledToolTip from '@/components/generic/StyledToolTip';

const PREFIX = 'LocationView';

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${PREFIX}-container`]: {
    display: 'flex',
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  [`& .${PREFIX}-textContainer`]: {
    backgroundColor: '#E1E1E6',
    alignItems: 'center',
  },
  [`& .${PREFIX}-warnTextContainer`]: {
    backgroundColor: 'rgba(255, 200, 0, 0.2)',
    alignItems: 'center',
  },
  [`& .${PREFIX}-errorTextContainer`]: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    alignItems: 'center',
  },
  [`& .${PREFIX}-businessContainer`]: {
    borderRight: "1px solid #333",
  },
  [`& .${PREFIX}-locationText`]: {
    color: '#333',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: 1.2
    }
  },
  [`& .${PREFIX}-businessText`]: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: 1.2
    }
  },
  [`& .${PREFIX}-toolTip`]: {
    fontSize: '14px',
  },
  [`& .${PREFIX}-iconHover`]: {
    '&:hover': {
      cursor: 'pointer',
    },
  }
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const address = content?.geoAddress || `${content.addressLine1}, ${
    content.addressLine2 ? `${content.addressLine2},` : ''
  } ${content.city}, ${content.postal}`;

  const formattedAddress = isMobile
    ? (address.length > 19 ? `${address.slice(0, 15)} ...` : address)
    : (address.length > 28 ? `${address.slice(0, 24)} ...` : address);

  const businessName = `${
    content.business?.businessName ?? content.business?.legalName
  }`;
  const formattedBusinessName = isMobile
    ? (businessName.length > 7 ? `${businessName.slice(0, 5)} ...` : businessName)
    : (businessName.length > 10 ? `${businessName.slice(0, 7)} ...` : businessName);

  const { latitude, longitude, geoAddressConfidence } = content;
  let showStyle = `${PREFIX}-textContainer`;
  if (geoAddressConfidence === 'RANGE_INTERPOLATED' || geoAddressConfidence === 'APPROXIMATE') {
    showStyle = `${PREFIX}-warnTextContainer`;
  }
  if (!latitude || !longitude) {
    showStyle = `${PREFIX}-errorTextContainer`;
  }

  return (
    <StyledBox className={`${PREFIX}-container`}>
      <Box display="flex" flex={80} p={1} className={showStyle}>
        <Box flex={0.3} className={`${PREFIX}-businessContainer`} pl={1}>
          <StyledToolTip title={businessName}>
            <Typography className={`${PREFIX}-businessText`}>
              {formattedBusinessName}
            </Typography>
          </StyledToolTip>
        </Box>
        <Box flex={0.7} pl={1}>
          <StyledToolTip title={address}>
            <Typography className={`${PREFIX}-locationText`}>
              {formattedAddress}
            </Typography>
          </StyledToolTip>
        </Box>
      </Box>
      <Box flex={0.2} px={1}>
        <Box display="flex" justifyContent="space-between">
          <StyledToolTip title="Show in map">
            <MyLocationIcon
              className={`${PREFIX}-iconHover`}
              onClick={() => showOnMapHandler(content)}
            />
          </StyledToolTip>
          <StyledToolTip
            title="Remove location"
            onClick={() => removeLocationHandler(content)}
          >
            <ClearIcon className={`${PREFIX}-iconHover`} htmlColor="red" />
          </StyledToolTip>
          <StyledToolTip title="Drag to rearrange">
            <HorizontalSplitIcon className={`${PREFIX}-iconHover`} />
          </StyledToolTip>
        </Box>
      </Box>
    </StyledBox>
  );
}

export default LocationView;