import { ProductReportHeaders } from '@/constants/localEnums';
import { Products } from '@/constants/localInterfaces';

export class ProductUtil {
  static getCsvProp(data: ReadonlyArray<Products>, filename: string) {
    if (filename.indexOf('.csv') + 4 !== filename.length) {
      filename = `${filename}.csv`;
    }
    return {
      data: data.reduce((dataList: Array<any>, p: Products) => {
        dataList.push([
          p.type,
          p.brandName,
          p.productName,
          p.manufacturerName,
          p.manufacturerContact,
          p.manufacturerAddress,
          p.manufacturerPhone,
          p.manufacturerEmail,
          p.concentration,
          p.containerCapacity,
          p.cartridgeCapacity,
          p.ingredients,
          p.flavour,
        ]);
        return dataList;
      }, []),
      headers: Object.keys(ProductReportHeaders),
      filename,
    };
  }
}
