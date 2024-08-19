import React, { useState, useContext, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Formik, Form, useFormikContext } from 'formik';
import { StyledRadioGroup, StyledDialog, StyledHeaderMapper, mapToObject } from 'vaping-regulation-shared-components';

import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { BusinessLocationDTOHeaders, BusinessLocationHeaders } from '@/constants/localEnums';
import { LocationFileUploadRO } from '@/constants/localInterfaces';
import BusinessLocationForm from '@/components/form/forms/BusinessLocationForm';
import UploadArea from '@/components/form/UploadArea';
import { useAxiosPatch } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const classes = {
  title: {
    fontSize: '27px',
    fontWeight: 600,
    color: '#002C71',
    padding: '30px 0px 20px 0px '
  },
  description: {
    color: '#3A3A3A',
    fontSize: '14px',
    fontWeight: 600,
    paddingBottom: '30px'
  },
  box: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  boxTitle: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
  },
  boxDescription: {
    fontSize: '16px',
    color: '#3A3A3A',
    lineHeight: '20px',
  },
  radioGroup: {
    width: '50px',
  },
  boxHeader: {
    width: '100%',
    display: 'inline-flex',
    margin: '5px 0px 5px 0px',
  },
  textWrapper: {
    paddingBottom: '20px',
  },
  linkWrapper: {
    textDecorationColor: '#1E5DB1'
  },
  linkText: {
    display: 'inline',
    color: '#1E5DB1',
  },
  boxContent: {
    display: 'block',
    width: '100%'
  },
  dialogTitle: {
    size: '20px',
    color: '#0053A4',
    borderBottom: '1px solid #CCCCCC',
    padding: '0px 0px 16px 0px',
    margin: '16px 24px 0px 24px'
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
  }
};

const ContextHandler = (): null => {
  const { values, submitForm } = useFormikContext();
  useEffect(() => {
    submitForm();
  }, [values, submitForm]);
  return null;
};

