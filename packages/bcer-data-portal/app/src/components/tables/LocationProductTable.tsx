import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Products } from '@/constants/localInterfaces';
import { StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { Typography } from '@mui/material';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import { QueryResult } from '@material-table/core';

function LocationProductTable({ locationId }: { locationId: string }) {
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  // Since StyledTable uses a Ref, it will not rerender without direct interference
  const tableRef = useRef<any>(); //rerender the table when data is updated
  const [query, setQuery] = useState({
    page: 0,
    perPage: 5,
  });

  const [{ data: products, error: productError }, getProducts] = useAxiosGet<
    [Products[], number]
  >(`/data/products/location/${locationId}?page=1&perPage=5`, { manual: true });

  // Call back to help render the page and data correctly
  const fetchProductsCallback = useCallback(
    (): Promise<QueryResult<Products>> =>
      new Promise((resolve) => {

        // if we received the products, time to return the data and finish the callback
        if (products) {
          resolve({
            data: products[0] ? products[0] : [],
            page: query.page,
            totalCount: products[1],
          });
        }
      }),
    [products, query.page]
  );

  // When query changes then we fetch the data
  useEffect(() => {
    const fetchProducts = async () => {
      let url = `/data/products/location/${locationId}?page=${
        query.page + 1
      }&perPage=${query.perPage || 5}`;
      getProducts({
        url: url,
      });
    };
    fetchProducts();
  }, [query, getProducts, locationId]);

  useEffect(() => {
    if (products) {
      if (tableRef.current) {
        tableRef.current.onQueryChange();
      } //rerender the table when data is updated
    }
  }, [products]);

  useEffect(() => {
    showNetworkErrorMessage(productError);
  }, [productError, showNetworkErrorMessage]);

  return (
    <>
      <Typography variant="body2" style={{ paddingBottom: '8px' }}>
        {products ? products[1] : 0} products submitted
      </Typography>
      <StyledTable
        tableRef={tableRef}
        data={fetchProductsCallback}
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
        options={{
          pageSize: query.perPage,
          paging: true,
        }}
        onPageChange={(page: number, pageSize: number) => {
          setQuery({
            ...query,
            page: page,
            perPage: pageSize,
          });
        }}
      />
    </>
  );
}

export default LocationProductTable;