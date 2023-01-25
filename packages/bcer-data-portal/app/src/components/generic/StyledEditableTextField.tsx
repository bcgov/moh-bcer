import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core';
import { locationInformationValidationSchema } from '@/constants/validate';
import useNote from '@/hooks/useNote';
import useLocation from '@/hooks/useLocation';

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
  id: string;
  value: any;
  type: string;
}

//This is the editable text filed component for the location information on Location Details page, it allows the user to update the location information and it stores the edit history into Notes
//value: user's input
//type: webpage || phone || email || underage || manufacturing
function StyledEditableTextField({id, value, type} : StyledEditableTextFieldProps) {
  const classes = useStyles();
  const [content, setContent] = useState(value);
  const [editMode, setEditMode] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [errorText, seterrorText] = useState('');
  const {submit} = useNote({ targetId:id, type:'location'});
  const {updateLocationInfo} = useLocation(id);

  useEffect(() => { //verify the content once it's changed by the users
    const contentObj: {[type: string]:any} = {}
    contentObj[type] = content;
    locationInformationValidationSchema.isValid(contentObj).then((valid:any) => {
      if(valid == true){
        seterrorText('');
      }else{
        seterrorText('Input Not Valid');
      }
    });
  }, [content])

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

  async function handleOnBlur() { //once the errorText is changed to '' and the user stopped editing, confirm the change and update the value in the database
    if(errorText === '' && editMode === true){
      //POST TO DB
      // if(type === 'underage' && !['yes','no'].includes(content.toLowerCase())){
      //   await updateLocationInfo('underage_other', content);
      // }else{
        await updateLocationInfo(type, content);
      // }
      
      //Add the Note
      const noteContent = type + ' changed from ' + value + ' to ' + content;
      submit(noteContent);
      alert(type + " updated succesfully");
    }
  }


    return (
        <TextField
          name = {type}
          defaultValue={value}
          disabled={!editMode}
          className={classes.textField}
          onChange={(e:any) => setContent(e.target.value)}
          error = {errorText===''? false : true}//validation
          helperText={errorText} //validation
          onBlur={handleOnBlur} //when the user clicked off the TextField
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
