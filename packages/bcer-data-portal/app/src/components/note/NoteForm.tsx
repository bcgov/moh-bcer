import { noteValidateSchema } from '@/constants/validate';
import {
  Box,
  CircularProgress,
  InputAdornment,
  makeStyles,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import {
  StyledButton,
  StyledTextField,
} from 'vaping-regulation-shared-components';

export interface NoteFormProps {
  submit: (v: string) => void;
  getInitialValues: () => { content: string };
  loading: boolean;
}

const useStyles = makeStyles(() => ({
  endAdornment: {
    display: 'block',
    position: 'relative',
    bottom: '-40px',
  },
}));

function NoteForm({ submit, getInitialValues, loading }: NoteFormProps) {
  const classes = useStyles();
  return (
    <Box flexGrow={1}>
      <Formik
        initialValues={getInitialValues()}
        onSubmit={(v) => submit(v.content)}
        validationSchema={noteValidateSchema}
        enableReinitialize
      >
        {({ values, ...helpers }) => (
          <Form>
            <StyledTextField
              name="content"
              variant="outlined"
              placeholder="Type your note here..."
              fullWidth
              multiline={true}
              rows={5}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    className={classes.endAdornment}
                    position="end"
                  >
                    {values.content.length}/1024
                  </InputAdornment>
                ),
              }}
            />
            <Box display={'flex'}>
              <StyledButton
                variant="small-contained"
                type="submit"
                disabled={
                  values.content === getInitialValues().content || loading
                }
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </StyledButton>
              <Box pr={2} />
              <StyledButton
                variant="small-outlined"
                onClick={() => helpers.resetForm()}
                disabled={
                  values.content === getInitialValues().content &&
                  values.content.length
                }
              >
                cancel
              </StyledButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default NoteForm;
