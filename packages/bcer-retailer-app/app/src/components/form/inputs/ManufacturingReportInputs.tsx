import React, { Fragment, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Form, Field, FieldArray, useFormikContext, getIn } from 'formik';
import { Divider, Grid, Typography, makeStyles, FormHelperText } from '@mui/material';
import AddCircle from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Ingredient } from '@/constants/localInterfaces';
import { StyledTextField, StyledButton } from 'vaping-regulation-shared-components'
import { ManufacturingReportValues } from '@/components/form/validations/vManufacturing';

const PREFIX = 'ManufacturingReportInputs';

const classes = {
  formTitle: `${PREFIX}-formTitle`,
  box: `${PREFIX}-box`,
  closeButton: `${PREFIX}-closeButton`,
  buttonIcon: `${PREFIX}-buttonIcon`
};

const StyledGrid = styled(Grid)({
  [`& .${classes.formTitle}`]: {
    fontSize: '17px',
    fontWeight: 600,
    paddingBottom: '24px'
  },
  [`& .${classes.box}`]: {
    outline: 'solid 1px whitesmoke',
    borderRadius: '2px',
    padding: '1rem',
    position: 'relative',
  },
  [`& .${classes.closeButton}`]: {
    padding: '10px',
    position: 'absolute',
    top: '-20px',
    right: '2px',
    borderRadius: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px'
  },
});

const blankIngredient = {
  name: '',
  scientificName: '',
  manufacturerName: '',
  manufacturerAddress: '',
  manufacturerPhone: '',
  manufacturerEmail: '',
}

const ErrorMessage = ({ name }: { name: string }) => (
  <Field
    error
    name={name}
    render={({ form }: any) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? (
        <FormHelperText error>
          {error}
        </FormHelperText>
      ) : null
    }}
  />
);

function ManufacturingReportInputs() {

  const { isValid, values, validateForm } = useFormikContext<ManufacturingReportValues>();

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  return (
    <StyledGrid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          1. Name and contact information of the manufacturer of each ingredient.
        </Typography>
        <Typography variant='body1'>
          Both the common and scientific names of each ingredient, unless one of these names is not available from the manufacturer.
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <StyledTextField
          label='Product Name'
          name='productName'
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <FieldArray name='ingredients' validateOnChange={false}>
          {({ remove, push }) => (
            <>
              {values.ingredients.map((ingredient: Ingredient, index: number) => (
                <Grid style={{ position: 'relative', marginTop: '1rem' }} spacing={2} container key={index}>

                  {index > 0 && <HighlightOffIcon onClick={() => remove(index)} className={classes.closeButton} />}

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label='Ingredient name'
                      name={`ingredients.${index}.name`}
                    />
                    <ErrorMessage name={`ingredients[${index}].name`} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label='Scientific Name'
                      name={`ingredients.${index}.scientificName`}
                    />
                    <ErrorMessage name={`ingredients[${index}].scientificName`} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label='Manufacturer Name'
                      name={`ingredients.${index}.manufacturerName`}
                    />
                    <ErrorMessage name={`ingredients[${index}].manufacturerName`} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label='Manufacturer Address'
                      name={`ingredients.${index}.manufacturerAddress`}
                    />
                    <ErrorMessage name={`ingredients[${index}].manufacturerAddress`} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label='Manufacturer Email'
                      name={`ingredients.${index}.manufacturerEmail`}
                    />
                    <ErrorMessage name={`ingredients[${index}].manufacturerEmail`} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label='Manufacturer Phone'
                      name={`ingredients.${index}.manufacturerPhone`}
                    />
                    <ErrorMessage name={`ingredients[${index}].manufacturerPhone`} />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider light />
                  </Grid>
                </Grid>
              ))}
              <StyledButton
                variant='outlined'
                disabled={!isValid}
                onClick={() => push(blankIngredient)}
                type='button'
                style={{
                  marginTop: '2rem'
                }}
              >
                <AddCircle className={classes.buttonIcon} />
                Add Ingredient
              </StyledButton>
            </>
          )}
        </FieldArray>
      </Grid>
    </StyledGrid>
  );
}

export default ManufacturingReportInputs;
