import { Box, LinearProgress, Typography, makeStyles } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { StyledTable } from "vaping-regulation-shared-components";
import { DownloadButton } from "./DownloadButton";

const useStyles = makeStyles({
    boxTitle: {
        paddingBottom: '10px',
    },
    box: {
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
    },
})

export function ReportTable ({ reports, loading }: any) {
    const classes = useStyles();

    return (
        <Box className={classes.box}>
            <Typography className={classes.boxTitle} variant="subtitle1">
                Generated Reports
            </Typography>
            {loading ? <LinearProgress /> : <Box pt={0.5}/>}
            <StyledTable
                columns={[
                    {title: 'Date Created', render: (row: any) => `${moment(row.createdAt).format('MMM DD, YYYY HH:mm')}`},  
                    {title: 'Created By', render: (row: any) => `${row.user.firstName} ${row.user.lastName}`},
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
        </Box>
    )
}