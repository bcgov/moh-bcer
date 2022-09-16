import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { useAxiosPatch } from '@/hooks/axios';
import { StyledButton, StyledConfirmDialog } from 'vaping-regulation-shared-components';

export default function ManufacturingReportSubmitButton({ selectedLocations }: { selectedLocations: string[] }) {

  const [{ response, loading }, patch] = useAxiosPatch(`/manufacturing`, { manual: true });
  const [isConfirmOpen, setOpenConfirm] = useState<boolean>(false)

  const { values, isValid } = useFormikContext<{ productName: string, ingredients: any[] }>();
  const submit = async () => {
    await patch({
      data: {
        productName: values.productName,
        ingredients: values.ingredients,
        locationIds: selectedLocations,
      }
    })
  }

  return response?.status === 201 ? <Redirect to='/manufacturing?success=true' /> : (
    <>
      <StyledButton
        variant='contained'
        onClick={() => setOpenConfirm(true)}
        disabled={loading || !isValid || !selectedLocations.length}
      >
        {loading ? '...' : 'Submit'}
      </StyledButton>
      <StyledConfirmDialog
        open={!!isConfirmOpen}
        confirmHandler={submit}
        dialogTitle='Confirm Your Submission and Acknowledge'
        setOpen={() => setOpenConfirm(false)}
        dialogMessage='You are about to submit your manufacturing report along with the Notice of Intent to sell e-substances.'
        checkboxLabel='I understand that I will be required to wait for 6 weeks from the time that I file or update my manufacturing report before I can sell my product.'
      />
    </>
  )
}
