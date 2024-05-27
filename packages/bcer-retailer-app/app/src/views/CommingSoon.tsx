import React from "react";
import { styled } from '@mui/material/styles';
import { makeStyles, Typography } from "@mui/material";

const PREFIX = 'CommingSoon';

const classes = {
  parent: `${PREFIX}-parent`,
  warningTextContainer: `${PREFIX}-warningTextContainer`
};

const Root = styled('div')({
  [`&.${classes.parent}`]: {
    padding: "1rem 2rem",
    overflowY: "auto",
  },
  [`& .${classes.warningTextContainer}`]: {
    background: "#f9f1c6",
    padding: ".5rem 1rem",
    height: "91px",
    display: "flex",
    width: "90%",
    borderRadius: "4px",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
});

export default function CommingSoon() {


  return (
    <Root className={classes.parent}>
      <Typography variant="h5">Important Notice To Be Aware Of</Typography>
      <div className={classes.warningTextContainer}>
        This functionality is not yet available and will be coming soon.
      </div>
    </Root>
  );
}
