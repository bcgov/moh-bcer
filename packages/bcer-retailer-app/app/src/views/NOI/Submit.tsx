import React, { useContext, useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { makeStyles, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

import { StyledButton, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { NoiUtil } from '@/utils/noi.util';
import { NoiSubmissionTable } from './Tables';
import FullScreen from '@/components/generic/FullScreen';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '30px'
  },
  checkboxLabel: {
    marginTop: '20px',
    '& .MuiIconButton-colorSecondary':{
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      }
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',

    },
    '& .Mui-checked': {
      color: '#0053A4'
    },
  },
});

export default function NoiSubmit() {
  const classes = useStyles();
  const history = useHistory();
  const [outstanding, setOutstanding] = useState<Array<BusinessLocation>>([]);
  const [selected, setSelected] = useState<Array<BusinessLocation>>([]);
  const submitTableFullscreenState = useState<boolean>(false);

  const [isConfirmOpen, setOpenConfirm] = useState<boolean>(false);
  const [isConfirmChecked, setConfirmChecked] = useState<boolean>();
  const [{ data, loading, error }] = useAxiosGet<{locations: BusinessLocation[]}>(`/business/report-overview`);
  const [{ response, loading: postLoading, error: postError }, post] = useAxiosPost(`/noi`, { manual: true });
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const confirmSubmit = async () => {
    const ids: Array<string> = selected.map((r:BusinessLocation) => r.id);
    await post({
      data: { locationIds: ids },
    });
  }

  const submit = () => {
    setOpenConfirm(true);
  }

  const handleSelection = (rows: Array<BusinessLocation>) => {
    setSelected(rows);
  }

  useEffect(() => {
    if (postError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(postError)})
    }
  }, [postError])

  useEffect(() => {
    if (data?.locations?.length && !error) {
      const outstanding:Array<BusinessLocation> = data.locations.filter(NoiUtil.outstandingNoi);
      setOutstanding(outstanding);
    }
  }, [data]);
  
  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error]);

  return loading ? <CircularProgress /> : response?.status === 201 ? <Redirect to='/noi/success' /> : (
    <>
      <div>
        <StyledButton onClick={() => history.push('/noi')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Confirm and Submit Notice of Intent
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
            Select the location(s) for which you want to submit or renew the Notice of Intent.
          </Typography>
        </div>
        <FullScreen
          fullScreenProp={submitTableFullscreenState}
        >
          <NoiSubmissionTable 
            data={outstanding}
            handleSelection={handleSelection}
            fullScreenProp={submitTableFullscreenState}
          />
        </FullScreen>
        
        <div className={classes.submitWrapper}>
          <StyledButton variant='outlined' onClick={() => history.push('/noi')}>
            Back
          </StyledButton>
          <StyledButton
            variant='contained'
            onClick={submit}
            disabled={!selected.length}
          >
            Submit
          </StyledButton>
        </div>
      </div>
      <StyledConfirmDialog
        open={isConfirmOpen}
        maxWidth='sm'
        dialogTitle="Confirm Your Submission"
        checkboxLabel='I agree that the location information entered is correct and wish to submit my Notice of Intent.'
        dialogMessage='You are about to submit/renew the Notice of Intent for the selected retail locations. You will not be able to update location details once the NOI is submitted.'
        setOpen={() => setOpenConfirm(false)}
        confirmHandler={confirmSubmit}
        acceptButtonText={'Submit Now'}
      />
    </>
  );
}
