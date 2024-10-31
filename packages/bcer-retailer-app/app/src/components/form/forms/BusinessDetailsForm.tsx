import React, { ReactNode, useContext } from 'react';

import { BIContext, BusinessInfoContext } from '@/contexts/BusinessInfo';
import BaseForm from '@/components/form/Base';
import BusinessDetailsInputs from '@/components/form/inputs/BusinessDetailsInputs';
import { Initial, Validation } from '@/components/form/validations/vBusinessDetails';

export default function BusinessDetailsForm ({ children }: { children?: ReactNode }) {
  const [businessInfo, setBusinessInfo] = useContext<[BIContext, Function]>(BusinessInfoContext);
  return (
    <BaseForm
      Fields={BusinessDetailsInputs}
      schema={Validation}
      initialValues={{ ...Initial, ...businessInfo.details }}
      children={children}
      customFormStyles={{ margin: '8px' }}
      handleSubmit={() => {}}
    />
  )
}