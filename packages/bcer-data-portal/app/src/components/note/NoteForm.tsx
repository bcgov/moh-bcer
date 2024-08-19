import React from 'react';
import { Box, CircularProgress, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import { Form, Formik } from 'formik';
import { StyledButton, StyledTextField } from 'vaping-regulation-shared-components';
import { noteValidateSchema } from '@/constants/validate';

export interface NoteFormProps {
  submit: (v: string) => void;
  getInitialValues: () => { content: string };
  loading: boolean;
  showFlag: boolean;
  flagForReview: (v: string) => void;
  flagForReviewLoading: boolean;
}

const EndAdornment = styled(InputAdornment)({
  display: 'block',
  position: 'relative',
  bottom: '-40px',
});

const FlagForReviewButton = styled(StyledButton)({
  marginLeft: 'auto', 
  backgroundColor: 'red',
  '&.Mui-disabled': {
    background: 'grey',
  },
});

function NoteForm({ submit, getInitialValues, loading, showFlag, flagForReview, flagForReviewLoading }: NoteFormProps) {
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
                  <EndAdornment position="end">
                    {values.content.length}/1024
                  </EndAdornment>
                ),
              }}
            />
            <Box display="flex">
              <StyledButton
                variant="small-contained"
                type="submit"
                disabled={values.content === getInitialValues().content || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </StyledButton>
              <Box pr={2} />
              <StyledButton
                variant="small-outlined"
                onClick={() => helpers.resetForm()}
                disabled={values.content === getInitialValues().content && values.content.length}
              >
                cancel
              </StyledButton>
              {showFlag && (
                <FlagForReviewButton
                  variant="small-contained"
                  onClick={() => flagForReview(values.content)}
                  disabled={values.content === getInitialValues().content || flagForReviewLoading}
                >
                  {flagForReviewLoading ? <CircularProgress size={24} /> : 'Flag for review'}
                </FlagForReviewButton>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default NoteForm;