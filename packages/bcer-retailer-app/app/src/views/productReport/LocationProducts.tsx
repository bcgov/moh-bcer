import LocationDetails from '@/components/Location/LocationDetails';
import { Box, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { StyledButton } from 'vaping-regulation-shared-components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BusinessLocation, Products } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/utils/formatting';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import ViewProductsTable from './ViewProductsTable';
import FullScreen from '@/components/generic/FullScreen';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
});

function LocationProducts() {
  const classes = useStyles();
  const history = useHistory();
  const fullScreenProps = useState(false);
  const { locationId }: { locationId: string } = useParams();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const [{ data: products, error: productError }, getProducts] = useAxiosGet<
    [Products[], number]
  >(`/products/location/${locationId}`, { manual: true });

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (productError) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(productError),
      });
    }
  }, [productError]);

  return (
    <Box>
      <StyledButton onClick={() => history.goBack()}>
        <ArrowBackIcon className={classes.buttonIcon} />
        Back
      </StyledButton>
      <Box mt={2} />
      <LocationDetails id={locationId} />
      <Box mt={2} />
      <FullScreen fullScreenProp={fullScreenProps}>
        <ViewProductsTable
          data={products ? products[0] : []}
          fullScreenProp={fullScreenProps}
          locationId={locationId}
        />
      </FullScreen>
    </Box>
  );
}

export default LocationProducts;
