import { Box, LinearProgress, Tooltip, Typography, makeStyles } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { StyledTable } from "vaping-regulation-shared-components";
import { DownloadButton } from "./DownloadButton";
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles({
    boxTitle: {
        paddingBottom: '10px',
    },
    box: {
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
    },
    reportTableWrap: {
        '& tfoot': {
            display: 'none !important'
        }
    }
})

export function ReportTable ({ reports, loading, refresh }: any) {
    const classes = useStyles();

    return (
        <Box className={classes.box}>
            <Box display="flex" justifyContent="space-between">
                <Typography className={classes.boxTitle} variant="subtitle1">
                    Generated Reports
                </Typography>
                {!loading && 
                    <Tooltip title="Refresh Table">
                        <RefreshIcon color="action" onClick={() => refresh()} fontSize="large" />
                    </Tooltip>
                }
            </Box>
            
            {loading ? <LinearProgress /> : <Box pt={0.5}/>}
            <div className = {classes.reportTableWrap}>
                <StyledTable
                    columns={[
                        {title: 'Date Created', render: (row: any) => `${moment(row.createdAt).format('MMM DD, YYYY HH:mm:ss')}`},  
                        {title: 'Created By', render: (row: any) => `${row.user.firstName} ${row.user.lastName}`}, 
                        {title: 'Year', render: (row: any) => `${row.query.period}`},
                        {title: '', render: (row: any) => <DownloadButton {...row} />, align: "center"}
                    ]} 
                    data={
                        reports
                        ? reports.map((row: any) => ({
                            ...row,
                            key: row.id
                            }))
                        : []
                    }
                />
            </div>
        </Box>
    )
}