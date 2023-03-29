import { useAxiosGet, useAxiosPost, useAxiosPostFormData } from "@/hooks/axios";
import { CircularProgress, IconButton, Snackbar, SnackbarContent, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { StyledButton } from "vaping-regulation-shared-components";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import moment from "moment";

const useStyles = makeStyles({
    downloadSnackbar: {
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
    messageTextContent: {
        paddingLeft: '10px',
    },
    fileLoading: {
        fontSize: '2.5rem',
        color: 'rgba(0, 0, 0, 0.2)',
    },
    fileComplete: {
        fontSize: '2.5rem',
        color: '#0053A4',
    },
    downloadButtonIcon: {
        color: '#285CBC',
        fontSize: '40px',
    }
})

export function DownloadButton(props: any) {
    const classes = useStyles();
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
        <>        
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
        </>
    )
}