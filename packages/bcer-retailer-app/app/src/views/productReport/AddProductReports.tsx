import React, { useEffect, useState, useContext } from 'react'
import { Form, Formik, useFormikContext } from 'formik';
import { StyledButton, StyledRadioGroup, StyledAutocomplete, StyledHeaderMapper, mapToObject } from 'vaping-regulation-shared-components';
import { Dialog, DialogContent, DialogTitle, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

import { ProductsFileUploadRO, BusinessLocation } from '@/constants/localInterfaces';
import { ProductReportDTOHeaders, ProductReportHeaders, SubmissionTypeEnum } from '@/constants/localEnums';
import { ProductInfoContext } from '@/contexts/ProductReport';
import { useAxiosPatch, useAxiosGet } from '@/hooks/axios';
import UploadArea from '@/components/form/UploadArea';
import { CSVLink } from 'react-csv';
import { exampleProductReport } from '@/constants/exampleCsvData';
import { AppGlobalContext } from '@/contexts/AppGlobal';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  description: {
    paddingBottom: '30px'
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
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
  uploaderSubtitle: {
    paddingBottom: '20px'
  },
  continueWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '15px'
  },
  dialogTitle: {
    size: '20px',
    color: '#0053A4',
    borderBottom: '1px solid #CCCCCC',
    padding: '0px 0px 16px 0px',
    margin: '16px 24px 0px 24px'
  }
})

const ContextHandler = (): null => {
  const { values, submitForm } = useFormikContext();

  useEffect(() => {
    submitForm();
  }, [values, submitForm]);
  return null;
};

