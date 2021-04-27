import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useFormikContext } from 'formik';

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { BusinessInfoContext } from '@/contexts/BusinessInfo';

import { useAxiosPatch } from '@/hooks/axios';
import { StyledButton } from 'vaping-regulation-shared-components';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

export default function SubmitBusinessInfoButton() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext)
  const [{ response, loading, error}, patch] = useAxiosPatch(`/submission`, { manual: true });

  const { values, isValid } = useFormikContext();
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext)

  const submit = async () => {
    setBusinessInfo({
      ...businessInfo,
      details: values
    })
    await patch({
      url: `submission/${businessInfo.submissionId}`,
      data: {
        data: {
          ...businessInfo,
          fileData: businessInfo.fileData,
          details: values,
          locations: businessInfo.locations,
        }
      }
    })
  }

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])

  return response?.status === 201 ? <Redirect to='/business/map' /> : (
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
          {loading ? '...' : 'Next'}
        </StyledButton>
      </Grid>
    </Grid>
  </>
  )
}
