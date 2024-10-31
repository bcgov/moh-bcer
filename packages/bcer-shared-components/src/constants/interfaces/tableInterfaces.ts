import { MaterialTableProps } from "@material-table/core";

export interface StyledTableProps extends MaterialTableProps<any> {
  isEditable?: boolean;
  editHandler?: Function;
  deleteHandler?: Function;
}