import { BCDirectionData, BusinessLocation } from '@/constants/localInterfaces';
import { Grid, List, ListItem, ListItemText, Typography, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';
import logo from '../../assets/images/bc-logo.png';
import { MapUtil } from '@/util/map.util';
import Itinerary from './Itinerary';

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
    itinerary: {
        paddingBottom: 20
    },
    header: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#002C71',
      fontWeight: 'bold',
    },
}));

type ItineraryPdfProps = {
    routeData: BCDirectionData,
    locations: BusinessLocation[],
    imageString: string
}

function ItineraryPdf ({ routeData, locations, imageString }: ItineraryPdfProps) {
    const classes = useStyles();
    console.log(routeData, locations, imageString);
    const formattedData = MapUtil.formatLocationsForPDF(locations, routeData);
    return (
        <Box className={classes.container}>
            <div className={classes.logo}>
                <img src={logo} alt="BC Logo" style={{height: '70px', width: '90px'}} />
                <Typography className={classes.header} style={{ fontSize: '16px'}}>E-Substances Regulation</Typography>
            </div>  
            
            <div className={classes.itinerary}>
                <Typography className={classes.header}>Itinerary</Typography>
                <Box mt={1} />
                <img src={imageString} alt="Itinerary Map" style={{ height: '380px', width: '540px'}} />
            </div>

            <Grid container spacing={2} >
                <Grid item md={6}>
                    <Typography className={classes.header}>Directions</Typography>
                    <Box mt={1} />
                    {formattedData.directions}
                </Grid>
                <Grid item md={6}>
                    <Typography className={classes.header}>Business Location</Typography>
                    <Box mt={1} />
                    {formattedData.locations}
                </Grid>
            </Grid>
        </Box>
    )
}

export default ItineraryPdf