import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CircularProgress, makeStyles, Typography, Paper } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import moment from 'moment';

import { StyledTable, StyledButton, LocationType } from 'vaping-regulation-shared-components';
import { Products, BusinessLocation, BusinessDetails, ManufacturingReport, Ingredient, Sale } from '@/constants/localInterfaces';
import { ManufacturingReportHeaders, ProductReportHeaders, SalesReportHeaders } from '@/constants/localEnums';
import { useAxiosGet } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    marginBottom: '20px',
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
  boxRow: {
    display: 'flex',
    paddingBottom: '20px',
  },
  rowTitle: {
    fontSize: '14px',
    color: '#424242',
    width: '300px'
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#3A3A3A',
  },
  reportCell: {
    paddingBottom: '20px'
  }
});

export default function ConfirmProducts() {
  const classes = useStyles();
  const history = useHistory();
  const { reportId }:{reportId:string} = useParams();
  const [sales, setSales] = useState<any>([]); // TODO: TYPING
  const [{ data: location, loading, error }, getLocation] = useAxiosGet<BusinessLocation>(`/location/${reportId}?includes=products,manufactures,manufactures.ingredients,noi,sales,sales.productSold`, {manual: true});
  const [{ data: business, loading: businessLoading, error: businessError }, getBusiness] = useAxiosGet<BusinessDetails>(`/business`, {manual: true});
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)});
    }
  }, [error]);

  useEffect(() => {
    if (businessError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(businessError)});
    }
  }, [businessError]);

  useEffect(() => {
    getLocation()
    getBusiness()
  }, [])

  const formatDate = (year: string) => {
    const startDate = moment(`10-01-${year}`, 'MM-DD-YYYY').format('LL');
    const endDate = moment(`09-30-${year}`, 'MM-DD-YYYY').add(1, 'year').format('LL');
    return `${startDate} - ${endDate}`;
  }

  return (
    <>
    {
      location && business
        ?
          <div>
            <StyledButton onClick={() => history.goBack()}>
              <ArrowBackIcon className={classes.buttonIcon} />
              Back
            </StyledButton>
            <Typography variant='h5'  className={classes.title}>
              Location: {location.addressLine1}
            </Typography>
            <Paper className={classes.box} variant='outlined'>
              <Typography className={classes.boxTitle} variant='subtitle1'>Business Details</Typography>
              <div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Legal name of business
                  </div>
                  <div className={classes.rowContent}>
                    {business.legalName}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Name under which business is conducted
                  </div>
                  <div className={classes.rowContent}>
                    {business.businessName}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business address line 1
                  </div>
                  <div className={classes.rowContent}>
                    {business.addressLine1}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business address line 2
                  </div>
                  <div className={classes.rowContent}>
                    {business.addressLine2}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    City
                  </div>
                  <div className={classes.rowContent}>
                    {business.city}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Postal code
                  </div>
                  <div className={classes.rowContent}>
                    {business.postal}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Province
                  </div>
                  <div className={classes.rowContent}>
                    {business.province}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business phone number
                  </div>
                  <div className={classes.rowContent}>
                    {business.phone}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business email
                  </div>
                  <div className={classes.rowContent}>
                    {business.email}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business web page (optional)
                  </div>
                  <div className={classes.rowContent}>
                    {business.webpage}
                  </div>
                </div>
              </div>
            </Paper>
            <Paper className={classes.box} variant='outlined'>
              <Typography className={classes.boxTitle} variant='subtitle1'>Retailer Location</Typography>
              <div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    {location.location_type === LocationType.online ? "Webpage":"Address"}
                  </div>
                  <div className={classes.rowContent}>
                    {location.location_type === LocationType.online ? location.webpage: `${location?.addressLine1}, ${location?.postal}, ${location?.city}`}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Email address
                  </div>
                  <div className={classes.rowContent}>
                    {location?.email}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Phone number
                  </div>
                  <div className={classes.rowContent}>
                    {location?.phone}
                  </div>
                </div>
                {location.location_type !== LocationType.online &&
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Persons under 19 permitted?
                  </div>
                  <div className={classes.rowContent}>
                    {
                      location?.underage
                    }
                  </div>
                </div>}
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Doing business as
                  </div>
                  <div className={classes.rowContent}>
                    {location?.doingBusinessAs}
                  </div>
                </div>
                {location.location_type !== LocationType.online &&
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Region
                  </div>
                  <div className={classes.rowContent}>
                    {location?.health_authority}
                  </div>
                </div>}
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Intent to manufacture
                  </div>
                  <div className={classes.rowContent}>
                    {location?.manufacturing}
                  </div>
                </div>
              </div>
            </Paper>
            <Paper className={classes.box} variant='outlined'>
              <Typography className={classes.boxTitle} variant='subtitle1'>Product List</Typography>
              <div className={classes.actionsWrapper}>
                <Typography className={classes.tableRowCount} variant='body2'>{location?.products?.length} products found</Typography>
                {
                  location?.products?.length
                  ?
                    <CSVLink
                      headers={Object.keys(ProductReportHeaders)}
                      data={location?.products?.reduce((list: Array<string[]>, p: Products) => {
                          list.push([
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
                          ]);
                          return list;
                      }, [])}
                      filename={'products_list.csv'} className={classes.csvLink} target='_blank'>
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
                    {title: "Container capacity (ml)", field: 'productCapacity'},
                    {title: "Cartridge capacity (ml)", field: 'cartridgeCapacity'},
                    {title: "Ingredients", field: 'ingredients'},
                    {title: "Flavour", field: 'flavour'},
                  ]}
                  data={location?.products}
                />
              </div>
            </Paper>
            <Paper className={classes.box} variant='outlined'>
              <Typography className={classes.boxTitle} variant='h6'>Manufacturing Reports</Typography>
                  {
                    location?.manufactures?.length
                      ?
                    location?.manufactures?.map((report) => (
                      <div className={classes.reportCell}>
                        <Typography variant='subtitle1'>{report.productName}</Typography>
                        <div className={classes.actionsWrapper}>
                          <Typography className={classes.tableRowCount} variant='body2'>
                            You have {report?.ingredients?.length} ingredients.
                          </Typography>
                          {
                            report.ingredients.length
                              ?
                                <CSVLink
                                  headers={Object.keys(ManufacturingReportHeaders)}
                                  data={
                                    report.ingredients.reduce((dataList: Array<any>, i: Ingredient) => {
                                      dataList.push([i.name, i.scientificName, i.manufacturerName, i.manufacturerAddress, i.manufacturerEmail, i.manufacturerPhone]);
                                      return dataList;
                                    }, [])
                                  }
                                  filename={`${report.productName}-manufacturing-report.csv`} className={classes.csvLink} target='_blank'>
                                  <StyledButton variant='outlined'>
                                    <SaveAltIcon className={classes.buttonIcon} />
                                    Download CSV
                                  </StyledButton>
                                </CSVLink>
                              :
                                null
                          }
                        </div>
                        <StyledTable
                          data={report.ingredients}
                          columns={[
                            {
                              title: 'Product name',
                              render: () => `${report.productName}`,
                            },
                            {
                              title: 'Ingredient Name',
                              field: 'name',
                            },
                            {
                              title: 'Scientific Name',
                              field: 'scientificName',
                            },
                            {
                              title: 'Manufacturer Name',
                              field: 'manufacturerName',
                            },
                            {
                              title: 'Manufacturer Address',
                              field: 'manufacturerAddress',
                            },
                            {
                              title: 'Manufacturer Email',
                              field: 'manufacturerEmail',
                            },
                            {
                              title: 'Manufacturer Phone',
                              field: 'manufacturerPhone',
                            },
                          ]}
                        />
                      </div>
                    ))
                  : <Typography variant='body1'>No Manufacturing Reports have been submitted for this location.</Typography>
                  }
            </Paper>
            <Paper className={classes.box} variant='outlined'>
              <Typography className={classes.boxTitle} variant='subtitle1'>Sales Reports</Typography>
              <div className={classes.actionsWrapper}>
                <Typography className={classes.tableRowCount} variant='body2'>{location?.products?.length} products found</Typography>
                {
                  location?.sales?.length
                  ?
                    <CSVLink
                      headers={Object.keys(SalesReportHeaders)}
                      data={location?.sales?.reduce((list: Array<string[]>, s: Sale) => {
                          list.push([
                            s.productSold.brandName,
                            s.productSold.productName, 
                            s.productSold.flavour, 
                            s.productSold.concentration,
                            s.containers, 
                            s.cartridges, 
                          ]);
                          return list;
                      }, [])}
                      filename={'sales_report.csv'} className={classes.csvLink} target='_blank'>
                      <StyledButton variant='outlined'>
                        <SaveAltIcon className={classes.buttonIcon} />
                        Download CSV
                      </StyledButton>
                    </CSVLink>
                  : null
                }
              </div>
              {
                location.sales?.length ?
                Array.from(new Set(location.sales.map(sale => sale.year))).map(year => (
                  <>
                    <div className={classes.reportCell}>
                      <Typography variant='subtitle1'>{formatDate(year)}</Typography>
                      <StyledTable
                        columns={[
                          {title: 'Brand name', field: 'productSold.brandName'},
                          {title: 'Product name', field: 'productSold.productName'},
                          {title: "Flavour", field: 'productSold.flavour'},
                          {title: "Volume", field: 'productSold.concentration'},
                          {title: "Number of Containers Sold", field: 'containers'},
                          {title: "Number of Cartridges Sold", field: 'cartridges'},
                        ]}
                        data={location?.sales.filter(sale => sale.year === year)}
                      />
                    </div>
                  </>
                ))
                : null
              }
            </Paper>
          </div>
        : error ? (
          <div>
            <StyledButton onClick={() => history.goBack()}>
              <ArrowBackIcon className={classes.buttonIcon} />
              Back
            </StyledButton>
            <Typography variant='h5'  className={classes.title}>
              Location: {error.message}
            </Typography>
          </div>
        ) : loading ? <CircularProgress /> : null
      }
    </>
  );
}
