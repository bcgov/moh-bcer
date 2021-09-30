import React from "react";
import { makeStyles } from "@material-ui/core";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";

const useStyles = makeStyles({
  helpTextWrapper: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#E0E8F0",
    marginBottom: "20px",
    borderRadius: "5px",
  },
  helperIcon: {
    fontSize: "45px",
    color: "#0053A4",
    paddingRight: "25px",
  },
  helperText: {
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
  const classes = useStyles();
  return (
    <div className={classes.helpTextWrapper}>
      <ChatBubbleOutlineIcon className={classes.helperIcon} />
      <div className={classes.helperText}>{content}</div>
    </div>
  );
}
