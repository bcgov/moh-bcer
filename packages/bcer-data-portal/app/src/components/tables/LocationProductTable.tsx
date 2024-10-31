import React, { useContext, useEffect, useState } from 'react';
import { Products } from '@/constants/localInterfaces';
import { StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import { Box, LinearProgress, Typography } from '@mui/material';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';

function LocationProductTable({ locationId }: { locationId: string }) {
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const [query, setQuery] = useState({
    page: 0,
    perPage: 5,
  });
  const [{ data: products, error: productError, loading: productsLoading }, getProducts] = useAxiosGet<
    [Products[], number]
  >(`/data/products/location/${locationId}?page=1&perPage=5`, { manual: true });

  useEffect(() => {
    let url = `/data/products/location/${locationId}?page=${
      query.page + 1
    }&perPage=${query.perPage || 5}`;
    getProducts({
      url: url,
    });
  }, [query]);


  useEffect(() => {
    showNetworkErrorMessage(productError)
  }, [productError]);

  return (
    <>
      <Typography variant="body2" style={{ paddingBottom: '8px' }}>
        {products ? products[1] : 0} products submitted
      </Typography>
      <StyledTable
        data={products ? products[0] : []}
        columns={[
          { title: 'Type of product', field: 'type' },
          { title: 'Brand name', field: 'brandName' },
          { title: 'Product name', field: 'productName' },
          { title: "Manufacturer's name", field: 'manufacturerName' },
          {
            title: 'Manufacturer Contact Person',
            field: 'manufacturerContact',
          },
          { title: "Manufacturer's address", field: 'manufacturerAddress' },
          { title: "Manufacturer's phone", field: 'manufacturerPhone' },
          { title: "Manufacturer's email", field: 'manufacturerEmail' },
          { title: 'Concentration (mg/mL)', field: 'concentration' },
          { title: 'Container capacity (ml)', field: 'containerCapacity' },
          { title: 'Cartridge capacity (ml)', field: 'cartridgeCapacity' },
          { title: 'Ingredients', field: 'ingredients' },
          { title: 'Flavour', field: 'flavour' },
        ]}
        totalCount={products ? products[1] : 0}
        page={query.page}
        onChangePage={(page: number) => {
          setQuery({
            ...query,
            page: page,
          });
        }}
        onChangeRowsPerPage={(rowsPerPage: number) => {
          setQuery({
            ...query,
            perPage: rowsPerPage,
          });
        }}
      />
    </>
  );
}

export default LocationProductTable;
