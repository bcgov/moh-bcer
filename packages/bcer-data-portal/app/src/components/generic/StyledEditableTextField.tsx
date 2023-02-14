import React, {useState, useEffect, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core';
import useLocation from '@/hooks/useLocation';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import StyledEditDialog from './StyledEditDialog';
// chloetest
const useStyles = makeStyles(() => ({
  disabled: {
    color: "black",
    fontSize: '14px',
    fontWeight: 600,
    borderBottom: 0,
    "&:before": {
      borderBottom: 0
    }
  }
}));

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
  const classes = useStyles();
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

  const updateContent = async (data:string, city: string, health_authority:string, longitude: number, latitude:number, geo_confidence:string) => { //update the content returned from the StyledEditDialog
    if(data!== "") {
      {type==='addressLine1'? updateNoteMessage("address changed from " + content): updateNoteMessage(type + " changed from " + content)}
      setContent(data)
      setCity(city)
      setHealth_authority(health_authority)
      setLongitude(longitude)
      setLatitude(latitude)
      setGeo_confidence(geo_confidence)
    }
    handleMouseOver()
  }
  
  useEffect(() => { //content changed => update the value in the database and add the change to the note
    if(notInitialRender.current){
      const sendToDB  = async() =>{ 
        //POST the change to DB
        await updateLocationInfo(type, content)
        if(city) await updateLocationInfo('city', city)
        if(health_authority) await updateLocationInfo('health_authority', health_authority)
        if(longitude) await updateLocationInfo('longitude', longitude)
        if(latitude) await updateLocationInfo('latitude', latitude)
        if(geo_confidence) await updateLocationInfo('geo_confidence', geo_confidence)
        
        if(patchLocationError){
          showNetworkErrorMessage(patchLocationError);
        }else{
          //Add the Note
          if(type === 'addressLine1') type = 'address';
          onSuccessfulUpdate(noteMessage + " to " + content);
        }
      }
      sendToDB();
    }else{
      notInitialRender.current=true;
    }
  }, [content])

  function handleMouseOver() {
    setMouseOver(!mouseOver);
  };

  return (
    <TextField
      name = {type}
      disabled={true}
      value={content}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
      InputProps={{
        classes: {
          disabled: classes.disabled
        },
        endAdornment: mouseOver ? (
          <InputAdornment position="end">
            <StyledEditDialog type={type} saveChange={updateContent}></StyledEditDialog>
          </InputAdornment>
          ) : (
            ""
          )
      }}
    />
  );  
}
export default StyledEditableTextField;