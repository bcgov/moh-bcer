import React, {useState, useEffect, useRef} from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/system';
import useLocation from '@/hooks/useLocation';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import StyledEditDialog from './StyledEditDialog';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input.Mui-disabled': {
    color: "black",
    fontSize: '14px',
    fontWeight: 600,
    WebkitTextFillColor: "black",
  },
  '& .MuiInput-underline.Mui-disabled:before': {
    borderBottomStyle: 'none',
  },
});

interface StyledEditableTextFieldProps {
  id: string;
  value: any;
  type: string;
  onSuccessfulUpdate?: (data:string) => void
}

//This is the editable text filed component for the location information on Location Details page, it allows the user to update the location information and it stores the edit history into Notes
//  id: location id
//  value: user's input
//  type: addressLine1 || postal || webpage || phone || email || underage || manufacturing
//  onSuccessfulUpdate: the function to save the change to the note
function StyledEditableTextField({id, value, type, onSuccessfulUpdate} : StyledEditableTextFieldProps) {
  const [content, setContent] = useState(value);
  const [city, setCity] = useState('');
  const [health_authority, setHealth_authority] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [geo_confidence, setGeo_confidence] = useState('');
  const [mouseOver, setMouseOver] = useState(false);
  const {updateLocationInfo, patchLocationError} = useLocation(id);
  const [noteMessage, updateNoteMessage] = useState("");
  const {showNetworkErrorMessage} = useNetworkErrorMessage();
  const notInitialRender = useRef(false);

  const updateContent = async (data:string, city: string, health_authority:string, longitude: number, latitude:number, geo_confidence:string) => {
    if(data!== "") {
      updateNoteMessage(type === 'addressLine1' ? "address changed from " + content : type + " changed from " + content);
      setContent(data);
      setCity(city);
      setLongitude(longitude);
      setLatitude(latitude);
      setGeo_confidence(geo_confidence);
      setHealth_authority(health_authority);
    }
    handleMouseOver();
  }
  
  useEffect(() => {
    if(notInitialRender.current){
      const sendToDB  = async() =>{ 
        await updateLocationInfo(type, content);
        if(city) await updateLocationInfo('city', city);
        if(longitude) await updateLocationInfo('longitude', longitude);
        if(latitude) await updateLocationInfo('latitude', latitude);
        if(geo_confidence) await updateLocationInfo('geo_confidence', geo_confidence);
        if(health_authority) await updateLocationInfo('health_authority', health_authority);
        
        if(patchLocationError){
          showNetworkErrorMessage(patchLocationError);
        }else{
          if(type === 'addressLine1') type = 'address';
          onSuccessfulUpdate(noteMessage + " to " + content);
        }
      }
      sendToDB();
    }else{
      notInitialRender.current=true;
    }
  }, [content]);

  const handleMouseOver = () => {
    setMouseOver(!mouseOver);
  };

  return (
    <StyledTextField
      name={type}
      disabled={true}
      value={content}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
      InputProps={{
        endAdornment: mouseOver ? (
          <InputAdornment position="end">
            <StyledEditDialog type={type} saveChange={updateContent} />
          </InputAdornment>
        ) : null
      }}
      variant="standard"
    />
  );  
}

export default StyledEditableTextField;