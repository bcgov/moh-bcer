import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import {IconButton, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {
  addressValidationSchema, 
  webpageValidationSchema, 
  emailValidationSchema,
  phoneValidationSchema, 
  manufacturingValidationSchema, 
  underageValidationSchema, 
  postalValidationSchema} from '@/constants/validate';
import {StyledDialog} from 'vaping-regulation-shared-components';

interface StyledEditDialogProps {
  type: string;
  saveChange?: (data:string) => void
}

export default function StyledEditDialog({type, saveChange}:StyledEditDialogProps) {
  const [content, setContent] = useState('');
	const [open, setOpen] = useState(false);
  const [errorText, seterrorText] = useState('');

  useEffect(() => { //input validation
    const contentObj: {[type: string]:any} = {}
    contentObj[type] = content;
    {type === 'addressLine1' && addressValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'webpage' && webpageValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'email' && emailValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'phone' && phoneValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'manufacturing' && manufacturingValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'underage' && underageValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'postal' && postalValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}

  }, [content])

  async function confirmContentChange() {
    saveChange(content)
    setOpen(false);
  }

  async function cancelContentChange() {
    saveChange("")
    setOpen(false);
  }

  return (
    <div>
      <Tooltip title="Edit" placement="top">
            <IconButton
              style={{
                color: '#0053A5',
              }}
              onClick={() => setOpen(true)}
            >
              <EditIcon />
            </IconButton>
      </Tooltip>
 			<StyledDialog 
        open={open}
        cancelButtonText="Cancel"
        acceptButtonText="Save"
        acceptHandler={confirmContentChange}
        cancelHandler={cancelContentChange}
        acceptDisabled={errorText!==''}
        title="Edit Info"
			>
        <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={type}
              fullWidth
              onChange={(e:any) => setContent(e.target.value)}
              error = {errorText===''? false : true}
              helperText={errorText}
            />
        </DialogContent>
			</StyledDialog>
    </div>
  );


}