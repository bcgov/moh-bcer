
import React, { useMemo } from 'react';
import { 
  makeStyles
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const baseStyle = {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 4,
  borderColor: '#0053A4',
  borderStyle: 'dashed',
  backgroundColor: '#fff',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const useStyles = makeStyles({
  fileName: {
    display: 'flex',
    lineHeight: '35px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '170px'
  },
  icon: {
    width: '90px',
    height: '70px',
    paddingBottom: '20px'
  },
  descriptionWrapper:{
    paddingBottom: '10px'
  },
  description: {
    display: 'flex',
    fontSize: '17px',
    color: '#000',
    fontWeight: 600
  },
  uploadOpenLink: {
    fontSize: '17px',
    color: '#0053A4',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 600
  },
  subtext: {
    fontSize: '14px',
    color: '#333333'
  },
  errorText: {
    color: 'red',
    padding: '10px 0px 10px 0px',
    fontSize: '16px'
  }
});


/**
 * Styled radio group reusable component
 *
 * @param  fileUploaded - boolean for external success state
 * @param  uploadCallbackHandler - handler for passing the file back through
 * @param  icon - `optional | string` png file import reference
 * @param  displayValidity - `optional | boolean` flag for additional UI file validity elements
 * @returns object of type ReactElement
 *
 */
export function StyledDropzone(props: {fileUploaded: boolean, actionText: string, uploadCallbackHandler: Function, icon?: string, displayValidity?: boolean}) {
  const classes = useStyles();

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    // isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    accept: '.csv',
    maxSize: 5000000,
    onDrop: (file: any) => props.uploadCallbackHandler(file)
    // disabled: props.fileUploaded
  });
  let fileAccepted: boolean | undefined;
  
  if (acceptedFiles && acceptedFiles.length) {
    fileAccepted = true;
  }
  
  if (fileRejections && fileRejections.length) {
    fileAccepted = false;
  }
  
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(fileAccepted ? acceptStyle : {}),
    ...(!fileAccepted && fileAccepted !== undefined ? rejectStyle : {})
  }), [
    isDragActive,
    fileAccepted,
    isDragReject
  ]);

  return (
    <div>
      <div {...getRootProps({style})} className={classes.inputField}>
        <input {...getInputProps()} />
        {
          props.icon
          ? 
          <img className={classes.icon} src={props.icon}/>
          : null
        }
        <div className={classes.descriptionWrapper}>
          <div className={classes.description}>
            {props.actionText}, or &nbsp;  
            <div className={classes.uploadOpenLink} onClick={open}>browse from your device</div>.
          </div>
        </div>
        <div className={classes.subtext}>Supported: csv</div>
      </div>
      {
        props.displayValidity
        ?
          <div className={classes.fileName}>
          {
            acceptedFiles[0]
              ? acceptedFiles[0].name
              : fileRejections[0]
                ? fileRejections[0].file.name
                : null
          }
          {
            (
            acceptedFiles[0]
              &&
              <CheckCircleIcon style={{color: 'green'}}/>
            )
              ||
            (
            fileRejections[0]
              &&
              <CancelIcon style={{color: 'red'}}/>
            )
          }
          </div>
        : null
      }
      {
        !fileAccepted && fileAccepted !== undefined
        ?
          fileRejections[0]
            &&
            <div className={classes.errorText}>
              File must be a CSV
            </div>
        : null
      }
    </div>
  );
}
