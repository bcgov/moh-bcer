import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Typography, Paper, Box } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import moment from 'moment';

import {
  StyledTable,
  StyledButton,
  StyledConfirmDialog,
  StyledRadioGroup,
} from 'vaping-regulation-shared-components';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { BusinessLocation, Products } from '@/constants/localInterfaces';
import { ProductReportHeaders } from '@/constants/localEnums';
import { useAxiosDelete, useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/utils/formatting';
import { Form, Formik } from 'formik';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71',
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
    marginBottom: '20px',
  },
  boxTitle: {
    paddingBottom: '10px',
  },
  tableRowCount: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px',
  },
  checkboxLabel: {
    marginTop: '20px',
  },
  highlightedText: {
    fontWeight: 600,
    color: '#0053A4',
  },
});

export default function DeleteProductSubmissions() {
  const classes = useStyles();
  const history = useHistory();
  const [submissionDate, setSubmissionDate] = useState<string>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [notAffectedLocations, setNotAffectedLocations] = useState<BusinessLocation[]>([]);
  const { submissionId }: { submissionId: string } = useParams();

  const [{ data: productsAndLocations }, getSubmission] = useAxiosGet(
    `/products?submissionId=${submissionId}`,
    { manual: true }
  );
  const [{ error }, request] = useAxiosDelete(
    `/products/submission/${submissionId}`,
    { manual: true }
  );
  const [{ error: allLocationErr, data: allLocationData }, getLocation] = useAxiosGet<BusinessLocation[]>('/location', { manual: true });

  useEffect(() => {
    if (!!productsAndLocations?.products?.length) {
      setSubmissionDate(
        moment(productsAndLocations?.products[0].created_at).format('LLL')
      );
    }
  }, [productsAndLocations]);

  const confirmDelete = async() => {
    await request();
    if (!error) {
      history.push('/products');
    } else {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error) })
    }
  }

  useEffect(() => {
    if (productsAndLocations && allLocationData) {
      const affectedIds =
        productsAndLocations.locations?.reduce(
          (prev: string[], current: BusinessLocation) => [...prev, current.id],
          []
        ) ?? [];
      const tempNotAffected = allLocationData.filter(
        (l) => !affectedIds.includes(l.id)
      );
      setNotAffectedLocations(tempNotAffected);
    }
  }, [productsAndLocations, allLocationData]);

  useEffect(() => {
    getLocation();
    getSubmission();
  }, []);

  return (
    <>
      <div>
        <StyledButton onClick={() => history.push('/products')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant="h5" className={classes.title}>
          Delete Products in Submission
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant="body1">
            On this page, you can review and delete a product report. If you
            have submitted this product report in error, or you have
            accidentally resubmitted your entire list of products (instead of
            just the new ones), you can select “delete” and upload a new product
            report that contains the correct information.{' '}
            <span className={classes.highlightedText}>
              Please note that this will delete the product report from all
              locations that are currently attached to it.
            </span>
          </Typography>
        </div>
        <Paper className={classes.box} variant="outlined">
          <Typography className={classes.boxTitle} variant="subtitle1">
            Products in this Submission
          </Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant="body2">
              {productsAndLocations?.products?.length || 0} products found,
              submitted on {submissionDate}
            </Typography>
            {productsAndLocations?.products?.length ? (
              <CSVLink
                headers={Object.keys(ProductReportHeaders)}
                data={productsAndLocations?.products
                  ?.map((p: Products) => {
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
                  })
                  .filter((p: Products) => !!p)}
                filename={'products.csv'}
                className={classes.csvLink}
                target="_blank"
              >
                <StyledButton variant="outlined">
                  <SaveAltIcon className={classes.buttonIcon} />
                  Download CSV
                </StyledButton>
              </CSVLink>
            ) : null}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <StyledTable
              columns={[
                { title: 'Type of product', field: 'type' },
                { title: 'Brand name', field: 'brandName' },
                { title: 'Product name', field: 'productName' },
                { title: "Manufacturer's name", field: 'manufacturerName' },
                { title: 'Manufacturer Contact', field: 'manufacturerContact' },
                {
                  title: "Manufacturer's address",
                  field: 'manufacturerAddress',
                },
                { title: "Manufacturer's phone", field: 'manufacturerPhone' },
                { title: "Manufacturer's email", field: 'manufacturerEmail' },
                { title: 'Concentration (mg/mL)', field: 'concentration' },
                {
                  title: 'Container capacity (ml)',
                  field: 'containerCapacity',
                },
                {
                  title: 'Cartridge capacity (ml)',
                  field: 'cartridgeCapacity',
                },
                { title: 'Ingredients', field: 'ingredients' },
                { title: 'Flavour', field: 'flavour' },
              ]}
              data={productsAndLocations?.products}
            />
          </div>
        </Paper>

        <Paper className={classes.box} variant="outlined">
          <Typography className={classes.boxTitle} variant="subtitle1">
            All Locations
          </Typography>
          <Formik
            initialValues={{
              location: 'affected',
            }}
            onSubmit={() => {}}
          >
            {({ values, ...helpers }) => (
              <Form>
                <StyledRadioGroup
                  label={``}
                  name="location"
                  options={[
                    { label: 'Affected locations', value: 'affected' },
                    { label: 'Not Affected Locations', value: 'notAffected' },
                  ]}
                  row={true}
                />
                <div style={{ overflowX: 'auto' }}>
                  <Typography className={classes.tableRowCount} variant="body2">
                    {values.location === 'notAffected' ? (
                      <span>
                        <b>
                          {notAffectedLocations?.length}/
                          {allLocationData?.length}
                        </b>{' '}
                        locations not Affected
                      </span>
                    ) : (
                      <span>
                        <b>
                          {productsAndLocations?.locations?.length}/
                          {allLocationData?.length}
                        </b>{' '}
                        locations affected
                      </span>
                    )}
                  </Typography>
                  <Box mt={1} />
                  <StyledTable
                    columns={[
                      { title: 'Doing Business As', field: 'doingBusinessAs' },
                      { title: 'Address', field: 'addressLine1' },
                      { title: 'City', field: 'city' },
                      { title: 'Postal Code', field: 'postal' },
                      { title: 'Health Authority', field: 'health_authority' },
                    ]}
                    data={
                      values.location === 'notAffected'
                        ? notAffectedLocations
                        : productsAndLocations?.locations
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Paper>

        <div className={classes.submitWrapper}>
          <StyledButton
            variant="contained"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </StyledButton>
        </div>
      </div>
      <StyledConfirmDialog
        open={deleteConfirmOpen}
        maxWidth="sm"
        dialogTitle="Confirm Deletion of Submission"
        checkboxLabel="I understand that this action is final and confirm that I am deleting the products above. Locations that were using these products will no longer have them listed."
        dialogMessage="You are about to delete these products"
        setOpen={() => setDeleteConfirmOpen(false)}
        confirmHandler={confirmDelete}
      />
    </>
  );
}
