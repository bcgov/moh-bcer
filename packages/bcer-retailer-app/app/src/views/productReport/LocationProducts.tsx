import LocationDetails from '@/components/Location/LocationDetails';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from 'vaping-regulation-shared-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Products } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/utils/formatting';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import ViewProductsTable from './ViewProductsTable';
import FullScreen from '@/components/generic/FullScreen';

const PREFIX = 'LocationProducts';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`
};

const StyledBox = styled(Box)({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },
});

function LocationProducts() {
  const navigate = useNavigate();
  const fullScreenProps = useState(false);
  const { locationId }: { locationId?: string } = useParams();
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
    <StyledBox>
      <StyledButton onClick={() => navigate(-1)}>
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
    </StyledBox>
  );
}

export default LocationProducts;
