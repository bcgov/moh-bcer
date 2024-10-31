import { useAxiosGet, useAxiosPost, useAxiosPostFormData } from "@/hooks/axios";
import { styled } from '@mui/material/styles';
import { CircularProgress, IconButton, Snackbar, SnackbarContent } from "@mui/material";
import React, { useState } from "react";
import { StyledButton } from "vaping-regulation-shared-components";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import moment from "moment";

const PREFIX = 'DownloadButton';

const classes = {
    downloadSnackbar: `${PREFIX}-downloadSnackbar`,
    messageTextContent: `${PREFIX}-messageTextContent`,
    fileLoading: `${PREFIX}-fileLoading`,
    fileComplete: `${PREFIX}-fileComplete`,
    downloadButtonIcon: `${PREFIX}-downloadButtonIcon`
};

const Root = styled('div')({
    [`& .${classes.downloadSnackbar}`]: {
        height: '100px',
        backgroundColor: 'white',
        '& .MuiSnackbarContent-message': {
          fontWeight: '600',
          color: '#0053A4',
        },
        '& .MuiSnackbarContent-action': {
          minWidth: '64px',
        },
    },
    [`& .${classes.messageTextContent}`]: {
        paddingLeft: '10px',
    },
    [`& .${classes.fileLoading}`]: {
        fontSize: '2.5rem',
        color: 'rgba(0, 0, 0, 0.2)',
    },
    [`& .${classes.fileComplete}`]: {
        fontSize: '2.5rem',
        color: '#0053A4',
    },
    [`& .${classes.downloadButtonIcon}`]: {
        color: '#285CBC',
        fontSize: '40px',
    }
});

export function DownloadButton(props: any) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    const [{ data: report, error: downloadError, loading: downloading }, downloadReport] = useAxiosPostFormData(
        `/data/report/download`,
        {
            manual: true,
        }
    );

    const handleDownload = async () => {
        setSnackbarOpen(true);
        await downloadReport({ data: { id: props.id }});
    }

    return (
        (<Root>
            <StyledButton variant="small-outlined" onClick={() => handleDownload()} disabled = {!props.result || Object.keys(props.result).length === 0}>
                Download
            </StyledButton>
            <Snackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <SnackbarContent
                    className = {classes.downloadSnackbar}
                    message = {
                        <div>
                            <FileCopyIcon className = {downloading ? classes.fileLoading : classes.fileComplete} />
                            <span className={classes.messageTextContent}>
                                {`${props.query.period}Report-${moment().format('DD_MM_YYYY')}.xlsx`}
                            </span>
                        </div>
                    }
                    action = {
                        downloading ? ( <CircularProgress /> ) :
                        (
                        <IconButton
                            href = {window.URL.createObjectURL(new Blob([report]))}
                            download = {`${props.query.period}Report-${moment().format('DD_MM_YYYY')}.xlsx`}
                            onClick = {() => {
                                setSnackbarOpen(false);
                            }}
                        >
                            <SaveAltIcon className={classes.downloadButtonIcon} />
                        </IconButton>
                        )
                    }
                />
            </Snackbar>
        </Root>)
    );
}