import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { makeStyles, Typography, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import moment from 'moment';

import { StyledTable, StyledButton, LocationTypeLabels, LocationType } from 'vaping-regulation-shared-components';
import { BusinessLocationHeaders, SubmissionTypeEnum } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { ProductInfoContext } from '@/contexts/ProductReport';
import SendIcon from '@mui/icons-material/Send';
import ProductReportSubmission from '@/components/productReport/ProductReportSubmission';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { getInitialPagination } from '@/utils/util';

const PREFIX = 'Overview';

const classes = {
  bannerWrapper: `${PREFIX}-bannerWrapper`,
  bannerIcon: `${PREFIX}-bannerIcon`,
  bannerHeader: `${PREFIX}-bannerHeader`,
  pageDescription: `${PREFIX}-pageDescription`,
  highlightedText: `${PREFIX}-highlightedText`,
  box: `${PREFIX}-box`,
  title: `${PREFIX}-title`,
  highlighted: `${PREFIX}-highlighted`,
  listGroup: `${PREFIX}-listGroup`,
  listRow: `${PREFIX}-listRow`,
  listBullet: `${PREFIX}-listBullet`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  csvLink: `${PREFIX}-csvLink`,
  buttonIcon: `${PREFIX}-buttonIcon`,
  sendIcon: `${PREFIX}-sendIcon`,
  actionLink: `${PREFIX}-actionLink`,
  buttonWrapper: `${PREFIX}-buttonWrapper`
};

const Root = styled('div')({
  [`& .${classes.bannerWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#F8F2E4',
    borderRadius: '5px',
  },
  [`& .${classes.bannerIcon}`]: {
    fontSize: '45px',
    color: '#f3b229',
    paddingRight: '25px',
  },
  [`& .${classes.bannerHeader}`]: {
    fontWeight: 600,
    paddingBottom: '10px'
  },
  [`& .${classes.pageDescription}`]: {
    color: '#000000',
    padding: '20px 0'
  },
  [`& .${classes.highlightedText}`]: {
    fontWeight: 600,
    color: '#0053A4'
  },
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71'
  },
  [`& .${classes.highlighted}`]: {
    fontWeight: 600,
    color: '#0053A4',
  },
  [`& .${classes.listGroup}`]: {
    paddingLeft: '15px'
  },
  [`& .${classes.listRow}`]: {
    display: 'flex',
    paddingTop: '15px'
  },
  [`& .${classes.listBullet}`]: {
    margin: '10px 15px 0px 0px',
    minHeight: '6px',
    minWidth: '6px',
    maxHeight: '6px',
    maxWidth: '6px',
    borderRadius: '5px',
    backgroundColor: '#0053A4'
  },
  [`& .${classes.boxTitle}`]: {
    paddingBottom: '10px'
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px'
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  [`& .${classes.csvLink}`]: {
    textDecoration: 'none',
  },
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  [`& .${classes.sendIcon}`]: {
    height: '24px',
    paddingRight: '4px'
  },
  [`& .${classes.actionLink}`]: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  [`& .${classes.buttonWrapper}`]: {
    display: 'flex',
    alignItems: 'center'
  }
});

export default function ProductOverview() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [withProducts, setWithProducts] = useState([]);
  const [withoutProducts, setWithoutProducts] = useState([]);
  const viewProductlessFullscreenTable = useState<boolean>(false);
  const viewProductsFullscreenTable = useState<boolean>(false);
  const viewSubmittedFullscreenTable = useState<boolean>(false);
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
    }
  }, [locations]);

  useEffect(() => {
    if (error) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(error) })
    }
  }, [error]);

  useEffect(() => {
    if (patchedSubmission && !patchError) {
      navigate('/products/add-reports')
    }
    if (pathname.includes('success')) {
      if (locations.length > 0 && !locations.find((l: BusinessLocation) => l.products?.length === 0 || l.productsCount === 0)) {
        setAppGlobal({ ...appGlobal, productReportComplete: true });
      };
    };
  }, [patchedSubmission]);

  useEffect(() => {
    if (patchError) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(patchError) })
    }
  }, [patchError]);

  return loading ? <CircularProgress /> : (
    (<Root>
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
                Product Type (100 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Brand Name (40 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Product Name (100 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Manufacturer Name (50 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Manufacturer Contact Person (Optional, 50 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Manufacturer Address (160 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Manufacturer Phone (Extension should be written as follow XXX-XXX-XXXX:XXXX)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Manufacturer Email (Valid email eg. example@email.com)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Concentration (mg/mL) (Valid number only, eg. 10, 32.22 etc.)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Container Capacity (Max 30 mL) (Valid number only, eg. 10, 28.22 etc.)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Cartridge Capacity (Max 2 mL) (Valid number only, eg. 1, 1.3 etc.)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Ingredients (255 characters limit)
              </div>
              <div className={classes.listRow}>
                <div className={classes.listBullet} />
                Flavour (100 characters limit)
              </div>
          <Typography variant='body1' className={classes.pageDescription}>If any of the above information changes for a restricted E-substance product, the business owner must report this change to the Ministry within 7 days of selling the changed product.</Typography>
          <Typography variant='body1'><span className={classes.highlightedText}>Note:</span> If you are resubmitting a product report that was previously submitted before December 16, 2020, you are not required to wait 6 weeks before selling. You are only required to wait 6 weeks for any new products that you intend to sell and have not yet been reported.</Typography>
          <Typography variant='body1'><span className={classes.highlightedText}>Note:</span> Submission of your product reports does not confirm compliance of the products. Enforcement efforts will verify if the products are compliant under the E-Substances Regulation.</Typography>
        </div>
        <FullScreen fullScreenProp={viewProductlessFullscreenTable}>
          <TableWrapper
            blockHeader='Locations without Product Reports'
            tableHeader='Business Locations'
            tableSubHeader={`You have ${withoutProducts.length} retail locations.`}
            data={locations}
            csvProps={{
              headers: Object.keys(BusinessLocationHeaders),
              data: withoutProducts.map((l: BusinessLocation) => {
                return [l.addressLine1, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
              }),
              filename: 'business_locations_productless.csv'
            }}
            fullScreenProp={viewProductlessFullscreenTable} 
          >
            <div>
              <StyledTable
                options={{
                  pageSize: getInitialPagination(withoutProducts),
                  pageSizeOptions: [5, 10, 20, 30, 50]
                }}
                columns={[
                  {
                    title: 'Type of Location', render: (rd: BusinessLocation) => `${LocationTypeLabels[rd.location_type]}`, sorting: false
                  },
                  {
                    title: 'Address/URL', render: (rd: BusinessLocation) => rd.location_type === LocationType.online ? rd.webpage: `${rd.addressLine1}, ${rd.postal}, ${rd.city}`, sorting: false
                  },
                  {
                    title: 'Added Date', render: (rd: BusinessLocation) => rd.created_at ? `${moment(rd.created_at).format('MMM DD, YYYY')}` : '', sorting: false
                  },
                  {
                    title: 'Status',
                    render: (rd: BusinessLocation) => `${rd?.products?.length ? 'Submitted' : 'Not Submitted'}`, 
                    sorting: false
                  },
                  {
                    title: 'Doing Business as', render: (rd: BusinessLocation) => rd.doingBusinessAs, sorting: false
                  },
                ]}
                data={withoutProducts}
              />
            </div>
          </TableWrapper>
        </FullScreen>
        <FullScreen fullScreenProp={viewProductsFullscreenTable}>
          <TableWrapper
            blockHeader='Locations with Submitted Products'
            tableHeader='Business Locations'
            tableSubHeader={`You have ${withProducts.length} retail locations.`}
            data={locations}
            csvProps={{
              headers: Object.keys(BusinessLocationHeaders),
              data: withProducts.map((l: BusinessLocation) => {
                return [l.addressLine1, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
              }),
              filename: 'business_locations_with_products.csv'
            }}
            fullScreenProp={viewProductsFullscreenTable} 
          >
            <div>
              <StyledTable
                options={{
                  pageSize: getInitialPagination(withProducts),
                  pageSizeOptions: [5, 10, 20, 30, 50]
                }}
                columns={[
                  {
                    title: 'Type of Location', render: (rd: BusinessLocation) => `${LocationTypeLabels[rd.location_type]}`, width: 50, sorting: false
                  },
                  {
                    title: 'Address/URL', render: (rd: BusinessLocation) => rd.location_type === LocationType.online ? rd.webpage: `${rd.addressLine1}, ${rd.postal}, ${rd.city}`, sorting: false
                  },
                  {
                    title: 'Status',
                    render: (rd: BusinessLocation) => `${rd.products?.length || rd.productsCount > 0 ? 'Submitted' : 'Not Submitted'}`, sorting: false
                  },
                  {
                    title: 'Doing Business as', render: (rd: BusinessLocation) => rd.doingBusinessAs, sorting: false
                  },
                ]}
                actions={[
                  {
                    icon: tableAction,
                    onClick: (event: any, rowData: any) => navigate(`/products/location/${rowData.id}`)
                  }
                ]}
                data={withProducts}
              />
            </div>
          </TableWrapper>
        </FullScreen>
        <FullScreen fullScreenProp={viewSubmittedFullscreenTable}>
          <TableWrapper
            blockHeader={
              <>
                Product Report Submissions
                <Typography variant='body1' className={classes.pageDescription}>
                  In this section, you can review the product reports that you have submitted. When you select “view”
                  you can review and delete specific submissions. <span className={classes.highlightedText}>Note</span>: the purpose of this option is to delete products
                  that were submitted in error. If you are no longer selling a product, please <span className={classes.highlightedText}>do not delete</span> the product
                  from the list, as you will be required to report on it for your sales report in that current year.
                </Typography>
              </>
            }
            tableHeader='Product Report Submissions'
            tableSubHeader={`You have submitted ${productSubmissions.length} product reports`}
            data={locations}
            csvProps={{
              headers: Object.keys(BusinessLocationHeaders),
              data: withProducts.map((l: BusinessLocation) => {
                return [l.addressLine1, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
              }),
              filename: 'business_locations_with_products.csv'
            }}
            fullScreenProp={viewSubmittedFullscreenTable} 
          >
            <div>
              <StyledTable
                columns={[
                  { title: 'Submission Date', render: (submission: any) => `${moment(submission.dateSubmitted).format('LLL')}`, sorting: false },
                  { title: 'Products Submitted', render: (submission: any) => `${submission.productCount}`, sorting: false },
                ]}
                actions={[
                  {
                    icon: tableAction,
                    onClick: (event: any, rowData: any) => navigate(`/products/submission/${rowData.productUploadId}`)
                  }
                ]}
                data={productSubmissions}
              />
            </div>
          </TableWrapper>
        </FullScreen>
      </div>
    </Root>)
  );
}
