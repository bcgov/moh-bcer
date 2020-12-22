import React, { useEffect, useContext, useState } from 'react';
import useFileUpload from '@/hooks/useFileUpload';
import { makeStyles } from '@material-ui/core/styles';
import { StyledDropzone } from 'vaping-regulation-shared-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClearIcon from '@material-ui/icons/Clear';

import { IconButton, Typography } from '@material-ui/core';
import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { ProductInfoContext } from '@/contexts/ProductReport';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import UploadSuccess from '@/assets/images/file-check.png';
import uploadIcon from '@/assets/images/upload.png';

const useStyles = makeStyles({
  label: {
    color: '#1EAEDB',
    textDecoration: 'underline',
    display: 'inline',
  },
  uploadedFile: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    borderRadius: '4px',
    backgroundColor: '#F2F6FA',
    padding: '15px 0px 15px 20px'
  },
  cancelIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '0px'
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  successfulFileIcon: {
    height: '30px',
    paddingRight: '20px',
  },
  uploadedDescription: {
    padding: '10px 0px 10px 0px'
  },
  replaceText: {
    fontSize: '16px',
    color: '#0053A4',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  filename: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#424242',
  }
});


export default function UploadArea({ handleUpload, endpoint }: { handleUpload: Function, endpoint: string }) {
  const classes = useStyles();
  const [fileData, setFileData] = useState<any>();
  const [{ uploadError, data, loading, fileData: fileInformation }, upload] = useFileUpload(endpoint);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext)
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext)
  const [productInfo, setProductInfo] = useContext(ProductInfoContext)
  
  useEffect(() => {
    if (businessInfo.fileData) {
      setFileData(businessInfo.fileData)
    }
    if (productInfo.fileData) {
      setFileData(productInfo.fileData)
    }
  }, [])

  useEffect(() => {
    if (data) {
      handleUpload(data)
      // Strange behavior when using type File in businessInfo or productInfo, all file props exist until you go to
      // PATCH a submission, where it will strip out all props besides 'path'. Workaround is to only use the name prop
      // and type files as <any>
      if (businessInfo.entry === 'upload') {
        setBusinessInfo({...businessInfo, fileData: {name: fileInformation.name}})
      }
      if (productInfo.entry === 'upload') {
        setProductInfo({...productInfo, fileData: {name: fileInformation.name}})
      }
      setFileData(fileInformation)
    }
    if(uploadError) {
      setAppGlobal({...appGlobal, networkErrorMessage: uploadError?.response?.data?.message})
    }
  }, [data, uploadError])

  const handleResetUpload = () => {
    upload(null)
    handleUpload(null)
    setFileData(undefined)
    setBusinessInfo({...businessInfo, locations: businessInfo.locations.filter(l => l.id), fileData: undefined})
    setProductInfo({...productInfo, fileData: undefined})
  }

  return (
    <div>
      {
        (!data && !fileData) || (businessInfo.entry === 'upload' && !businessInfo?.locations?.length) || (productInfo.entry === 'upload' ) ? (
          <StyledDropzone
            fileUploaded={!!fileData}
            uploadCallbackHandler={(file: Array<File>) => {
              file 
                ? upload(file[0])
                : null
            }}
            icon={uploadIcon}
          />
        )
        : null
      }
      {
      (fileData !== undefined && businessInfo.locations.length) 
        ? 
          (
            <div className={classes.uploadedFile} >
              <IconButton 
                className={classes.cancelIcon}
                onClick={handleResetUpload}
              >
                <ClearIcon /> 
              </IconButton>
              <div className={classes.contentWrapper} >
                <img className={classes.successfulFileIcon} src={UploadSuccess} />
                <div>
                  <div className={classes.filename} > 
                    {fileData.name}
                  </div>
                  <Typography variant='body1'>
                    Your CSV file has been mapped successfully. Click next to complete upload and confirm your entries.
                  </Typography>
                  <div 
                    className={classes.replaceText} 
                    onClick={handleResetUpload}
                  > 
                    Replace with new upload
                  </div>
                </div> 
              </div>
            </div>
          ) 
        : null
      }
      {
        uploadError 
          && 
        <p>Upload failed: {uploadError.message || 'Unknown error'}</p>
      } 
    </div>
  )
}
