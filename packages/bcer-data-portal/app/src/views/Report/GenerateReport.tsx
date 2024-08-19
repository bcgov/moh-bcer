import { reportRequestOptions } from "@/constants/arrays";
import { styled } from '@mui/material/styles';
import { useAxiosPost } from "@/hooks/axios";
import { useToast } from "@/hooks/useToast";
import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, Typography } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import React from "react";
import { StyledButton, StyledSelectField, StyledTextField } from "vaping-regulation-shared-components";

const PREFIX = 'GenerateReport';

const classes = {
    boxTitle: `${PREFIX}-boxTitle`,
    box: `${PREFIX}-box`,
    checkboxesWrap: `${PREFIX}-checkboxesWrap`
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
    [`& .${classes.checkboxesWrap}`]: {
        '& label': {
            display: 'flex',
            paddingBottom: 10
        }
    }
});

export function GenerateReport (props: any) {

    const { openToast } = useToast()
    const [{ error, loading }, generateReport] = useAxiosPost('/data/report/generate', { manual: true });
    
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

    const periodOptions = () => {
        const years = [];
        let startYear = 2021;

        for (var i = startYear; i <= moment().year() - 1; i++) {
            years.push(startYear);
            startYear++;
        }

        return years;
    }

    return (
        <StyledBox className={classes.box}>
            <Formik 
                onSubmit={async (values,  { resetForm }) => {
                    const { data } = await generateReport({ data: values });
                    if (data === "ok") {
                        onSuccess();
                       resetForm();
                    } else {
                        onError();
                    }
                }}
                initialValues={{
                    bcStatistics: [], 
                    haStatistics: [],
                    period: moment().year() - 1,
                    flavourCount: 0
                }}>
                {({ values }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item container spacing={2}>
                                <Grid item xs={6}>
                                    <StyledSelectField
                                        name="period"
                                        options={periodOptions().map(label => ({label, value:label}))}  
                                        label = {
                                            <span style={{ fontWeight: "bold"}}>Select Report Period (Outstanding Reports options only)</span>
                                        }          
                                        key = {periodOptions()[0]}
                                        value = {values.period}      
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField
                                        name = "flavourCount"
                                        label = {
                                            <span style={{ fontWeight: "bold"}}>Top Flavors Count</span>
                                        }
                                        type="number"
                                        min = "0"
                                        placeholder="Type in keyword..."
                                    />
                                </Grid>
                            </Grid>

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
                                                    key = {stat.value}
                                                    control = {
                                                        <Checkbox 
                                                            color="primary"
                                                            checked={values.bcStatistics.includes(stat.value)} 
                                                            onChange={(e: any) => {
                                                                if (e.target.checked) {
                                                                    arrayHelper.push(stat.value);
                                                                } else {
                                                                    const idx = values.bcStatistics.indexOf(stat.value);
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
        </StyledBox>
    );
}