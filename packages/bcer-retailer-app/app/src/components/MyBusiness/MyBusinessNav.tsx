import React, { useState, useEffect, useContext } from 'react';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import store from 'store';

import { makeStyles, createStyles } from '@material-ui/core';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';

import Top from '@/components/stepper/Top';
import Bottom from '@/components/stepper/Bottom';

import { BIContext, BusinessInfoProvider } from '@/contexts/BusinessInfo';
import { SubmissionTypeEnum } from '@/constants/localEnums';

import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { Method } from 'axios'

import BusinessDetails from './MyBusinessComponents/BusinessDetails';
import ConfirmLocations from './MyBusinessComponents/ConfirmLocations';
import ConfirmAndSubmit from './MyBusinessComponents/ConfirmAndSubmit';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { BusinessLocation } from '@/constants/localInterfaces';

const useStyles = makeStyles({
    stepTitle: {
      fontSize: '27px',
      fontWeight: 600,
      color: '#002C71',
      paddingBottom: '20px',
    },
    helpTextWrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#E0E8F0',
      marginBottom: '20px',
      borderRadius: '5px',
    },
    helperIcon: {
      fontSize: '45px',
      color: '#0053A4',
      paddingRight: '25px',
    },
    helperText: {
      fontSize: '16px',
      lineHeight: '20px',
      color: '#777777'
    }
});

// NB: move steps to their own file
// the presence/logic of execIf should be revisited
const steps = [
  {
    icon: WorkOutlineIcon,
    label: 'Business Details',
    title: 'Confirm Your Business Details',
    path: '/business/details',
    component: <Route key="details" exact path='/business/details' component={BusinessDetails} />,
    helpText: <p>Please confirm the business details that were entered when registering for your BCeID.
               If you sell e-substances from this location, please add it as a location in the <b>"Add Business Locations"</b> section.
               You must also add any additional locations from which you sell e-substances.</p>,
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
    title: 'Confirm Business Locations',
    path: '/business/map',
    component: <Route key='map' exact path='/business/map' component={ConfirmLocations} />,
    helpText: 'Confirm the details of the business locations that you have added on the previous page. You will be able to update this information at any time. Upon completion of this section you will be able to complete a Notice of Intent to sell E-substances and submit Product and Manufacturing Reports for each location you have listed.',
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
    component: <Route key='confirm' exact path='/business/confirm' component={ConfirmAndSubmit} />,
    helpText: '',
    onAdvance: [{
      datakey: 'submissionId',
      endpoint: process.env.BASE_URL + '/submission/save',
      method: 'POST' as Method,
      execIf: { validate: () => true }
    }]
  },
]

export default function MyBusinessNav () {
  const classes = useStyles({});
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const { pathname } = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [businessInfo, setBusinessInfo] = useState<any>({
    details: {},
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
  })

  const stepperOptions = steps.map(element => ({ path: element.path, icon: element.icon, label: element.label }))

  const [{ data: profile, error: profileError }] = useAxiosPost('/users/profile');
  const [{ loading, error, response, data: submission }, get] = useAxiosGet('/submission', { manual: true });
  const [{ loading: postLoading, error: postError, data: newSubmission }, post] = useAxiosPost('/submission', { manual: true });
  
  useEffect(() => {
    (async () => {
      const submissionId = store.get('submissionId') || businessInfo.submissionId
      // GET: returns an existing submission
      // POST: creates a new submission
      await submissionId ?
        get({ url:`/submission/${submissionId}` }) :
        post({ data: Object.assign({}, { type: SubmissionTypeEnum.location }, { data: businessInfo }) })
    })();
  }, []);

  useEffect(() => {
    (async() => {
      if (profile?.business && !profileError) {
        if (submission) {
          if (!error) {
            setBusinessInfo({
              ...businessInfo,
              ...submission.data,
              details: profile.business,
              locations: submission?.data?.locations?.length ? submission.data.locations : profile?.business?.locations?.length ? profile.business.locations : [],
              submissionId: submission.id,
            })
          } else {
            setAppGlobal({...appGlobal, networkErrorMessage: error?.response?.data?.message})
          }
        } else {
          setBusinessInfo({
            ...businessInfo,
            details: profile?.business,
            locations: profile?.business?.locations,
          })
        }
      } else {
        setAppGlobal({...appGlobal, networkErrorMessage: profileError?.response?.data?.message})
      }
    })()
  }, [profile, submission, error, profileError])

  useEffect(() => {
    if (newSubmission && !postError) {

      store.set('submissionId', newSubmission.id)
      const initialData = profile?.business || newSubmission.data;
        setBusinessInfo({
          ...businessInfo,
          ...initialData,
          submissionId: newSubmission.id,
        })
    } else {
      if (postError) {
        setAppGlobal({...appGlobal, networkErrorMessage: postError?.response?.data?.message})
      }
    }
  }, [newSubmission, postError])

  useEffect(() => {
    setBusinessInfo({ ...businessInfo, currentStep })
  }, [currentStep])

  useEffect(() => {
    const activeStep = steps.map(step => step.path).indexOf(pathname);
    if (activeStep !== currentStep) setCurrentStep(activeStep);
  }, [pathname])

  return (
    <BusinessInfoProvider value={[businessInfo, setBusinessInfo]}>
      <Top steps={stepperOptions} currentStep={currentStep} />
      <div className={classes.stepTitle} >{steps[currentStep].title}</div>
      {
        steps[currentStep].helpText
          &&
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <div>
            {steps[currentStep].helpText}
          </div>
        </div>
      }
      <Switch>
        {steps.map(step => step.component)}
      </Switch>
      {currentStep > 0 && (
        <Bottom
          hasPrevious={currentStep > 0}
          isFinal={currentStep === steps.length - 1}
          setCurrentStep={setCurrentStep}
          dataForContext={businessInfo}
          steps={steps.map(step => ({ path: step.path }))}
          currentStep={currentStep}
          {...steps[currentStep]}
        />
      )}
    </BusinessInfoProvider>
  )
}
