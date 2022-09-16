import { ProductReportHeaders } from '@/constants/localEnums';
import { Products, TableColumn } from '@/constants/localInterfaces';

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

  static readonly columns: Array<TableColumn> = [
    { title: 'Type of product', field: 'type' },
    { title: 'Brand name', field: 'brandName' },
    { title: 'Product name', field: 'productName' },
    { title: "Manufacturer's name", field: 'manufacturerName' },
    { title: 'Manufacturer Contact Person', field: 'manufacturerContact' },
    { title: "Manufacturer's address", field: 'manufacturerAddress' },
    { title: "Manufacturer's phone", field: 'manufacturerPhone' },
    { title: "Manufacturer's email", field: 'manufacturerEmail' },
    { title: 'Concentration (mg/mL)', field: 'concentration' },
    { title: 'Container capacity (ml)', field: 'containerCapacity' },
    { title: 'Cartridge capacity (ml)', field: 'cartridgeCapacity' },
    { title: 'Ingredients', field: 'ingredients' },
    { title: 'Flavour', field: 'flavour' },
  ];

  static readonly mapFields = {
    type: 'Type',
    brandName: 'Brand name',
    productName: 'Product name',
    manufacturerName: `Manufacturer's name`,
    manufacturerContact: `Manufacturer's Contact Person`,
    manufacturerAddress: `Manufacturer's address`,
    manufacturerPhone: `Manufacturer's phone`,
    manufacturerEmail: `Manufacturer's email`,
    concentration: 'Concentration (mg/mL)',
    containerCapacity: 'Container capacity (ml)',
    cartridgeCapacity: 'Cartridge capacity (ml)',
    ingredients: 'Ingredients',
    flavour: 'Flavour',
  };
}
