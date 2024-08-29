import { ButtonProps } from "@mui/material";

export interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
  variant: "text" | "outlined" | "contained" | "dialog-accept" | "dialog-cancel" | "table" | "small-outlined" | "small-contained" | undefined
}