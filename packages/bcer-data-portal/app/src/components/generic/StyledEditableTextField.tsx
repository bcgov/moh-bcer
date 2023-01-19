import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core';

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
  type?: string;
}
// type: webpage || phone || email || underage || manufacturing
function StyledEditableTextField({value, type} : StyledEditableTextFieldProps) {
  const classes = useStyles();
  const [content, setContent] = useState(value);
  const [editMode, setEditMode] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);

  function handleChange (event:any) {
    console.log(content);
    setContent({ [event.target.name]: event.target.value });
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
          onChange={handleChange}
          disabled={!editMode}
          className={classes.textField}
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