export default function AddLocations () {

  const [entry, setEntry] = useState<string>();
  const [tempEntryRef, setTempEntryRef] = useState<string>();
  const [providedHeaders, setProvidedHeaders] = useState([]);
  const [confirmDialogOpen, setConfirmOpen] = useState<boolean>(false)
  const [mapping, setMapping] = useState<{[key: string]: string}>();
  const [{ error: mapError, response: mapResponse, data: mappedSubmission }, patch] = useAxiosPatch(`/submission/:id/map`, { manual: true });
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext)
  const [appGlobal, setAppGlobalContext ] = useContext(AppGlobalContext);
  
  useEffect(() => {
    if (mapping !== undefined) {
      (async () => {
        await patch({
          url: `/submission/${businessInfo.submissionId}/map`,
          data: {
            data:{
              locations: businessInfo.locations,
              mapping: mapping,
            },
          },
        })
      })()
    }
  }, [mapping])

  useEffect(() => {
    if (mappedSubmission && !mapError) {
      setBusinessInfo({...businessInfo, locations: mappedSubmission.data.locations.concat(businessInfo.locations.filter(l => l.id))})
    }
  }, [mappedSubmission])

  useEffect(() => {
    if (mapError) {
      setAppGlobalContext({...appGlobal, networkErrorMessage: formatError(mapError)})
    }
  }, [mapError])

  useEffect(() => {
    !!businessInfo.entry
    ?
      setEntry(businessInfo.entry)
    : null
  }, [businessInfo.entry])

  const handleUpload = (data: LocationFileUploadRO | null) => {
    if (data) {
      const { locations, submissionId, headers } = data;
      if (Object.keys(BusinessLocationHeaders).every( header => headers.includes(header))) {
        setMapping(BusinessLocationDTOHeaders)
        setBusinessInfo({...businessInfo, locations: locations.concat(businessInfo.locations.filter(l => l.id)), submissionId })
      } else {
        setBusinessInfo({...businessInfo, locations: locations.concat(businessInfo.locations.filter(l => l.id)), submissionId })
        setProvidedHeaders(headers)
      }
    } else {
      setBusinessInfo({...businessInfo, locations: businessInfo.locations.filter(l => l.id) })
      setProvidedHeaders(null)
      setMapping(undefined)
    }
  }

  const handleModeSwitch = (value: {'mode select': any}) => {
    if (businessInfo?.locations?.filter(l => !l.id)?.length) {
      if (value['mode select'] !== businessInfo.entry) {
        setConfirmOpen(true);
        setTempEntryRef(value['mode select']);
      }
    } else {
      setBusinessInfo({...businessInfo, entry: value['mode select']});
    }
  }

  const confirmResetValues = () => {
    setBusinessInfo({...businessInfo, locations: businessInfo.locations.filter(l => l.id), entry: tempEntryRef});
    setProvidedHeaders(null);
    setConfirmOpen(false);
  }

  const handleUpdateHeaders = (values: BusinessLocationHeaders) => {
    setMapping(mapToObject(BusinessLocationDTOHeaders, values))
  }

  return (
    <div>
      <div style={classes.title}>Add Business Locations</div>
      <div style={classes.helpTextWrapper}>
        <ChatBubbleOutlineIcon sx={classes.helperIcon} />
        <div>
          Please provide all the business locations that have sales premises. 
          If you are uploading a prefilled file, please ensure that you are using a CSV.
          The <b>"Confirm Your Business Details"</b> section must also be completed to proceed.
        </div>
      </div>
      <Formik enableReinitialize initialValues={{'mode select': entry}} onSubmit={(value) => handleModeSwitch(value)}>
        <Form>
          <div style={classes.box}>
            <div style={classes.boxContent}>
              <div style={classes.boxHeader}>
                <StyledRadioGroup
                  sx={classes.radioGroup}
                  isDisabled={false}
                  name="mode select"
                  label=""
                  row={false}
                  options={[
                    {value: 'upload', label: ''},
                  ]}
                />
                <div style={classes.textWrapper}>
                  <div style={classes.boxTitle} >Upload Business Physical Location List File </div>
                  <div style={classes.boxDescription}>Upload a prefilled physical location list file from your device. </div>
                  <div >
                    <CSVLink
                      style={classes.linkWrapper}
                      headers={Object.keys(BusinessLocationHeaders)}
                      data={[]}
                      filename='vaping-reg-business-locations.csv'
                    >
                      <div style={classes.linkText} >(Download Business physical location CSV template)</div>
                    </CSVLink>
                  </div>
                </div>
              </div>
              <div>
                {
                  entry === 'upload' && <UploadArea actionText={'Drag your physical locations here'} endpoint={`/upload/location/${businessInfo.submissionId}`} handleUpload={handleUpload} />
                }
                {
                  providedHeaders?.length && entry === 'upload' && !mapping
                    ?
                  <Dialog
                    open={providedHeaders?.length && entry === 'upload' && !mapping ? true : false}
                  >
                    <DialogTitle sx={classes.dialogTitle}>
                      Map Your Provided CSV Headers
                    </DialogTitle>
                    <DialogContent>
                    <StyledHeaderMapper requiredHeaders={BusinessLocationHeaders} providedHeaders={providedHeaders} updateMapCallback={handleUpdateHeaders} cancelHandler={() => handleUpload(null)}/>
                    </DialogContent>
                  </Dialog>
                  : null
                }
              </div>
            </div>
          </div>
          <div style={classes.box}>
            <div style={classes.boxContent} >
              <div style={classes.boxHeader}>
                <StyledRadioGroup
                  isDisabled={false}
                  name="mode select"
                  label=""
                  row={false}
                  options={[
                    {value: 'manual', label: ''},
                  ]}
                />
                <div style={classes.textWrapper} >
                  <div style={classes.boxTitle} >Add Business Locations Manually </div>
                  <div style={classes.boxDescription}>Fill in the form with business location details.</div>
                </div>
              </div>
              <BusinessLocationForm entry={entry} />
            </div>
          </div>
          <ContextHandler />
        </Form>
      </Formik>
      {
        confirmDialogOpen
          ?
            <StyledDialog
              open={confirmDialogOpen}
              title="Information will be lost"
              maxWidth="xs"
              cancelButtonText="Cancel"
              acceptButtonText="Yes"
              cancelHandler={() => setConfirmOpen(false)}
              acceptHandler={() => confirmResetValues()}
            >
              If you change the upload method now, you will lose all newly added locations.
            </StyledDialog>
          :null
      }
    </div>
  );
}
