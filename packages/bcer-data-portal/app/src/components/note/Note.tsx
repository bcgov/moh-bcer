import {
  Box,
  Collapse,
  ListItem,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import StyledToolTip from '../generic/StyledToolTip';
import { FixedSizeList } from 'react-window';
import useNote, { NoteProps } from '@/hooks/useNote';
import NoteForm from './NoteForm';
import { StyledButton } from 'vaping-regulation-shared-components';

const useStyles = makeStyles(() => ({
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    boxShadow: 'none',
  },
  text: {
    fontSize: '13px',
  },
  rightPanel: {
    width: '350px',
    height: '210px',
  },
  noNotes: {
    padding: '10px',
    fontSize: '14px',
  },
  error: {
    padding: '10px',
    fontSize: '14px',
    color: 'red',
  },
  cellTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0053A4',
    paddingBottom: '12px',
  },
}));

function Note({ targetId, type, showHideButton }: NoteProps) {
  const classes = useStyles();
  const [showNotes, setShowNotes] = useState(true);

  const {
    initialValue,
    getInitialValue,
    noteData,
    noteLoading,
    submit,
    noteError,
    postLoading,
  } = useNote({ targetId, type });

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
            <Typography className={classes.text}>
              <b>
                {noteData[index]?.user?.firstName || ''}{' '}
                {noteData[index]?.user.lastName || ''}
              </b>{' '}
              edited on{' '}
              <b>{moment(noteData[index]?.createdAt).format('MMM D, YYYY')}</b>
            </Typography>
          </StyledToolTip>
        </Box>
      </ListItem>
    );
  }

  return (
    <Box>
      <Box display={'flex'}>
        <Typography className={classes.cellTitle}>Notes</Typography>
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
      <Paper variant="outlined" className={classes.box}>
        <Collapse in={showNotes}>
          <Box display={'flex'}>
            <NoteForm
              submit={submit}
              getInitialValues={getInitialValue}
              loading={postLoading || noteLoading}
            />
            <Box pr={3} />
            <Paper variant="outlined" className={classes.rightPanel}>
              {!!noteData?.length ? (
                <FixedSizeList
                  height={210}
                  itemSize={45}
                  itemCount={noteData.length}
                  width={350}
                >
                  {RenderRow}
                </FixedSizeList>
              ) : noteError ? (
                <Typography className={classes.error}>
                  Notwork error: Could not fetch existing notes
                </Typography>
              ) : (
                <Typography className={classes.noNotes}>
                  No one has made an edit on this note yet
                </Typography>
              )}
            </Paper>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
}

export default Note;
