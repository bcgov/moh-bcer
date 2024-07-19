import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { styled } from '@mui/material/styles';
import { Typography, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { StyledButton, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { NoiUtil } from '@/utils/noi.util';
import { NoiSubmissionTable } from './Tables';
import FullScreen from '@/components/generic/FullScreen';

const StyledWrapper = styled('div')(({ theme }) => ({
  '& .buttonIcon': {
    paddingRight: '5px',
    color: '#285CBC',
  },
  '& .title': {
    padding: '20px 0px',
    color: '#002C71',
  },
  '& .helpTextWrapper': {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  '& .helperIcon': {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  '& .submitWrapper': {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '30px',
  },
  '& .checkboxLabel': {
    marginTop: '20px',
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',
      '&:hover': {
        backgroundColor: 'rgba(0, 83, 164, .03)',
      },
      '&.Mui-checked': {
        color: '#0053A4',
      },
    },
  },
}));

export default function NoiSubmit() {
  const navigate = useNavigate();
  const [outstanding, setOutstanding] = useState<Array<BusinessLocation & { tableData: { checked: boolean } }>>([]);
  const [isSubmitEnabled, setSubmitEnabled] = useState<boolean>(false);
  const submitTableFullscreenState = useState<boolean>(false);
  const [isConfirmOpen, setOpenConfirm] = useState<boolean>(false);
  const [{ data, loading, error }] = useAxiosGet<{ locations: BusinessLocation[] }>(`/business/report-overview`);
  const [{ response, loading: postLoading, error: postError }, post] = useAxiosPost(`/noi`, { manual: true });
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const confirmSubmit = async () => {
    const ids: Array<string> = outstanding.filter((r) => r.tableData.checked).map((r) => r.id);
    await post({
      data: { locationIds: ids },
    });
  };

  const submit = () => {
    setOpenConfirm(true);
  };

  const handleSelection = (rows: Array<BusinessLocation & { tableData: { checked: boolean } }>) => {
    setOutstanding((prevOutstanding) => {
      const updatedOutstanding = prevOutstanding.map((row) => {
        const isSelected = rows.some((r) => r.id === row.id);
        return {
          ...row,
          tableData: { checked: isSelected },
        };
      });
  
      const hasCheckedRows = updatedOutstanding.some((row) => row.tableData.checked);
      setSubmitEnabled(hasCheckedRows);

      return updatedOutstanding;
    });
  };

  useEffect(() => {
    if (postError) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(postError) });
    }
  }, [postError, appGlobal, setAppGlobal]);

  useEffect(() => {
    if (data?.locations?.length && !error) {
      const outstanding: Array<BusinessLocation & { tableData: { checked: boolean } }> = data.locations.map((location) => ({
        ...location,
        tableData: { checked: false },
      })).filter(NoiUtil.outstandingNoi);
      setOutstanding(outstanding);
    }
  }, [data, error]);

  useEffect(() => {
    if (error) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(error) });
    }
  }, [error, appGlobal, setAppGlobal]);

  if (loading) return <CircularProgress />;
  if (response?.status === 201) return <Navigate to='/noi/success' />;
 
  return (
    <StyledWrapper>
      <div>
        <StyledButton onClick={() => navigate('/noi')}>
          <ArrowBackIcon className="buttonIcon" />
          Cancel
        </StyledButton>
        <Typography variant='h5' className="title">
          Confirm and Submit Notice of Intent
        </Typography>
        <div className="helpTextWrapper">
          <ChatBubbleOutlineIcon className="helperIcon" />
          <Typography variant='body1'>
            Select the location(s) for which you want to submit or renew the Notice of Intent.
          </Typography>
        </div>
        <FullScreen fullScreenProp={submitTableFullscreenState}>
          <NoiSubmissionTable
            data={outstanding}
            handleSelection={handleSelection}
            fullScreenProp={submitTableFullscreenState}
          />
        </FullScreen>
        <div className="submitWrapper">
          <StyledButton variant='outlined' onClick={() => navigate('/noi')}>
            Back
          </StyledButton>
          <StyledButton
            variant='contained'
            onClick={submit}
            disabled={!isSubmitEnabled}
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
    </StyledWrapper>
  );
}