import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import moment from 'moment';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { BusinessLocationHeaders, SubmissionTypeEnum } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { ProductInfoContext } from '@/contexts/ProductReport';
import SendIcon from '@material-ui/icons/Send';
import ProductReportSubmission from '@/components/productReport/ProductReportSubmission';
import { AppGlobalContext } from '@/contexts/AppGlobal';

const useStyles = makeStyles({
  bannerWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#F8F2E4',
    borderRadius: '5px',
  },
  bannerIcon: {
    fontSize: '45px',
    color: '#f3b229',
    paddingRight: '25px',
  },
  bannerHeader: {
    fontWeight: 600,
    paddingBottom: '10px'
  },
  pageDescription: {
    padding: '20px 0'
  },
  highlightedText: {
    fontWeight: 600,
    color: '#0053A4'
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  highlighted: {
    fontWeight: 600,
    color: '#0053A4',
  },
  listGroup: {
    paddingLeft: '15px'
  },
  listRow: {
    display: 'flex',
    paddingTop: '15px'
  },
  listBullet: {
    margin: '10px 15px 0px 0px',
    minHeight: '6px',
    minWidth: '6px',
    maxHeight: '6px',
    maxWidth: '6px',
    borderRadius: '5px',
    backgroundColor: '#0053A4'
  },
  subtitleWrapper: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  subtitle: {
    color: '#0053A4',
  },
  boxTitle: {
    paddingBottom: '10px'
  },
  tableRowCount: {
    paddingBottom: '10px'
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  csvLink: {
    textDecoration: 'none',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  sendIcon: {
    height: '24px',
    paddingRight: '4px'
  },
  actionLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center'
  }
});

export default function ProductOverview() {
  const classes = useStyles();
  const history = useHistory();
  const { location: { pathname } } = history;
  const [withProducts, setWithProducts] = useState([]);
  const [withoutProducts, setWithoutProducts] = useState([]);
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/location?count=products`);
  const [{ data: productSubmissions = [] }] = useAxiosGet(`/products/submissions`);
  const [{ loading: patchLoading, error: patchError, data: patchedSubmission }, patch] = useAxiosPatch('/submission', { manual: true });
  const [productInfo, setProductInfo] = useContext(ProductInfoContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const tableAction = () => (
    <Typography variant='body1' className={classes.actionLink}>View</Typography>
  )

  const handleSubmitReport = async () => {
    await patch({
      url: `/submission/${productInfo.submissionId}`,
      data: Object.assign({}, {
        // NB: legal name of business is hard coded
        // when we have business name from BCeID, we will useKeycloak() to get this data OR read it from the token
        legalName: 'Happy Puff',
        type: SubmissionTypeEnum.product,
      }, { data: productInfo })
    });
  }

  useEffect(() => {
    if (pathname.includes('success')) {
      setAppGlobal({ ...appGlobal, productReportComplete: true })
    }
  }, []);

  useEffect(() => {
    if (locations.length && !error) {
      const withProducts = locations?.filter((l: BusinessLocation) => l.productsCount > 0) || [];
      const withoutProducts = locations?.filter((l: BusinessLocation) => l.productsCount === 0) || [];
      setWithProducts(withProducts);
      setWithoutProducts(withoutProducts);
    } else {
      if (error) {
        setAppGlobal({...appGlobal, networkErrorMessage: error?.response?.data?.message})
      }
    }
  }, [locations, error])

  useEffect(() => {
    if (patchedSubmission && !patchError) {
      history.push('/products/add-reports')
    } else {
      if (patchError) {
        setAppGlobal({...appGlobal, networkErrorMessage: patchError?.response?.data?.message})
      }
    }
    if (pathname.includes('success')) {
      if (locations.length > 0 && !locations.find((l: BusinessLocation) => l.products?.length === 0 || l.productsCount === 0)) {
        setAppGlobal({ ...appGlobal, productReportComplete: true });
      };
    };
  }, [patchedSubmission, patchError]);

  return loading ? <CircularProgress /> : (
    <>
      <div>
        <div className={classes.actionsWrapper}>
          <Typography className={classes.title} variant='h5'>Product Report</Typography>
          <div className={classes.buttonWrapper}>
            <StyledButton variant='contained' onClick={handleSubmitReport}>
              <SendIcon className={classes.sendIcon} />
              Submit Product Report
            </StyledButton>
          </div>
        </div>
        {
          withoutProducts.length
            ?
            <div className={classes.bannerWrapper}>
              <ChatBubbleOutlineIcon className={classes.bannerIcon} />
              <div>
                <Typography variant='body1' className={classes.bannerHeader}>
                  You have outstanding product reports that need to be submitted
                    </Typography>
                <Typography variant='body1'>
                  You need to submit product reports for all locations listed in the "Locations without Product Reports"
                  section of this page. Click the "Submit Product Report" button to begin your submission.
                </Typography>
              </div>
            </div>
            :
            null
        }
        {
          pathname === '/products/success'
          &&
          <ProductReportSubmission />
        }
        <Typography variant='body1' className={classes.pageDescription}>
          As a business owner who sells or intends to sell E-substances in British Columbia, you are required to provide
          product information reports for each restricted E-substance you intend to sell. Product reports must be submitted
          at least 6 weeks prior to selling a restricted E-substance at retail.
          </Typography>
          <span className={classes.highlightedText}>A Product Report </span> must include the following information for each
            restricted E-substance that will be sold from the sales premises:
            <div className={classes.listGroup}>
            <div className={classes.listRow}>
              <div className={classes.listBullet} />
                The name and contact information for the manufacturer
              </div>
            <div className={classes.listRow}>
              <div className={classes.listBullet} />
                The brand name and product name
              </div>
            <div className={classes.listRow}>
              <div className={classes.listBullet} />
                The type of product
              </div>
            <div className={classes.listRow}>
              <div className={classes.listBullet} />
                The concentration of nicotine (in mg/mL)
              </div>
            <div className={classes.listRow}>
              <div className={classes.listBullet} />
                The capacity (in mLs) of either the refillable container,
                or the tank/cartridge to hold the E-substance
              </div>
            <div className={classes.listRow}>
              <div className={classes.listBullet} />
                A list of all the ingredients in an E-substance
                (both the common and scientific names unless one of these names is not available from the manufacturer)
              </div>
            <Typography variant='body1' className={classes.pageDescription}>If any of the above information changes for a restricted E-substance product, the business owner must report this change to the Ministry within 7 days of selling the changed product.</Typography>
        </div>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant='h6'>Locations without Product Reports</Typography>
        </div>
        <Paper variant='outlined' className={classes.box}>
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>You have {withoutProducts.length} retail locations</Typography>
            {
              withoutProducts.length
                ?
                <CSVLink
                  headers={Object.keys(BusinessLocationHeaders)}
                  data={withoutProducts.map((l: BusinessLocation) => {
                    return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                  })}
                  filename={'business_locations_productless.csv'} className={classes.csvLink} target='_blank'>
                  <StyledButton variant='outlined'>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
                :
                null
            }
          </div>
          <div>
            <StyledTable
              columns={[
                {
                  title: 'Address 1', render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`
                },
                {
                  title: 'Added Date', render: (rd: BusinessLocation) => rd.created_at ? `${moment(rd.created_at).format('MMM DD, YYYY')}` : ''
                },
                {
                  title: 'Status',
                  render: (rd: BusinessLocation) => `${rd?.products?.length ? 'Submitted' : 'Not Submitted'}`
                },
              ]}
              data={withoutProducts}
            />
          </div>
        </Paper>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant='h6'>Locations with Submitted Products</Typography>
        </div>
        <Paper className={classes.box} variant='outlined' >
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>You have {withProducts.length} retail locations</Typography>
            {
              withProducts.length
                ?
                  <CSVLink
                    headers={Object.keys(BusinessLocationHeaders)}
                    data={withProducts.map((l: BusinessLocation) => {
                      return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                    })}
                    filename={'business_locations_with_products.csv'} className={classes.csvLink} target='_blank'>
                    <StyledButton variant='outlined'>
                      <SaveAltIcon className={classes.buttonIcon} />
                      Download CSV
                    </StyledButton>
                </CSVLink>
                :
                null
            }
          </div>
          <div>
            <StyledTable
              columns={[
                {
                  title: 'Address 1', render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`
                },
                {
                  title: 'Status',
                  render: (rd: BusinessLocation) => `${rd.products?.length || rd.productsCount > 0 ? 'Submitted' : 'Not Submitted'}`
                },
              ]}
              actions={[
                {
                  icon: tableAction,
                  onClick: (event: any, rowData: any) => history.push(`/view-location/${rowData.id}`)
                }
              ]}
              data={withProducts}
            />
          </div>
        </Paper>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant='h6'>Product Report Submissions</Typography>
        </div>
        <Paper className={classes.box} variant='outlined' >
          <Typography className={classes.boxTitle} variant='subtitle1'>Product Report Submisisons</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>You have submitted {productSubmissions.length} product reports</Typography>
          </div>
          <div>
            <StyledTable
              columns={[
                { title: 'Submission Date', render: (submission: any) => `${moment(submission.dateSubmitted).format('LLL')}` },
                { title: 'Products Submitted', render: (submission: any) => `${submission.productCount}` },
              ]}
              actions={[
                {
                  icon: tableAction,
                  onClick: (event: any, rowData: any) => history.push(`/products/submission/${rowData.productUploadId}`)
                }
              ]}
              data={productSubmissions}
            />
          </div>
        </Paper>
      </div>
    </>
  );
}
