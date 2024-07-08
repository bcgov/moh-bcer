import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useFormikContext } from 'formik';

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { BusinessInfoContext } from '@/contexts/BusinessInfo';

import { useAxiosPatch } from '@/hooks/axios';
import { StyledButton } from 'vaping-regulation-shared-components';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

interface SubmitBusinessInfoButtonProps {
  updateType?: string
}

export default function SubmitBusinessInfoButton({ updateType }: SubmitBusinessInfoButtonProps) {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext)
  const [{ response, loading, error}, patch] = useAxiosPatch(`/submission`, { manual: true });

  const { values, isValid } = useFormikContext();
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext)

  useEffect(() => {// Store the form values in local storage
    localStorage.setItem('BusinessDetailsValues', JSON.stringify(values))
  }, [values])

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])
  
  const submit = async () => {
    setBusinessInfo({ ...businessInfo, details: values })
    const url = `submission/${businessInfo.submissionId}`;
    const data = {
      data: {
        ...businessInfo,
        fileData: businessInfo.fileData,
        details: values,
        locations: businessInfo.locations,
      }
    };
  
    console.log('URL:', url);
    console.log('Data:', data);

    await patch({ url, data });
  }

  return response?.status === 201 ? 
    updateType === "businessInfoOnly" ? <Navigate to='/business/confirm' replace /> :  <Navigate to='/business/map' replace /> : (
    <>
    {error && (
      <Grid container>
        <Grid item>
          <Typography variant='subtitle1'>{error.message || error.toString()}</Typography>
        </Grid>
      </Grid>
    )}
    <Grid container direction='row-reverse'>
      <Grid item>
        <StyledButton
          variant='contained'
          onClick={submit}
          disabled={loading || !isValid || !businessInfo.locations.length}
        >
          {loading ? '...' : updateType === "businessInfoOnly" ? 'Update Business Details': 'Next'}
        </StyledButton>
      </Grid>
    </Grid>
  </>
  )
}
