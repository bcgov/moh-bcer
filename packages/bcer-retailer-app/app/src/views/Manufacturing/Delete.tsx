import { Box } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import {
  StyledButton,
  StyledConfirmDialog,
} from 'vaping-regulation-shared-components';
import DeleteIcon from '@material-ui/icons/Delete';
import { useAxiosDelete } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { useHistory } from 'react-router';

function Delete({ reportId }: { reportId: string }) {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [{ loading }, deleteReport] = useAxiosDelete('/manufacturing', {
    manual: true,
  });
  const confirmDelete = async () => {
    try {
      await deleteReport({ url: `/manufacturing/${reportId}` });
      history.push('/manufacturing');
    } catch (e) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(e),
      });
    }
  };
  return (
    <Box>
      <StyledButton variant="contained" onClick={() => setDialogOpen(true)}>
        <DeleteIcon /> Delete
      </StyledButton>
      {dialogOpen && (
        <StyledConfirmDialog
          open={dialogOpen}
          dialogTitle="Delete Manufacturing Report"
          checkboxLabel="I understand that this action is final and confirm that I am deleting the manufactured products above. Locations that were using these products will no longer have them listed."
          dialogMessage="You are about to delete this manufacturing report."
          setOpen={() => setDialogOpen(false)}
          confirmHandler={confirmDelete}
          acceptDisabled={loading}
        />
      )}
    </Box>
  );
}

export default Delete;
