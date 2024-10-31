import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Paper, Box } from '@mui/material';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
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
import { styled } from '@mui/material/styles';

const PREFIX = 'DeleteProductSubmission';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  box: `${PREFIX}-box`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  csvLink: `${PREFIX}-csvLink`,
  submitWrapper: `${PREFIX}-submitWrapper`,
  checkboxLabel: `${PREFIX}-checkboxLabel`,
  highlightedText: `${PREFIX}-highlightedText`,
};

const StyledButtonWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledIcon = styled('span')({
  paddingRight: '5px',
  color: '#285CBC',
});

const StyledTitle = styled(Typography)({
  padding: '20px 0px',
  color: '#002C71',
});

const StyledHelpTextWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#E0E8F0',
  marginBottom: '30px',
  borderRadius: '5px',
});

const StyledHelperIcon = styled(ChatBubbleOutlineIcon)({
  fontSize: '45px',
  color: '#0053A4',
  paddingRight: '25px',
});

const StyledBox = styled(Paper)({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
  marginBottom: '20px',
});

const StyledBoxTitle = styled(Typography)({
  paddingBottom: '10px',
});

const StyledTableRowCount = styled(Typography)({
  paddingBottom: '10px',
});

const StyledActionsWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '10px',
});

const StyledCSVLink = styled(CSVLink)({
  textDecoration: 'none',
});

const StyledSubmitWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: '30px',
});

const StyledCheckboxLabel = styled('div')({
  marginTop: '20px',
});

const StyledHighlightedText = styled('span')({
  fontWeight: 600,
  color: '#0053A4',
});

export default function DeleteProductSubmissions() {
  const navigate = useNavigate();
  const [submissionDate, setSubmissionDate] = useState<string>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [notAffectedLocations, setNotAffectedLocations] = useState<BusinessLocation[]>([]);
  const { submissionId } = useParams<{ submissionId: string }>() as { submissionId: string };

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
      navigate('/products');
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
        <StyledButtonWrapper>
          <StyledIcon>
            <ArrowBackIcon />
          </StyledIcon>
          <StyledButton onClick={() => navigate('/products')}>Cancel</StyledButton>
        </StyledButtonWrapper>
        <StyledTitle variant="h5">Delete Products in Submission</StyledTitle>
        <StyledHelpTextWrapper>
          <StyledHelperIcon />
          <Typography variant="body1">
            On this page, you can review and delete a product report. If you have
            submitted this product report in error, or you have accidentally
            resubmitted your entire list of products (instead of just the new
            ones), you can select “delete” and upload a new product report that
            contains the correct information.{' '}
            <StyledHighlightedText>
              Please note that this will delete the product report from all
              locations that are currently attached to it.
            </StyledHighlightedText>
          </Typography>
        </StyledHelpTextWrapper>
        <StyledBox variant="outlined">
          <StyledBoxTitle variant="subtitle1">Products in this Submission</StyledBoxTitle>
          <StyledActionsWrapper>
            <StyledTableRowCount variant="body2">
              {productsAndLocations?.products?.length || 0} products found,
              submitted on {submissionDate}
            </StyledTableRowCount>
            {productsAndLocations?.products?.length ? (
              <StyledCSVLink
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
                  <SaveAltIcon />
                  Download CSV
                </StyledButton>
              </StyledCSVLink>
            ) : null}
          </StyledActionsWrapper>
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
              data={productsAndLocations ? productsAndLocations.products : []}
            />
          </div>
        </StyledBox>
  
        <StyledBox variant="outlined">
          <StyledBoxTitle variant="subtitle1">All Locations</StyledBoxTitle>
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
                  <StyledTableRowCount variant="body2">
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
                  </StyledTableRowCount>
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
                        : productsAndLocations?.locations ?? []
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </StyledBox>
  
        <StyledSubmitWrapper>
          <StyledButton
            variant="contained"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </StyledButton>
        </StyledSubmitWrapper>
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