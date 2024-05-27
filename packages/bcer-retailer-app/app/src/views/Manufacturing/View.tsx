import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';

import { useAxiosGet } from '@/hooks/axios';
import { Box, Grid, makeStyles, Typography, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { HealthAuthorities } from '@/constants/localEnums';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import Delete from './Delete';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';

const PREFIX = 'View';

const classes = {
  box: `${PREFIX}-box`,
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  boxTitle: `${PREFIX}-boxTitle`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    margin: '30px 0',
  },
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71'
  },
  [`& .${classes.boxTitle}`]: {
    paddingBottom: '10px'
  },
});

export default function ManufacturingReport() {

  const navigate = useNavigate();
  const { reportId } = useParams<{reportId: string}>();
  const viewFullscreenTable = useState<boolean>(false)
  const [{ data: report, loading, error }] = useAxiosGet(`/manufacturing/${reportId}`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])

  return loading ? <CircularProgress /> : (
    (<Root>
      <div>
        <StyledButton onClick={() => navigate('/manufacturing')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Back
        </StyledButton>
        <FullScreen fullScreenProp={viewFullscreenTable}>
          <TableWrapper
            blockHeader={<Typography className={classes.title} variant='h5'>Manufacturing Report</Typography>}
            data={report.ingredients}
            fullScreenProp={viewFullscreenTable}
            isOutlined={false}
          >
            <div>
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
          </TableWrapper>
        </FullScreen>
        {report.locations.map((location: BusinessLocation) => (
          <Paper className={classes.box} variant='outlined' key={location.id}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.boxTitle} variant='h6'>Retailer Location</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='body1'>Address</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='subtitle1'>{location.addressLine1}</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='body1'>Email address</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='subtitle1'>{location.email}</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='body1'>Phone number</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='subtitle1'>{location.phone}</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='body1'>If persons under 19 are permitted on sales premis</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='subtitle1'>{location.underage}</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='body1'>Regional health authority the sales premise is located in</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='subtitle1'>{HealthAuthorities[location.health_authority]}</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='body1'>Do you intend to manufacture any e-substances that will also be for sale at this location</Typography></Box>
              </Grid>
              <Grid item xs={6}>
                <Box mb={2}><Typography variant='subtitle1'>{location.manufacturing ? 'Yes' : 'No'}</Typography></Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Box mt={2} display='flex' justifyContent='flex-end'>
          <Delete reportId={reportId}/>
        </Box>
      </div>
    </Root>)
  );
}
