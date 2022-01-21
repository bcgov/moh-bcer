import React from 'react';
import BusinessDetailsForm from '@/components/form/forms/BusinessDetailsForm';
import AddLocations from '@/components/MyBusiness/AddLocations';
import SubmitBusinessInfoButton from '@/components/MyBusiness/SubmitBusinessInfoButton';
import ExistingTableWrap from '../locations/ExistingTableWrap';

export default function BusinessDetails() {
  return (
    <>
      <BusinessDetailsForm>
        <ExistingTableWrap />
        <AddLocations />
        <SubmitBusinessInfoButton />
      </BusinessDetailsForm>
    </>
  );
}
