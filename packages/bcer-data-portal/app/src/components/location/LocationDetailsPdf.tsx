import { BusinessLocation } from "@/constants/localInterfaces"
import React from "react";
import { Box, Typography, makeStyles } from '@material-ui/core';
import logo from '../../assets/images/bc-logo.png';

const useStyles = makeStyles((theme) => ({
    container: {
      width: 535,
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    },
    logo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      paddingBottom: 20
    },
    header: {
      fontSize: 14,
      color: '#002C71',
      fontWeight: 'bold',
    },
    rowContent: {
        fontSize: '14px',
        fontWeight: 600,
    },
    cellTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#0053A4',
        paddingBottom: '12px'
    },
    box: {
        display: 'flex',
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
        boxShadow: 'none',
        justifyContent: 'space-between',    
    },
    locationStatusImg: {
        height: 215, 
        width: 540,
        [theme.breakpoints.down('xs')] : {
            height: 250
        }
    }
}));

type LocationDetailsPdfProps = {
    location: BusinessLocation,
    locationStatusImg: string,
    userInfoImg: string,
    locationInfoImg: string
}

export function LocationDetailsPdf({ location, locationStatusImg, userInfoImg, locationInfoImg } : LocationDetailsPdfProps) {
    const classes = useStyles();
    return (
        <Box className={classes.container}>
            <div className={classes.logo}>
                <img src={logo} alt="BC Logo" style={{height: '70px', width: '90px'}} />
                <Typography className={classes.header} style={{ fontSize: '16px'}}>E-Substances Regulation</Typography>
            </div>  

            <Typography className={classes.header}>{location.business.businessName}</Typography>

            <img src={locationStatusImg} alt="Location Status Screenshot" className={classes.locationStatusImg} />

            <img src={userInfoImg} alt="User Information Screenshot" style={{ height: '80px', width: '540px'}} />

            <img src={locationInfoImg} alt="Location Information Screenshot" style={{ height: '280px', width: '540px'}} />
            
        </Box>
    )
}