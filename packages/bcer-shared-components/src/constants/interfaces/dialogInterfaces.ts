import { DialogProps } from "@mui/material";
import { ReactEventHandler } from "react";

export interface StyledDialogProps extends DialogProps {
  title: string,
  cancelButtonText: string,
  acceptButtonText: string,
  cancelHandler: ReactEventHandler,
  acceptHandler: ReactEventHandler | "submit",
  acceptDisabled?: boolean,
  cancelDisabled?: boolean,
  showCancelButton?: boolean,
}

export interface StyledConfirmDialogProps extends DialogProps {
  setOpen: Function,
  confirmHandler: Function,
  dialogMessage: string,
  checkboxLabel: string,
  dialogTitle: string,
  acceptDisabled?: boolean,
  cancelDisabled?: boolean,
  acceptButtonText?: string,
  showCancelButton?: boolean,
}

export interface StyledDialogActionProps {
  cancelDisabled?: boolean;
  acceptDisabled?: boolean;
  cancelButtonText: string,
  acceptButtonText: string,
  cancelHandler: ReactEventHandler,
  acceptHandler: ReactEventHandler | "submit",
  showCancelButton?: boolean,
}

export interface StyledConfirmDateDialogProps extends StyledConfirmDialogProps {
  dateLabel: string;
  maxDate?: Date;
  minDate?: Date;
}