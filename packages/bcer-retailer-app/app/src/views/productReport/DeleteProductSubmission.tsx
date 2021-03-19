import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import moment from 'moment';

import { StyledTable, StyledButton, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { Products } from '@/constants/localInterfaces';
import { ProductReportHeaders } from '@/constants/localEnums';
import { useAxiosDelete, useAxiosGet } from '@/hooks/axios';

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

export default function DeleteProductSubmissions() {
  const classes = useStyles();
  const history = useHistory();
  const [submissionDate, setSubmissionDate] = useState<string>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const { submissionId } : { submissionId: string } = useParams();

  const [{ data: products = [] }] = useAxiosGet(`/products?submissionId=${submissionId}`);
  const [{}, request] = useAxiosDelete(`/products/submission/${submissionId}`, { manual: true });

  useEffect(() => {
    if (!!products.length) {
      setSubmissionDate(moment(products[0].created_at).format('LLL'));
    }
  }, [products]);

  
  const confirmDelete = async() => {
    await request();
    history.push('/products');
  }

  return (
    <>
      <div>
        <StyledButton onClick={() => history.push('/products/add-reports')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Products in this Submission
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
            These products were submitted on {submissionDate}
          </Typography>
        </div>
        <Paper className={classes.box} variant='outlined'>
          <Typography className={classes.boxTitle} variant='subtitle1'>Products in this Submission</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>{products?.length} products found</Typography>
            {
              products?.length
              ?
                <CSVLink
                  headers={Object.keys(ProductReportHeaders)}
                  data={products?.map((p: Products) => {
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
                  }).filter((p: Products) => !!p)}
                  filename={'products.csv'} className={classes.csvLink} target='_blank'>
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
              data={products}
            />
          </div>
        </Paper>
        <div>
        </div>
        <div className={classes.submitWrapper}>
          <StyledButton
            variant='contained'
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </StyledButton>
        </div>
      </div>
      <StyledConfirmDialog
        open={deleteConfirmOpen}
        maxWidth='sm'
        dialogTitle="Confirm Deletion of Submission"
        checkboxLabel='I understand that this action is final and confirm that I am deleting the products above. Locations that were using these products will no longer have them listed.'
        dialogMessage='You are about to delete these products'
        setOpen={() => setDeleteConfirmOpen(false)}
        confirmHandler={confirmDelete}
      />
    </>
  );
}
