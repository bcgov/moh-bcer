import React, { useEffect, useState, useContext } from 'react'
import { styled } from '@mui/material/styles';
import { Form, Formik, useFormikContext } from 'formik';
import { StyledButton, StyledRadioGroup, StyledAutocomplete, StyledHeaderMapper, mapToObject } from 'vaping-regulation-shared-components';
import { Dialog, DialogContent, DialogTitle, makeStyles, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { ProductsFileUploadRO, BusinessLocation } from '@/constants/localInterfaces';
import { ProductReportDTOHeaders, ProductReportHeaders, SubmissionTypeEnum } from '@/constants/localEnums';
import { ProductInfoContext } from '@/contexts/ProductReport';
import { useAxiosPatch, useAxiosGet } from '@/hooks/axios';
import UploadArea from '@/components/form/UploadArea';
import { CSVLink } from 'react-csv';
import { exampleProductReport } from '@/constants/exampleCsvData';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const PREFIX = 'AddProductReports';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  box: `${PREFIX}-box`,
  boxTitle: `${PREFIX}-boxTitle`,
  boxDescription: `${PREFIX}-boxDescription`,
  radioGroup: `${PREFIX}-radioGroup`,
  boxHeader: `${PREFIX}-boxHeader`,
  textWrapper: `${PREFIX}-textWrapper`,
  linkWrapper: `${PREFIX}-linkWrapper`,
  linkText: `${PREFIX}-linkText`,
  boxContent: `${PREFIX}-boxContent`,
  uploaderSubtitle: `${PREFIX}-uploaderSubtitle`,
  continueWrapper: `${PREFIX}-continueWrapper`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  highlightedText: `${PREFIX}-highlightedText`
};

const Root = styled('div')({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71'
  },
  [`& .${classes.description}`]: {
    paddingBottom: '30px'
  },
  [`& .${classes.helpTextWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  [`& .${classes.helperIcon}`]: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  [`& .${classes.box}`]: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  [`& .${classes.boxTitle}`]: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
  },
  [`& .${classes.boxDescription}`]: {
    fontSize: '16px',
    color: '#3A3A3A',
    lineHeight: '20px',
  },
  [`& .${classes.radioGroup}`]: {
    width: '50px',
  },
  [`& .${classes.boxHeader}`]: {
    width: '100%',
    display: 'inline-flex',
    margin: '5px 0px 5px 0px',
  },
  [`& .${classes.textWrapper}`]: {
    paddingBottom: '20px',
  },
  [`& .${classes.linkWrapper}`]: {
    textDecorationColor: '#1E5DB1'
  },
  [`& .${classes.linkText}`]: {
    display: 'inline',
    color: '#1E5DB1',
  },
  [`& .${classes.boxContent}`]: {
    display: 'block',
    width: '100%'
  },
  [`& .${classes.uploaderSubtitle}`]: {
    paddingBottom: '20px'
  },
  [`& .${classes.continueWrapper}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '15px'
  },
  [`& .${classes.dialogTitle}`]: {
    size: '20px',
    color: '#0053A4',
    borderBottom: '1px solid #CCCCCC',
    padding: '0px 0px 16px 0px',
    margin: '16px 24px 0px 24px'
  },
  [`& .${classes.highlightedText}`]: {
    fontWeight: 600,
    color: '#0053A4'
  },
});

const ContextHandler = (): null => {
  const { values, submitForm } = useFormikContext();

  useEffect(() => {
    submitForm();
  }, [values, submitForm]);
  return null;
};

export default function AddProductReports() {
  const navigate = useNavigate();

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
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(postError)})
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
      }
    })()
  }, [productsData]);

  useEffect(() => {
    if (productsError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(productsError)})
    }
  }, [productsError])

  useEffect(() => {
    (async () => {
      if (locations?.length && !locationsError) {
        setProductInfo({...productInfo, locations: locations });
      }
    })()
  }, [locations]);

  useEffect(() => {
    if (locationsError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(locationsError)})
    }
  }, [locationsError]);

  useEffect(() => {
    if (mappedSubmission && !mapError) {
      setProductInfo({...productInfo, products: mappedSubmission.data.products})
      navigate('/products/confirm-products')
    }
  }, [mappedSubmission]);

  useEffect(() => {
    if (mapError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(mapError)})
    }
  }, [mapError]);

  useEffect(() => {
    setProductInfo({...productInfo, entry})
  }, [entry]);

  const handleModeSwitch = (value: {'mode select': any}) => {
    setEntry(value['mode select']);
  }
  const selectFromLocation = async() => { 
    if (value) {
      await get({ url:`/location/${value.id}?includes=products` })
      navigate('/products/confirm-products')
    }
  }

  const handleUpload = (data: ProductsFileUploadRO | null) => {
    if (data) {
      const { products, submissionId, headers } = data;
      if (Object.keys(ProductReportHeaders).every( header => headers.includes(header))) {
        setMapping(ProductReportDTOHeaders)
        setProductInfo({...productInfo, products, submissionId })
      } else {
        setProductInfo({...productInfo, products, submissionId })
        setProvidedHeaders(headers)
      }
    } else {
      setProvidedHeaders(null)
      setMapping(undefined)
    }
  }

  const handleUpdateHeaders = (values: { [key: string]: ProductReportHeaders }) => {
    setMapping(mapToObject(ProductReportDTOHeaders, values))
  }

  return (
    (<Root>
      <div>
        <StyledButton onClick={() => navigate('/products')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography className={classes.title} variant='h5'>Add/Upload File</Typography>
        <div className={classes.helpTextWrapper}>
            <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1' className={classes.description}>
          You are required to submit a Product Report for all locations that you have added.
          You may choose to submit the same product report for multiple locations, if applicable.
          If you are adding new products to your product list, <span className={classes.highlightedText}>only upload the new products</span>. Do not re-upload
          your entire product list as this will create a duplicate of all existing entries.
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
                      <UploadArea actionText={'Drop your product report here'} endpoint={`/upload/submission/${productInfo.submissionId}`} handleUpload={handleUpload} /> 
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
    </Root>)
  );
}