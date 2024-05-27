import React from 'react';
import { StyledConfirmDialog } from 'vaping-regulation-shared-components';

interface UnSubscribeDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
  loading: boolean,
}

function UnSubscribeDialog({
  open,
  setOpen,
  onSubmit,
  loading,
}: UnSubscribeDialogProps) {
  return (
    <StyledConfirmDialog 
        confirmHandler={onSubmit}
        setOpen={setOpen}
        checkboxLabel="I confirm that I want to unsubscribe from notification system"
        dialogMessage="You are about to unsubscribe from the system notification. You will no longer receive SMS notification"
        dialogTitle="Unsubscribe"
        acceptButtonText="Unsubscribe Now"
        open={open}
    />
  );
}

export default UnSubscribeDialog;
