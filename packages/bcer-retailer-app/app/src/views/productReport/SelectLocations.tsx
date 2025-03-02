import React, { useState, useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { Typography, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { StyledTable, StyledButton, StyledConfirmDialog, LocationType, LocationTypeLabels } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { ProductInfoContext } from '@/contexts/ProductReport';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { getInitialPagination } from '@/utils/util';

const PREFIX = 'SelectLocations';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  submitWrapper: `${PREFIX}-submitWrapper`,
  checkboxLabel: `${PREFIX}-checkboxLabel`
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
  [`& .${classes.helpTextWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  [`& .${classes.helperIcon}`]: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px'
  },
  [`& .${classes.submitWrapper}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
  [`& .${classes.checkboxLabel}`]: {
    marginTop: '20px'
  },
});

export default function SelectLocations() {
  const navigate = useNavigate();

  const [{ data: locations = [], loading, error }, get] = useAxiosGet(`/location`); 
  const [tableData, setTableData] = useState<Array<BusinessLocation & { tableData: { checked: boolean } }>>([]);
  const [{ response, loading: patchLoading, error: patchError }, patch] = useAxiosPatch(`/products`, { manual: true });
  const [isConfirmOpen, setOpenConfirm] = useState<boolean>(false);
  const viewFullscreenTable = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productInfo, setProductInfo] = useContext(ProductInfoContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const confirmSubmit = async() => {
    const selectedLocations = tableData.filter(location => location.tableData.checked).map(location => location.id);
    await patch({
      data: {
        locationIds: selectedLocations,
        products: productInfo.products,
      }
    })
  }

  useEffect(() => {
    setProductInfo({
      ...productInfo,
      locations: [],
    });
  }, []);

  useEffect(() => {
    if (locations?.length) {
      const locationsWithChecked = locations.map((location: any) => ({
        ...location,
        tableData: { checked: false }
      }));
      setTableData(locationsWithChecked);
    }
  }, [locations]);
  
  useEffect(() => {
    if (patchError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(patchError)})
    }
  }, [patchError])

  useEffect(() => {
    if (response && !error) {
      navigate('/products/success')
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error]);

  return (
    (<Root>
      <div>
        <StyledButton onClick={() => navigate('/products/add-reports')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Select Locations
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
            Select the location that this product list applies to, you can select multiple
            locations if they will sell the same inventory.
          </Typography>
        </div>
        <FullScreen fullScreenProp={viewFullscreenTable}>
          <TableWrapper
            tableHeader='Select locations that this report applies to.'
            tableSubHeader={
              `You have ${locations.length} retail locations.
              ${productInfo.products.length * productInfo.locations.length < 200000
                ? ` You are submitting ${productInfo.products.length} products to ${productInfo.locations.length} locations.`
                : ` Please limit your submission to ${Math.floor(200000 / productInfo.products.length)} locations.`
              }`
            }
            data={locations}
            csvProps={{
              headers: Object.keys(BusinessLocationHeaders),
              data: locations?.map((l: BusinessLocation) => {
                return [l.addressLine1, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
              }),
              filename: 'business_locations.csv'
            }}
            fullScreenProp={viewFullscreenTable} 
          >
            <div style={{ overflowX: 'auto' }}>
            <StyledTable
              columns={[
                {title: 'Type of Location',  render: (rd: BusinessLocation) => `${LocationTypeLabels[rd.location_type]}`},
                {title: 'Address/URL', render: (rd: BusinessLocation) => rd.location_type === LocationType.online? rd.webpage : `${rd.addressLine1}, ${rd.postal}, ${rd.city}`},
                {title: 'Email Address', field: 'email'},
                {title: 'Phone Number', field: 'phone'},
              ]}
              data={tableData}
              options={{ 
                selection: true,
                pageSize: getInitialPagination(tableData),
                pageSizeOptions: [5, 10, 20, 30, 50]
              }}
              onSelectionChange={(rows: any) => {
                const selectedIds = rows.map((row: BusinessLocation & { tableData: { checked: boolean } }) => row.id);
                setSelectedProducts(selectedIds);
                setProductInfo({
                  ...productInfo,
                  locations: selectedIds
                });
                setTableData(prevData => 
                  prevData.map(row => ({
                    ...row,
                    tableData: {
                      ...row.tableData,
                      checked: selectedIds.includes(row.id)
                    }
                  }))
                );
              }}
            />
            </div>
          </TableWrapper>
        </FullScreen>
        <div className={classes.submitWrapper}>
          <StyledButton
            variant='contained'
            onClick={() => setOpenConfirm(true)}
            disabled={!selectedProducts.length || productInfo.products.length * productInfo.locations.length > 200000}
          >
            Submit
          </StyledButton>
        </div>
      </div>
      <Snackbar
        open={patchLoading}
        message={'Submitting product report. Please wait...'}
        ClickAwayListenerProps={{mouseEvent: false, touchEvent: false}}
      />
      <StyledConfirmDialog
        open={isConfirmOpen}
        maxWidth='sm'
        dialogTitle="Confirm Your Submission and Acknowledge"
        checkboxLabel='I understand that I will be required to wait 6 weeks from the time that I file or update my product report before I can sell these products. I acknowledge that submission of my product reports does not indicate Ministry approval of the submitted products and that I am still subject to enforcement actions from Health Authorities, should my products be in non-compliance with the E-Substances Regulation. Submission of your product reports does not confirm compliance of the products. Enforcement efforts will verify if the products are compliant under the E-Substances Regulation.'
        dialogMessage='You are about to submit your product report.'
        setOpen={() => setOpenConfirm(false)}
        confirmHandler={confirmSubmit}
        acceptDisabled={patchLoading}
        cancelDisabled={patchLoading}
      />
    </Root>)
  );
}
