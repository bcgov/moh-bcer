import { DialogProps } from "@material-ui/core";
import { ReactEventHandler } from "react";

export interface StyledDialogProps extends DialogProps {
  title: string,
  cancelButtonText: string,
  acceptButtonText: string,
  cancelHandler: ReactEventHandler,
  acceptHandler: ReactEventHandler | "submit",
  acceptDisabled?: boolean,
  cancelDisabled?: boolean,
}

export interface StyledConfirmDialogProps extends DialogProps {
  setOpen: Function,
  confirmHandler: Function,
  dialogMessage: string,
  checkboxLabel: string,
  dialogTitle: string,
  acceptDisabled?: boolean,
  cancelDisabled?: boolean,
}

export interface StyledDialogActionProps {
  cancelDisabled?: boolean;
  acceptDisabled?: boolean;
  cancelButtonText: string,
  acceptButtonText: string,
  cancelHandler: ReactEventHandler,
  acceptHandler: ReactEventHandler | "submit",
}