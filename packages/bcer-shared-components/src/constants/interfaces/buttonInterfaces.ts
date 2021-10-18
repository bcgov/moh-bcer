import { ButtonProps } from "@material-ui/core";

export interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
  variant: "text" | "outlined" | "contained" | "dialog-accept" | "dialog-cancel" | "table" | undefined
}