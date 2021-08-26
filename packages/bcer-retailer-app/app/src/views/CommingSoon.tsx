import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

import clockIcon from "@/assets/images/clock.png";
import sendIcon from "@/assets/images/send.png";

const useStyles = makeStyles({
  parent: {
    padding: "1rem 2rem",
    overflowY: "auto",
  },
  warningTextContainer: {
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
  const classes = useStyles();

  return (
    <div className={classes.parent}>
      <Typography variant="h5">Important Notice To Be Aware Of</Typography>
     
      <div className={classes.warningTextContainer}>
      This functionality is not yet available and will be coming soon.
      </div>

    </div>
  );
}