export default function AddProductReports() {
  const history = useHistory();
  const classes = useStyles();

  const [entry, setEntry] = useState<string>();
  const [providedHeaders, setProvidedHeaders] = useState([]);
  const [value, setValue] = useState<BusinessLocation>();
  const [inputValue, setInputValue] = useState('');
  const [mapping, setMapping] = useState<{[key: string]: string}>();
  const [productInfo, setProductInfo] = useContext(ProductInfoContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [{ loading: productsLoading, error: productsError, data: productsData }, get] = useAxiosGet('/location/:id/products', { manual: true });
  const [{ loading: locationsLoading, error: locationsError, data: locations }, getLocations] = useAxiosGet('/location?count=products');
  const [{ loading: postLoading, error: postError, data: newSubmission }, patch] = useAxiosPatch('/submission', { manual: true });
  const [{ error: mapError, response: mapResponse, data: mappedSubmission }, patchMap] = useAxiosPatch('/submission/map', { manual: true });

  useEffect(() => {
    (async() =>{
      getLocations()
    })()
  }, [])

  useEffect(() => {
    if (postError) {
      setAppGlobal({...appGlobal, networkErrorMessage: postError?.response?.data?.message})
    }
  }, [postError])
  
  useEffect(() => {
    (async () => {
      if (mapping !== undefined) {
        await patchMap({
          url: `/submission/${productInfo.submissionId}/map`,
          data: {
            data:{
              products: productInfo.products,
              mapping: mapping,
            },
          },
        })
      }
    })()
  }, [mapping])

  useEffect(() => {
    (async () => {
      if (productsData && !productsError) {
        setProductInfo({...productInfo, products: productsData.products})
        await patch({
          url: `/submission/${productInfo.submissionId}`,
          data: Object.assign({}, {
            type: SubmissionTypeEnum.product,
          }, { data: productInfo })
        });
      } else {
        if (productsError) {
          setAppGlobal({...appGlobal, networkErrorMessage: productsError?.response?.data?.message})
        }
      }
    })()
  }, [productsData, productsError])

  useEffect(() => {
    (async () => {
      if (locations?.length && !locationsError) {
        setProductInfo({...productInfo, locations: locations });
      } else {
        if (locationsError) {
          setAppGlobal({...appGlobal, networkErrorMessage: locationsError?.response?.data?.message})
        }
      }
    })()
  }, [locations, locationsError])

  useEffect(() => {
    if (mappedSubmission && !mapError) {
      setProductInfo({...productInfo, products: mappedSubmission.data.products})
      history.push('/products/confirm-products')
    } else {
      if (mapError) {
        setAppGlobal({...appGlobal, networkErrorMessage: mapError?.response?.data?.message})
      }
    }
  }, [mappedSubmission, mapError])

  useEffect(() => {
    setProductInfo({...productInfo, entry})
  }, [entry]);

  const handleModeSwitch = (value: {'mode select': any}) => {
    setEntry(value['mode select']);
  }
  const selectFromLocation = async() => { 
    if (value) {
      await get({ url:`/location/${value.id}?includes=products` })
      history.push('/products/confirm-products')
    }
  }

  const handleUpload = (data: ProductsFileUploadRO | null) => {
    if (data) {
      const { products, submissionId, headers } = data;
  
      setProductInfo({...productInfo, products, submissionId })
      setProvidedHeaders(headers)
    } else {
      setProvidedHeaders(null)
      setMapping(undefined)
    }
  }

  const handleUpdateHeaders = (values: ProductReportHeaders) => {
    setMapping(mapToObject(ProductReportDTOHeaders, values))
  }

  return (
    <>
      <div>
        <StyledButton onClick={() => history.push('/products')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography className={classes.title} variant='h5'>Add/Upload File</Typography>
        <div className={classes.helpTextWrapper}>
            <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1' className={classes.description}>
          You are required to submit a Product Report for all locations that you have added.
          You may choose to submit the same product report for multiple locations, if applicable.
          </Typography>
        </div>
        <Formik enableReinitialize initialValues={{'mode select': entry}} onSubmit={(value) => handleModeSwitch(value)}>
          <Form>
            <div className={classes.box}>
              <div className={classes.boxContent}>
                <div className={classes.boxHeader}>
                  <StyledRadioGroup
                    className={classes.radioGroup}
                    isDisabled={false}
                    name="mode select"
                    label=""
                    row={false}
                    options={[
                      {value: 'upload', label: ''},
                    ]}
                  />
                  <div className={classes.textWrapper}>
                    <div className={classes.boxTitle} >Upload Product List File</div>
                    <div className={classes.boxDescription}>
                      If you already have an existing file, you can upload here and then match 
                      the headers to the report requirements.
                    </div>
                      <CSVLink
                        className={classes.linkWrapper}
                        headers={Object.keys(ProductReportHeaders)}
                        data={[]}
                        filename='vaping-reg-product-report.csv'
                      >
                        <div className={classes.linkText} >(Download Product Report CSV template)</div>
                      </CSVLink>
                    <div >
                    </div>
                  </div>
                </div>
                <div>
                  {
                    entry === 'upload' && 
                    <div>
                      <Typography variant='subtitle1' className={classes.uploaderSubtitle}>
                        1. Upload file from your device.
                      </Typography>
                      <UploadArea endpoint={`/upload/submission/${productInfo.submissionId}`} handleUpload={handleUpload} /> 
                    </div>
                  }
                  {
                    providedHeaders?.length && entry === 'upload'
                      ? 
                        <Dialog
                          open={providedHeaders?.length && entry === 'upload' && !mapping ? true : false}
                        >
                          <DialogTitle className={classes.dialogTitle}>
                            Map Your Provided CSV Headers
                          </DialogTitle>
                          <DialogContent>
                          <StyledHeaderMapper requiredHeaders={ProductReportHeaders} providedHeaders={providedHeaders} updateMapCallback={handleUpdateHeaders} cancelHandler={() => handleUpload(null)}/>
                          </DialogContent>
                        </Dialog>
                      : null
                    }
                </div>
              </div>
            </div>
            <div className={classes.box}>
              <div className={classes.boxContent} >
                <div className={classes.boxHeader}>
                  <StyledRadioGroup
                    isDisabled={false}
                    name="mode select"
                    label=""
                    row={false}
                    options={[
                      {value: 'manual', label: ''},
                    ]}
                  />
                  <div className={classes.textWrapper} >
                    <div className={classes.boxTitle} >Add from existing location</div>
                    <div className={classes.boxDescription}>Reuse a product report that you have previously submitted from an existing retail location</div>
                  </div>
                </div>
                {
                  entry === 'manual'
                    &&
                      <>
                        <div>
                          <StyledAutocomplete
                            value={value}
                            onChange={(event: React.ChangeEvent<any>, newValue: BusinessLocation) => setValue(newValue)}
                            inputValue={inputValue}
                            onInputChange={(event: React.ChangeEvent<any>, newInputValue: string | null) => setInputValue(newInputValue)}
                            options={locations.filter((l: any) => l.products?.length || l.productsCount > 0)}
                            getOptionLabel={(option: BusinessLocation) => option.addressLine1}
                          />
                        </div>
                        <div className={classes.continueWrapper}>
                          <StyledButton 
                            variant='contained' 
                            onClick={selectFromLocation}
                            disabled={!value}
                          >
                            Next
                          </StyledButton> 
                        </div>    
                    </>
                }
              </div>
            </div>
            <ContextHandler />
          </Form>
        </Formik>
      </div>
    </>
  )
}