import { Box, Collapse, Grid, ListItem, Paper, Typography, styled } from '@mui/material';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import StyledToolTip from '../generic/StyledToolTip';
import { FixedSizeList } from 'react-window';
import useNote, { NoteProps } from '@/hooks/useNote';
import NoteForm from './NoteForm';
import { StyledButton } from 'vaping-regulation-shared-components';

const StyledBox = styled(Box)(({ theme }) => ({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
  boxShadow: 'none',
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
}));

const RightPanel = styled(Paper)(({ theme }) => ({
  height: '210px',
}));

const NoNotes = styled(Typography)(({ theme }) => ({
  padding: '10px',
  fontSize: '14px',
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  padding: '10px',
  fontSize: '14px',
  color: 'red',
}));

const CellTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#0053A4',
  paddingBottom: '12px',
}));

function Note({ targetId, type, showHideButton, showFlag, refresh }: NoteProps) {
  const [showNotes, setShowNotes] = useState(true);

  const {
    initialValue,
    getInitialValue,
    noteData,
    noteLoading,
    submit,
    noteError,
    postLoading,
    flagForReview,
    flagForReviewLoading,
  } = useNote({ targetId, type });

  useEffect(() => {
    if (refresh) {
      submit(refresh);
    }
  }, [refresh]);

  function RenderRow(props: any) {
    const { index, style } = props;
    let backgroundColor = 'none';
    if (index === 0) {
      backgroundColor = '#E0E8F0';
    }
    return (
      <ListItem
        button
        disableRipple
        style={{ ...style, backgroundColor, borderBottom: '1px solid #eee' }}
        key={index}
      >
        <Box flex={1} marginRight={'10px'}>
          <StyledToolTip title={noteData[index]?.content}>
            <Text>
              <b>
                {noteData[index]?.user?.firstName || ''}{' '}
                {noteData[index]?.user.lastName || ''}
              </b>{' '}
              edited on{' '}
              <b>{moment(noteData[index]?.createdAt).format('MMM D, YYYY')}</b>
            </Text>
          </StyledToolTip>
        </Box>
      </ListItem>
    );
  }

  return (
    <Box>
      <Box display={'flex'}>
        <CellTitle>Notes</CellTitle>
        {showHideButton && (
          <Box ml={3}>
            <StyledButton
              variant="small-outlined"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? 'Hide' : 'Show'}
            </StyledButton>
          </Box>
        )}
      </Box>
      <StyledBox>
        <Collapse in={showNotes}>
          <Box display={'flex'}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={9}>
                <NoteForm
                  submit={submit}
                  getInitialValues={getInitialValue}
                  loading={postLoading || noteLoading}
                  showFlag={showFlag}
                  flagForReview={flagForReview}
                  flagForReviewLoading={flagForReviewLoading}
                />
              </Grid>

              <Grid item xs={12} lg={3}>
                <RightPanel variant="outlined">
                  {!!noteData?.length ? (
                    <FixedSizeList
                      height={210}
                      itemSize={45}
                      itemCount={noteData.length}
                      width={"inherit"}
                    >
                      {RenderRow}
                    </FixedSizeList>
                  ) : noteError ? (
                    <ErrorText>
                      Network error: Could not fetch existing notes
                    </ErrorText>
                  ) : (
                    <NoNotes>
                      No one has made an edit on this note yet
                    </NoNotes>
                  )}
                </RightPanel>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </StyledBox>
    </Box>
  );
}

export default Note;