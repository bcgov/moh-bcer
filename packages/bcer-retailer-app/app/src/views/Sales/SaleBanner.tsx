import React from "react";
import { styled } from '@mui/material/styles';
import { makeStyles } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const PREFIX = 'SaleBanner';

const classes = {
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  helperText: `${PREFIX}-helperText`
};

const Root = styled('div')({
  [`&.${classes.helpTextWrapper}`]: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#E0E8F0",
    marginBottom: "20px",
    borderRadius: "5px",
  },
  [`& .${classes.helperIcon}`]: {
    fontSize: "45px",
    color: "#0053A4",
    paddingRight: "25px",
  },
  [`& .${classes.helperText}`]: {
    fontSize: "16px",
    lineHeight: "22px",
    letterSpacing: 0,
    color: "#333",
  },
});

interface IProps {
  content: string | React.ReactElement;
}
export default function SaleBanner({ content = "" }: IProps) {

  return (
    <Root className={classes.helpTextWrapper}>
      <ChatBubbleOutlineIcon className={classes.helperIcon} />
      <div className={classes.helperText}>{content}</div>
    </Root>
  );
}
