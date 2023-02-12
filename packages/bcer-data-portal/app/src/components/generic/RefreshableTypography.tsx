import React, { useState, useEffect }  from 'react';
import {makeStyles, Typography } from '@material-ui/core'

interface RefreshableTypographyProps {
  value: string,
  refresh?: string;
}

const useStyles = makeStyles(() => ({
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
  }
}));
  
export default function RefreshableTypography({value, refresh} : RefreshableTypographyProps) {
  const classes = useStyles();
  const [refreshPage,torefreshPage]=useState('');

  useEffect(() => {
    if(refresh){
      console.log("refreshed")
    }
 }, [refresh])

  return (
    <Typography className={classes.rowContent} key={refresh}>{value}</Typography> 
  );
}

