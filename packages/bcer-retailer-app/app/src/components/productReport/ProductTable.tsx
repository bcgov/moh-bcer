import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Products } from '@/constants/localInterfaces';
import { StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { QueryResult } from '@material-table/core';
import { ProductUtil } from '@/utils/product.util';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';

function ProductTable({ locationId }: { locationId: string }) {
   const { showNetworkErrorMessage } = useNetworkErrorMessage();
  // Since StyledTable uses a Ref, it will not rerender without direct interference
  const tableRef = useRef<any>(); //rerender the table when data is updated

  const [query, setQuery] = useState({
    page: 0,
    perPage: 5,
  });
  const [{ data: products, error: productError }, getProducts] = useAxiosGet<
    [Products[], number]
  >(`/products/location/${locationId}?page=1&perPage=5`, { manual: true });

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
      let url = `/products/location/${locationId}?page=${
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
    <StyledTable
      tableRef={tableRef}
      data={fetchProductsCallback}
      columns={ProductUtil.columns}
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
  );
}

export default ProductTable;
