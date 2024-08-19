import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import moment from "moment";
import React from "react";
import { StyledTable } from "vaping-regulation-shared-components";
import { DownloadButton } from "./DownloadButton";
import RefreshIcon from '@mui/icons-material/Refresh';

const PREFIX = 'ReportTable';

const classes = {
    boxTitle: `${PREFIX}-boxTitle`,
    box: `${PREFIX}-box`,
    reportTableWrap: `${PREFIX}-reportTableWrap`
};

const StyledBox = styled(Box)({
    [`& .${classes.boxTitle}`]: {
        paddingBottom: '10px',
    },
    [`&.${classes.box}`]: {
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
    },
    [`& .${classes.reportTableWrap}`]: {
        '& tfoot': {
            display: 'none !important'
        }
    }
});

export function ReportTable ({ reports, loading, refresh }: any) {


    return (
        <StyledBox className={classes.box}>
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
        </StyledBox>
    );
}