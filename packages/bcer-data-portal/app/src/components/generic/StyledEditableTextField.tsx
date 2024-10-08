import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/system';
import useLocation from '@/hooks/useLocation';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import StyledEditDialog from './StyledEditDialog';
import StyledEditableDropdown from './StyledEditableDropdown';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input.Mui-disabled': {
    color: 'black',
    fontSize: '14px',
    fontWeight: 600,
    WebkitTextFillColor: 'black',
  },
  '& .MuiInput-underline.Mui-disabled:before': {
    borderBottomStyle: 'none',
  },
});

interface StyledEditableTextFieldProps {
  id: string;
  value: any;
  type: string;
  onSuccessfulUpdate?: (data: string) => void;
}

function StyledEditableTextField({ id, value, type, onSuccessfulUpdate }: StyledEditableTextFieldProps) {
  const [content, setContent] = useState(value);
  const [city, setCity] = useState('');
  const [health_authority, setHealth_authority] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [geo_confidence, setGeo_confidence] = useState('');
  const [mouseOver, setMouseOver] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { updateLocationInfo, patchLocationError } = useLocation(id);
  const [noteMessage, updateNoteMessage] = useState('');
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const notInitialRender = useRef(false);

  const updateContent = async (
    data: string,
    city: string,
    health_authority: string,
    longitude: number,
    latitude: number,
    geo_confidence: string
  ) => {
    if (data !== '') {
      updateNoteMessage(type === 'addressLine1' ? 'address changed from ' + content : type + ' changed from ' + content);
      setContent(data);
      setCity(city);
      setLongitude(longitude);
      setLatitude(latitude);
      setGeo_confidence(geo_confidence);
      setHealth_authority(health_authority);
    }
  };

  useEffect(() => {
    if (notInitialRender.current) {
      const sendToDB = async () => {
        await updateLocationInfo(type, content);
        if (city) await updateLocationInfo('city', city);
        if (longitude) await updateLocationInfo('longitude', longitude);
        if (latitude) await updateLocationInfo('latitude', latitude);
        if (geo_confidence) await updateLocationInfo('geo_confidence', geo_confidence);
        if (health_authority) await updateLocationInfo('health_authority', health_authority);

        if (patchLocationError) {
          showNetworkErrorMessage(patchLocationError);
        } else {
          if (type === 'addressLine1') type = 'address';
          onSuccessfulUpdate(noteMessage + ' to ' + content);
        }
      };

      sendToDB();
    } else {
      notInitialRender.current = true;
    }
  }, [content]);

  const handleMouseOver = () => {
    setMouseOver(true);
  };

  const handleMouseOut = () => {
    setMouseOver(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const dropdownOptions = [
    { label: 'Yes', value: "Yes" },
    { label: 'No', value: "No" },
  ];

  const dropdownTypes = ['underage', 'manufacturing'];
  
  return (
    <>
      { dropdownTypes.includes(type) ? (
        <StyledEditableDropdown
          id={id}
          value={content}
          type={type}
          options={dropdownOptions}
          onSuccessfulUpdate={onSuccessfulUpdate}
        />
      ) : (
        <StyledTextField
          name={type}
          disabled={true}
          value={content}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
          InputProps={{
            endAdornment: mouseOver ? (
              <InputAdornment position="end">
                <IconButton style={{ color: '#0053A5' }} onClick={handleDialogOpen}>
                  <EditIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          variant="standard"
        />
      )}
      <StyledEditDialog
        type={type}
        saveChange={updateContent}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </>
  );
}

export default StyledEditableTextField;