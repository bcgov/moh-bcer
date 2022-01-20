import React, { useContext, useEffect, useState } from 'react';
import { TableColumn, Products } from '@/constants/localInterfaces';
import { StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

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

  const columns: Array<TableColumn> = [
    { title: 'Type of product', field: 'type' },
    { title: 'Brand name', field: 'brandName' },
    { title: 'Product name', field: 'productName' },
    { title: "Manufacturer's name", field: 'manufacturerName' },
    { title: 'Manufacturer Contact', field: 'manufacturerContact' },
    { title: "Manufacturer's address", field: 'manufacturerAddress' },
    { title: "Manufacturer's phone", field: 'manufacturerPhone' },
    { title: "Manufacturer's email", field: 'manufacturerEmail' },
    { title: 'Concentration (mg/mL)', field: 'concentration' },
    { title: 'Container capacity (ml)', field: 'containerCapacity' },
    { title: 'Cartridge capacity (ml)', field: 'cartridgeCapacity' },
    { title: 'Ingredients', field: 'ingredients' },
    { title: 'Flavour', field: 'flavour' },
  ];
  return (
    <StyledTable
      data={products ? products[0] : []}
      columns={columns}
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
