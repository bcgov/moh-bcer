import TableWrapper from '@/components/generic/TableWrapper';
import ProductTable from '@/components/productReport/ProductTable';
import { GenericTableProp } from '@/constants/localInterfaces';
import { ProductUtil } from '@/utils/product.util';
import React from 'react';

export interface ProductTableProps extends GenericTableProp {
  locationId: string;
}

function ViewProductsTable({
  data,
  fullScreenProp,
  locationId,
}: ProductTableProps) {
  return (
    <TableWrapper
      data={data}
      fullScreenProp={fullScreenProp}
      tableHeader="Product List"
      tableSubHeader={data ? `${data?.length || 0} Products found` : ''}
      csvProps={
        data?.length ? ProductUtil.getCsvProp(data, 'products_list') : null
      }
    >
      <ProductTable locationId={locationId} />
    </TableWrapper>
  );
}

export default ViewProductsTable;
