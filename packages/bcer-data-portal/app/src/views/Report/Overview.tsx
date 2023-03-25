import React from "react";
import { Box, Paper, Typography, makeStyles } from "@material-ui/core";
import GetAppIcon from '@material-ui/icons/GetApp';
import { useAxiosGet } from "@/hooks/axios";
import { GenerateReport } from "./GenerateReport";
import { ReportTable } from "./ReportTable";

const useStyles = makeStyles((theme) => ({
    contentWrapper: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    content: {
        maxWidth: '1440px',
        width: '95%',
        padding: '20px 30px'
    },
    helpTextWrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#E0E8F0',
        marginBottom: '30px',
        borderRadius: '5px',
    },
    helperIcon: {
        fontSize: '45px',
        color: '#0053A4',
        paddingRight: '25px',
    },
    title: {
        padding: '10px 0px',
        color: '#002C71',
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '10px',
    },
    box: {
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
    },
}));

export default function Report() {
    const classes = useStyles();
    
    const [{ data: reports, error: getError, loading: reportLoading }, getReports] = useAxiosGet(
        '/data/report'
    );

    return (
        <Box className={classes.contentWrapper}>
            <Box className={classes.content}>
                <div className={classes.actionsWrapper}>
                    <Typography className={classes.title} variant="h5">Report</Typography>
                </div>
                <div className={classes.helpTextWrapper}>
                    <GetAppIcon className={classes.helperIcon} />
                    <Typography variant="body1">
                        You may select the options your wish in your report and click 'Generate Report'. 
                        The 'Download Report' button will be available once the report is generated.
                    </Typography>
                </div>
                <Paper className={classes.box} variant="outlined">
                    <GenerateReport generateComplete={() => getReports()} />
                    <Box mt={5} />
                    <ReportTable reports = {reports} loading = {reportLoading} refresh = {getReports}/>
                </Paper>
            </Box>
        </Box>
    )
}