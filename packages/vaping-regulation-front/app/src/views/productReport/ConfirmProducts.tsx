import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt'

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { Products } from '@/constants/localInterfaces';
import { BusinessLocationHeaders, ProductReportHeaders } from '@/constants/localEnums';
import { ProductInfoContext } from '@/contexts/ProductReport';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
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
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
  checkboxLabel: {
    marginTop: '20px'
  },
});

export default function ConfirmProducts() {
  const classes = useStyles();
  const history = useHistory();

  const [productInfo, setProductInfo] = useContext(ProductInfoContext);

  return (
    <>
      <div>
        <StyledButton onClick={() => history.push('/products/add-reports')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Confirm Product List
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
            Please confirm that your product list file has imported correctly. 
            Once you confirm your product file, press the "Next" button to select which location(s) 
            this product list applies to.
          </Typography>
        </div>
        <Paper className={classes.box} variant='outlined'>
          <Typography className={classes.boxTitle} variant='subtitle1'>Confirm Product List</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>{productInfo?.products?.length} products found</Typography>
            {
              productInfo?.products?.length
              ?
                <CSVLink
                  headers={Object.keys(ProductReportHeaders)}
                  data={productInfo?.products?.map((p: Products) => {
                      return [
                        p.type,
                        p.brandName, 
                        p.productName, 
                        p.manufacturerName, 
                        p.manufacturerContact,
                        p.manufacturerAddress, 
                        p.manufacturerEmail, 
                        p.manufacturerPhone, 
                        p.concentration, 
                        p.containerCapacity, 
                        p.cartridgeCapacity, 
                        p.ingredients, 
                        p.flavour, 
                      ];
                  }).filter(p => !!p)}
                  filename={'product_report.csv'} className={classes.csvLink} target='_blank'>
                  <StyledButton variant='outlined'>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              : null
            }
          </div>
          <div style={{ overflowX: 'auto' }}>
            <StyledTable
              columns={[
                {title: 'Type of product', field: 'type'},
                {title: 'Brand name', field: 'brandName'},
                {title: 'Product name', field: 'productName'},
                {title: "Manufacturer's name", field: 'manufacturerName'},
                {title: "Manufacturer Contact", field: 'manufacturerContact'},
                {title: "Manufacturer's address", field: 'manufacturerAddress'},
                {title: "Manufacturer's phone", field: 'manufacturerPhone'},
                {title: "Manufacturer's email", field: 'manufacturerEmail'},
                {title: "Concentration (mg/mL)", field: 'concentration'},
                {title: "Container capacity (ml)", field: 'containerCapacity'},
                {title: "Cartridge capacity (ml)", field: 'cartridgeCapacity'},
                {title: "Ingredients", field: 'ingredients'},
                {title: "Flavour", field: 'flavour'},
              ]}
              data={productInfo?.products}
            />
          </div>
        </Paper>
        <div>
        </div>
        <div className={classes.submitWrapper}>
          <StyledButton
            variant='contained'
            onClick={() => history.push('/products/select-locations')}
          >
            Next
          </StyledButton>
        </div>
      </div>
    </>
  );
}
