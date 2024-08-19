import React from "react";
import { styled } from '@mui/material/styles';
import { Box, Paper, Typography } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import { useAxiosGet } from "@/hooks/axios";
import { GenerateReport } from "./GenerateReport";
import { ReportTable } from "./ReportTable";

const PREFIX = 'Overview';

const classes = {
    contentWrapper: `${PREFIX}-contentWrapper`,
    content: `${PREFIX}-content`,
    helpTextWrapper: `${PREFIX}-helpTextWrapper`,
    helperIcon: `${PREFIX}-helperIcon`,
    title: `${PREFIX}-title`,
    actionsWrapper: `${PREFIX}-actionsWrapper`,
    box: `${PREFIX}-box`
};

const StyledBox = styled(Box)((
    {
        theme
    }
) => ({
    [`&.${classes.contentWrapper}`]: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },

    [`& .${classes.content}`]: {
        maxWidth: '1440px',
        width: '95%',
        padding: '20px 30px'
    },

    [`& .${classes.helpTextWrapper}`]: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#E0E8F0',
        marginBottom: '30px',
        borderRadius: '5px',
    },

    [`& .${classes.helperIcon}`]: {
        fontSize: '45px',
        color: '#0053A4',
        paddingRight: '25px',
    },

    [`& .${classes.title}`]: {
        padding: '10px 0px',
        color: '#002C71',
    },

    [`& .${classes.actionsWrapper}`]: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '10px',
    },

    [`& .${classes.box}`]: {
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
    }
}));

export default function Report() {

    
    const [{ data: reports, error: getError, loading: reportLoading }, getReports] = useAxiosGet(
        '/data/report'
    );

    return (
        <StyledBox className={classes.contentWrapper}>
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
        </StyledBox>
    );
}