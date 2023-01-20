import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core';
import { locationInformationValidationSchema } from '@/constants/validate';

const useStyles = makeStyles(() => ({
  textField: {
    color: "black",
    fontSize: '14px',
    fontWeight: 600,
  },
  disabled: {
    color: "black",
    fontSize: '14px',
    fontWeight: 600,
    borderBottom: 0,
    "&:before": {
      borderBottom: 0
    }
  },
  btnIcons: {
    marginLeft: 5
  }
}));

interface StyledEditableTextFieldProps {
  value: any;
  type: string;
}

//This is the editable text filed component for the location information on Location Details page, it allows the user to update the location information and it stores the edit history into Notes
//value: user's input
//type: webpage || phone || email || underage || manufacturing
function StyledEditableTextField({value, type} : StyledEditableTextFieldProps) {
  const classes = useStyles();
  const [content, setContent] = useState(value);
  const [textFildType, settextFildType] = useState(type);
  const [editMode, setEditMode] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [errorText, seterrorText] = useState('');


  function handleChange (event:any) {
    setContent(event.target.value); //update content vairable
    {textFildType == 'phone' && 
      locationInformationValidationSchema.isValid({phone: content,}).then((valid:any) => {
          if(valid == true){
            seterrorText('');
          }else{
            seterrorText('Please provide a valid phone number');
          }
        });
    }
    {textFildType == 'webpage' && 
    locationInformationValidationSchema.isValid({webpage: content,}).then((valid:any) => {
        if(valid == true){
          seterrorText('');
        }else{
          seterrorText('URL is not valid');
        }
      });
  }
  {textFildType == 'email' && 
  locationInformationValidationSchema.isValid({email: content,}).then((valid:any) => {
      if(valid == true){
        seterrorText('');
      }else{
        seterrorText('Email is not valid');
      }
    });
}



  };

  function handleMouseOver() {
    if (!mouseOver) setMouseOver(true);
  };

  function handleMouseOut() {
    if (mouseOver) setMouseOver(false);
  };

  function handleClick() {
    setEditMode(true);
    setMouseOver(false);
  };

    return (
        <TextField
          name = {type}
          defaultValue={value}
          disabled={!editMode}
          className={classes.textField}
          onChange={handleChange}
          error = {errorText===''? false : true}//validation
          helperText={errorText} //validation
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
          InputProps={{
            classes: {
              disabled: classes.disabled
            },
            endAdornment: mouseOver ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClick}>
                  <Edit />
                </IconButton>
              </InputAdornment>
            ) : (
              ""
            )
          }}
        />
    );  
}
export default StyledEditableTextField;
