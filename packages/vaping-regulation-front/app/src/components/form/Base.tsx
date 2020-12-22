import React, { ReactNode, useEffect, FunctionComponent } from 'react';
import { Formik, FormikProps, Form } from 'formik';
import { Typography, makeStyles } from '@material-ui/core';

type BaseFormProps = {
  initialValues: Object; // from form/validations
  schema: Object; // same as initialValues but as a Yup schema
  Fields: FunctionComponent<FormikProps<{}>>; // function component returning <Fields /> for this form
  handleSubmit: Function, // self-explanatory, ajax call, redirect, etc
  title?: string; // optional title of form, h4 at the top
  subtitle?: string; // a <p> beneath the title
  fetchData?: Function; // data fetcher, runs once on load if defined, can be run by children as props.fetchData
  children?: ReactNode;
  formClass?: string;
  customFormStyles?: any;
  useDefaultFormStyles?: boolean;
};

const useStyles = makeStyles({
  form: {
    padding: '25px 20px 15px 20px',
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff'
  },
  formTitle: {
    fontSize: '17px',
    fontWeight: 600,
    paddingBottom: '24px'
  },
})


export default function BaseForm({
  title,
  subtitle,
  fetchData,
  initialValues,
  schema,
  handleSubmit,
  Fields,
  children,
  formClass,
  useDefaultFormStyles,
  customFormStyles,
}: BaseFormProps) {

  const classes = useStyles();

  useEffect(() => {
    if (fetchData) fetchData();
  }, [fetchData]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        enableReinitialize
        validateOnMount
        onSubmit={async (values, actions) => handleSubmit(values, actions)}
        children={props => (
          <Form className={!!useDefaultFormStyles ? classes.form : formClass} style={customFormStyles}>
            {title && (
              <Typography variant='h6' className={classes.formTitle}>{title}</Typography>
            )}
            <Fields {...props} />
            {children}
          </Form>
        )}
      />
    </>
  );
}
