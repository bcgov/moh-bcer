import React, { useContext, useEffect, useState } from 'react';
import { TableColumn, Products } from '@/constants/localInterfaces';
import { StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { ProductUtil } from '@/utils/product.util';

function ProductTable({ locationId }: { locationId: string }) {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const [query, setQuery] = useState({
    page: 0,
    perPage: 5,
  });
  const [{ data: products, error: productError }, getProducts] = useAxiosGet<
    [Products[], number]
  >(`/products/location/${locationId}?page=1&perPage=5`, { manual: true });

  useEffect(() => {
    let url = `/products/location/${locationId}?page=${query.page + 1}&perPage=${query.perPage || 5}`;
    getProducts({
      url: url,
    });
  }, [query]);

  useEffect(() => {
    if (productError) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(productError),
      });
    }
  }, [productError]);

 
  return (
    <StyledTable
      data={products ? products[0] : []}
      columns={ProductUtil.columns}
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
  );
}

export default ProductTable;
