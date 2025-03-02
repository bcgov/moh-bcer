import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import store from 'store';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

import Top from '@/components/stepper/Top';
import Bottom from '@/components/stepper/Bottom';

import { BusinessInfoProvider } from '@/contexts/BusinessInfo';
import { SubmissionTypeEnum } from '@/constants/localEnums';

import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { Method } from 'axios';

import BusinessDetails from './MyBusinessComponents/BusinessDetails';
import ConfirmLocations from './MyBusinessComponents/ConfirmLocations';
import ConfirmAndSubmit from './MyBusinessComponents/ConfirmAndSubmit';

import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import Subscription from '../Subscription/Subscription';

const PREFIX = 'MyBusinessNav';

const classes = {
  stepTitle: `${PREFIX}-stepTitle`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
};

const StyledBusinessInfoProvider = styled('div')({
  [`& .${classes.stepTitle}`]: {
    fontSize: '27px',
    fontWeight: 600,
    color: '#002C71',
    paddingBottom: '20px',
  },
  [`& .${classes.helpTextWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#E0E8F0',
    marginBottom: '20px',
    borderRadius: '5px',
  }
});

const StyledChatBubbleOutlineIcon = styled(ChatBubbleOutlineIcon)({
  fontSize: '45px',
  color: '#0053A4',
  paddingRight: '25px',
});

export default function MyBusinessNav () {

  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false); //A loading state for the stepper Next button

  // NB: move steps to their own file
  // the presence/logic of execIf should be revisited
  const steps = [
    {
      icon: WorkOutlineIcon,
      label: 'Business Details',
      title: 'Confirm Your Business Details',
      path: '/business/details',
      component: <BusinessDetails />,
      helpText: <p>Please confirm the business details that were entered when registering for your BCeID.
                If you sell e-substances from this location, please add it as a location in the <b>"Add Business Locations"</b> section.
                You must also add any additional locations from which you sell e-substances.</p>,
      showSubscription: true,
      canAdvanceChecks: [
        {
          property: 'locations',
          validate: (val: Array<any>) => val.length,
        },
        {
          property: 'detailsComplete',
          validate: (val: boolean) => val,
        }
      ],
      onAdvance: [{
        endpoint: process.env.BASE_URL + '/submission',
        method: 'PATCH' as Method,
        execIf: { validate: () => true }
      }]
    },
    {
      icon: MapOutlinedIcon,
      label: 'Confirm Locations',
      title: 'Confirm New Business Locations',
      path: '/business/map',
      component: <ConfirmLocations isLoading={isLoading} setIsLoading={setIsLoading}/>,
      helpText: 'Confirm the details of the business locations that you have added on the previous page. You will be able to update this information at any time. Upon completion of this section you will be able to complete a Notice of Intent to sell E-substances and submit Product and Manufacturing Reports for each location you have listed.',
      canAdvanceChecks: [
        {
          property: 'uploadErrors',
          validate: (val: Array<any>) => val?.length === 0,
        }
      ],
      onAdvance: [{
        endpoint: process.env.BASE_URL + '/submission',
        method: 'PATCH' as Method,
        execIf: {
          property: 'entry',
          validate: (val?: string) => val === 'upload',
        },
      }]
    },
    {
      icon: AssignmentTurnedInOutlinedIcon,
      label: 'Confirm Business Details and Submit',
      title: 'Confirm Business Details and Submit',
      path: '/business/confirm',
      component: <ConfirmAndSubmit/>,
      helpText: '',
      onAdvance: [{
        datakey: 'submissionId',
        endpoint: process.env.BASE_URL + '/submission/save',
        method: 'POST' as Method,
        execIf: { validate: () => true }
      }]
    },
  ]

  // Fetch initial business details from local storage
  const initialBusinessDetails = JSON.parse(localStorage.getItem('BusinessDetailesValues') || '{}');
  const [currentStep, setCurrentStep] = useState(0);
  const [businessInfo, setBusinessInfo] = useState<any>({
    details: initialBusinessDetails,
    detailsComplete: false,
    locations: [],
    mapping: {},
    submissionId: '',
    notifications: {
      all: true
    },
    notificationsValid: true,
    currentStep: 0,
    entry: '',
    uploadErrors: []
  })

  const [{ data: profile, error: profileError }] = useAxiosPost('/users/profile');
  const [{ loading, error, response, data: submission }, get] = useAxiosGet('/submission', { manual: true });
  const [{ loading: postLoading, error: postError, data: newSubmission }, post] = useAxiosPost('/submission', { manual: true });

  const stepperOptions = steps.map(element => ({ path: element.path, icon: element.icon, label: element.label }))

  // Fetch initial data
  useEffect(() => {
    const fetchSubmissionData = async () => {
      const submissionId = store.get('submissionId') || businessInfo.submissionId;
      
      if (submissionId) {
        try {
          await get({ url: `/submission/${submissionId}` });
        } catch (error) {
          console.error('Error fetching submission:', error);
          setAppGlobal((prevGlobal: any) => ({
            ...prevGlobal,
            networkErrorMessage: formatError(error),
          }));
        }
      } else {
        try {
          const result = await post({
            data: {
              type: SubmissionTypeEnum.location,
              data: businessInfo,
            },
          });
          
          if (result && result.data) {
            store.set('submissionId', result.data.id);
            setBusinessInfo((prevInfo: any) => ({
              ...prevInfo,
              submissionId: result.data.id,
            }));
          }
        } catch (error) {
          console.error('Error creating new submission:', error);
          setAppGlobal((prevGlobal: any) => ({
            ...prevGlobal,
            networkErrorMessage: formatError(error),
          }));
        }
      }
    };

    fetchSubmissionData();
  }, []);

  // Update business info when profile or submission changes
  useEffect(() => {
    if (profile?.business && !profileError) {
      if (submission) {
        setBusinessInfo((prevInfo: any) => ({
          ...prevInfo,
          ...submission.data,
          details: profile.business,
          locations: submission?.data?.locations?.length 
            ? submission.data.locations 
            : profile?.business?.locations?.length 
              ? profile.business.locations 
              : [],
          submissionId: submission.id,
        }));

        setAppGlobal((prevGlobal: any) => ({
          ...prevGlobal,
          myBusinessComplete: true,
        }));
      } else {
        setBusinessInfo((prevInfo: any) => ({
          ...prevInfo,
          details: profile.business,
          locations: profile.business?.locations || [],
        }));
      }
    }
  }, [profile, submission, profileError]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setAppGlobal((prevGlobal: any) => ({
        ...prevGlobal,
        networkErrorMessage: formatError(error)
      }));
    }
  }, [error]);

  useEffect(() => {
    if (profileError) {
      setAppGlobal((prevGlobal: any) => ({
        ...prevGlobal,
        networkErrorMessage: formatError(profileError)
      }));
    }
  }, [profileError]);

  useEffect(() => {
    if (postError) {
      setAppGlobal((prevGlobal: any) => ({
        ...prevGlobal,
        networkErrorMessage: formatError(postError)
      }));
    }
  }, [postError]);

  // Update businessInfo when currentStep changes
  useEffect(() => {
    setBusinessInfo((prevInfo: any) => ({ ...prevInfo, currentStep }));
  }, [currentStep]);

  // Update currentStep based on pathname
  useEffect(() => {
    const activeStep = steps.map(step => step.path).indexOf(pathname);
    if (activeStep !== -1 && activeStep !== currentStep) {
      setCurrentStep(activeStep);
    }
  }, [pathname]);

  //Debug logging
  // useEffect(() => {
  //   console.log('Profile:', profile);
  //   console.log('Submission:', submission);
  //   console.log('Business Info:', businessInfo);
  // }, [profile, submission, businessInfo]);


  return (
    <StyledBusinessInfoProvider>
      <BusinessInfoProvider value={[businessInfo, setBusinessInfo]}>
        <Top steps={stepperOptions} currentStep={currentStep} />
        {steps[currentStep].showSubscription && appGlobal.config?.enableSubscription && <Subscription />}
        <div className={classes.stepTitle}>{steps[currentStep].title}</div>
        {steps[currentStep].helpText && (
          <div className={classes.helpTextWrapper}>
            <StyledChatBubbleOutlineIcon />
            <div>
              {steps[currentStep].helpText}
            </div>
          </div>
        )}
        {steps[currentStep].component}
        {currentStep > 0 && (
          <Bottom
            hasPrevious={currentStep > 0}
            isFinal={currentStep === steps.length - 1}
            setCurrentStep={setCurrentStep}
            dataForContext={businessInfo}
            steps={steps.map(step => ({ path: step.path }))}
            currentStep={currentStep}
            isLoading={isLoading}
            {...steps[currentStep]}
          />
        )}
      </BusinessInfoProvider>
    </StyledBusinessInfoProvider>
  );
}