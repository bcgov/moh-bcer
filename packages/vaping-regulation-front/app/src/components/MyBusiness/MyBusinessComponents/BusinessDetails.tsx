import React from 'react';
import BusinessDetailsForm from '@/components/form/forms/BusinessDetailsForm';
import AddLocations from '@/components/MyBusiness/AddLocations';
import SubmitBusinessInfoButton from '@/components/MyBusiness/SubmitBusinessInfoButton';

export default function BusinessDetails () {

  return (
    <>
      <BusinessDetailsForm>
        <AddLocations />
        <SubmitBusinessInfoButton />
      </BusinessDetailsForm>
    </>
  )
}
