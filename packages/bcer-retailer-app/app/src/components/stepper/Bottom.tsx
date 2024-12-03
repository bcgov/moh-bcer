import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Method } from 'axios';
import { StyledButton } from 'vaping-regulation-shared-components';
import { useKeycloak } from '@react-keycloak/web';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import store from 'store';
import useAxios from 'axios-hooks';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { useAxiosPost } from '@/hooks/axios';

const PREFIX = 'Bottom';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`
};

const Root = styled('div')({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#002C71',
    fontSize: '24px'
  }
});

type OnAdvance = {
  datakey?: string,
  endpoint: string,
  method: Method,
  execIf: {
    property?: string,
    validate: Function,
  },
}

type BottomStepperProps = {
  hasPrevious: boolean;
  isFinal: boolean;
  setCurrentStep: Function;
  dataForContext: any;
  canAdvanceChecks?: Array<{ property: string, validate: Function }>;
  steps: Array<{ path: string }>;
  currentStep: number;
  onAdvance?: OnAdvance[];
  isLoading?: boolean;
}

export default function Bottom ({
  hasPrevious,
  isFinal,
  setCurrentStep,
  dataForContext,
  canAdvanceChecks,
  onAdvance,
  steps,
  currentStep,
  isLoading,
}: BottomStepperProps) {


  const [canAdvance, toggleCanAdvance] = useState(false);
  const {keycloak} = useKeycloak();
  const navigate = useNavigate();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const next = () => navigate(steps[currentStep + 1].path);
  const previous = () => navigate(steps[currentStep - 1].path);
  const [{ data, loading, error, response }, execute] = useAxios({ headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keycloak.token}`}}, { manual: true });
  const [{ loading: emailNotificationLoading,  data: emailNotificationData }, sendEmail] = useAxiosPost('/location/notify-duplicate-locations', {manual: true});

  useEffect(() => {
    if (response?.status === 201 && !error) {
      if (isFinal) {
        setAppGlobal({ ...appGlobal, myBusinessComplete: true });
        store.remove('submissionId');
        navigate(`/submission/${dataForContext.submissionId}`);
      } else next()
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)});
    }
  }, [error]);

  useEffect(() => {
    toggleCanAdvance(
      !canAdvanceChecks ||
      canAdvanceChecks.every(
        (check: { property: any, validate: Function }) => check.validate(dataForContext[check.property])
      )
    )
  }, [dataForContext])

  const handleSendEmail = async (dataForContext: any) => {
    try {
      const response = await sendEmail({ data: { dataForContext } });
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const stepAction = async () => {
    const { submissionId, ...rest } = dataForContext;
  
    try {
      if (onAdvance) {
        await Promise.all(onAdvance.map(async (advanceStep: OnAdvance) => {
          if (advanceStep.execIf?.validate(dataForContext[advanceStep.execIf?.property])) {
            if (isFinal) {
              await handleSendEmail(dataForContext);// send out the email notification if duplicate locations being created
            }
            await execute({
              url: advanceStep.endpoint.includes('save') ? `${process.env.BASE_URL}/submission/${dataForContext.submissionId}/save` : `${advanceStep.endpoint}/${dataForContext.submissionId}`,
              method: advanceStep.method,
              data: {
                submissionId,
                data: advanceStep.datakey ? {
                  [advanceStep.datakey]: rest[advanceStep.datakey],
                  currentStep: rest.currentStep,
                } : rest,
              }
            });
          } else {
            next();
          }
        }));
      } else {
        next();
      }
    } catch (error) {
      console.error('Error during stepAction:', error);
    }
  };  

  return (
    <Root className={`${hasPrevious ? '' : 'first'} navButtons`}>
      {
        hasPrevious
          &&
        <StyledButton variant='outlined' onClick={previous}>
          <ArrowBackOutlinedIcon className={classes.buttonIcon}/>
          Edit Uploaded Information
        </StyledButton>
      }
      {
        isFinal ? (
          <StyledButton
            variant='contained'
            onClick={stepAction}
          >
            {loading ? '...' : 'Submit Business Information'}
          </StyledButton>
        ) : (
          <StyledButton
            variant='contained'
            disabled={!canAdvance || loading || isLoading}
            onClick={stepAction}
          >
            {'Next'}
          </StyledButton>
        )
      }
    </Root>
  );
}
