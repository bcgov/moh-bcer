import React, { ReactNode } from 'react';

import { makeStyles } from '@material-ui/core';

import BaseForm from '@/components/form/Base';
import ManufacturingReportInputs from '@/components/form/inputs/ManufacturingReportInputs';
import { Initial, Validation } from '@/components/form/validations/vManufacturing';

const useStyles = makeStyles({
  form: {
    padding: '25px 20px 15px 20px',
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff'
  }
})

export default function ManufacturingReportForm({ children }: { children?: ReactNode }) {
  const classes = useStyles();
  return (
    <BaseForm
      Fields={ManufacturingReportInputs}
      schema={Validation}
      initialValues={Initial}
      handleSubmit={() => (true)}
      children={children}
      formClass={classes.form}
      useDefaultFormStyles={true}
    />
  )
}
