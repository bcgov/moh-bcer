import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import BaseForm from '@/components/form/Base';
import ManufacturingReportInputs from '@/components/form/inputs/ManufacturingReportInputs';
import { Initial, Validation } from '@/components/form/validations/vManufacturing';

const PREFIX = 'ManufacturingReportForm';

const classes = {
  form: `${PREFIX}-form`
};

const Root = styled('div')({
  [`& .${classes.form}`]: {
    padding: '25px 20px 15px 20px',
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff'
  }
});

export default function ManufacturingReportForm({ children }: { children?: ReactNode }) {
  return (
    <Root>
      <BaseForm
        Fields={ManufacturingReportInputs}
        schema={Validation}
        initialValues={Initial}
        handleSubmit={() => (true)}
        children={children}
        formClass={classes.form}
        useDefaultFormStyles={true}
      />
    </Root>
  )
}
