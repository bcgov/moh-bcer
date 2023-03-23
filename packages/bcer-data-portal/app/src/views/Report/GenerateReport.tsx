import { reportRequestOptions } from "@/constants/arrays";
import { useAxiosPost } from "@/hooks/axios";
import { useToast } from "@/hooks/useToast";
import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, Typography, makeStyles } from "@material-ui/core";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { StyledButton } from "vaping-regulation-shared-components";

const useStyles = makeStyles({
    boxTitle: {
        paddingBottom: '10px',
    },
    box: {
        border: 'solid 1px #CDCED2',
        borderRadius: '4px',
        padding: '1.4rem',
    },
    checkboxesWrap: {
        '& label': {
            display: 'flex',
            paddingBottom: 10
        }
    }
});

export function GenerateReport (props: any) {
    const classes = useStyles();
    const { openToast } = useToast()
    const [{ data, error, loading }, generateReport] = useAxiosPost('/data/report/generate', { manual: true });
    
    const onSuccess = () => {
        props.generateComplete();
        openToast({
            successMessages: ['Generate Report request recieved! Please check the report table below for your report.'],
            type: 'success',
        });
    }
    
    const onError = () => {
        console.error(error);
        openToast({
            errorMessages: ['Error generating Report. Please try again later.'],
            type: 'error',
        });
    }

    return (
        <Box className={classes.box}>
            <Formik 
                onSubmit={async (values,  { resetForm }) =>  {
                    await generateReport({ data: values })
                    if (data === "ok" && !error) {
                        onSuccess();
                        resetForm();
                    } else {
                        onError();
                    }
                    
                }}
                initialValues={{
                    bcStatistics: [], 
                    haStatistics: []
                }}>
                {({ values }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography className={classes.boxTitle} variant="subtitle1">
                                    BC Statistics
                                </Typography>
                                <FieldArray 
                                    name="bcStatistics" 
                                    render = {arrayHelper => (
                                        <Box className={classes.checkboxesWrap}>
                                            {reportRequestOptions.bcStatistics.map(stat => (
                                                <FormControlLabel
                                                    key= {stat.value}
                                                    control={<Checkbox color="primary"
                                                        checked={values.bcStatistics.includes(stat.value)} 
                                                        onChange={(e: any) => {
                                                            if (e.target.checked) {
                                                                arrayHelper.push(stat.value);
                                                            } else {
                                                                const idx = values.bcStatistics.indexOf(stat.value);
                                                                arrayHelper.remove(idx);
                                                            }
                                                        }}
                                                        name={stat.value} />
                                                    }
                                                    label={stat.label}
                                                />

                                                
                                            ))}
                                        </Box>
                                    )}
                                />
                            </Grid>
                        
                            <Grid item xs={6}>
                                <Typography className={classes.boxTitle} variant="subtitle1">
                                    HA Statistics
                                </Typography>
                                <FieldArray 
                                    name="haStatistics" 
                                    render = {arrayHelper => (
                                        <Box className={classes.checkboxesWrap}>
                                            {reportRequestOptions.haStatistics.map(stat => (
                                                <FormControlLabel
                                                    key= {stat.value}
                                                    control={
                                                        <Checkbox color="primary"
                                                            checked={values.haStatistics.includes(stat.value)} 
                                                            onChange={(e: any) => {
                                                                if (e.target.checked) {
                                                                    arrayHelper.push(stat.value);
                                                                } else {
                                                                    const idx = values.haStatistics.indexOf(stat.value);
                                                                    arrayHelper.remove(idx);
                                                                }
                                                            }}
                                                            name={stat.value} 
                                                        />
                                                    }
                                                    label={stat.label}
                                                />

                                                
                                            ))}
                                        </Box>
                                    )}
                                />
                            </Grid>
                            <Box marginLeft={'auto'} display={'flex'}>
                                <StyledButton variant="dialog-accept" type="submit" disabled = {values.bcStatistics.length === 0 && values.haStatistics.length === 0}>                               
                                    {loading ? <CircularProgress /> : "Generate Report"}
                                </StyledButton>
                            </Box>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}