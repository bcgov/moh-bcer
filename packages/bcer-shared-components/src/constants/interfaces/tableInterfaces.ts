import { MaterialTableProps } from "material-table";

export interface StyledTableProps extends  MaterialTableProps<any> {
  isEditable?: boolean;
  editHandler?: Function;
  deleteHandler?: Function;
}