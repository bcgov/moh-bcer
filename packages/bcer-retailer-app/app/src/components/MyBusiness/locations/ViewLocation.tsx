import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import {
  LocationType,
  LocationTypeLabels,
  StyledTextField,
  StyledWarning,
  StyledRadioGroup
} from 'vaping-regulation-shared-components';
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import moment from "moment";

export default function ViewLocation({
  rowData,
  allowEdit,
}: {
  rowData: IBusinessLocationValues;
  allowEdit?: boolean;
}) {
  {rowData.underage === 'No' ? rowData.underage ='No' : rowData.underage ='Yes'}
  const feb1st2024 = moment('2024-02-01');
  const currentDate = moment();
  return (
    <Grid container spacing={3}>
      {allowEdit && (
        <Grid item spacing={1} xs={12}>
          <StyledWarning text="You already submitted the NOI for this location so you can only edit the contact information" />
          {currentDate.isBefore(feb1st2024) && rowData.location_type !== LocationType.online && <StyledWarning text="You can update your underage option before Feb 1, 2024" />}
        </Grid>
      )}
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Location Type</Typography>
          <Typography variant="body1">{LocationTypeLabels[rowData.location_type as keyof typeof LocationTypeLabels]}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Address of sales premises from which restricted e-substances are
            sold
          </Typography>
        </Grid>
        {rowData.location_type !== LocationType.online &&
        <>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Address 1</Typography>
          <Typography variant="body1">{rowData.addressLine1}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">City</Typography>
          <Typography variant="body1">{rowData.city}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Postal Code</Typography>
          <Typography variant="body2">{rowData.postal}</Typography>
        </Grid>
        </>}
        {rowData.location_type === LocationType.online &&        
        <Grid item xs={6}>
          <Typography variant="subtitle2">Web page</Typography>
          <Typography variant="body1">{rowData.webpage}</Typography>
        </Grid>}
        <Grid item xs={6}>
          <Typography variant="subtitle2">Doing Businees As</Typography>
          <Typography variant="body2">{rowData.doingBusinessAs}</Typography>
        </Grid>      
      </Grid>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Business Contact Info of sales premises from which restricted
            e-substances are sold
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {allowEdit ? (
            <StyledTextField
              label={<RequiredFieldLabel label="Business Email" />}
              name="email"
              fullWidth
            />
          ) : (
            <>
              <Typography variant="subtitle2">
                Business Email Address
              </Typography>
              <Typography variant="body1">{rowData.email}</Typography>
            </>
          )}
        </Grid>
        <Grid item xs={6}>
          {allowEdit ? (
            <StyledTextField
              label={<RequiredFieldLabel label="Business Phone Number" />}
              name="phone"
              fullWidth
            />
          ) : (
            <>
              <Typography variant="subtitle2">Business Phone Number</Typography>
              <Typography variant="body2">{rowData.phone}</Typography>
            </>
          )}
        </Grid>
      </Grid>
      {(rowData.location_type !== LocationType.online) && (
        <Grid item container spacing={1} xs={12}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Please state if persons under 19 years of age are permitted on the
              sales premises
            </Typography>
          </Grid>
          {currentDate.isBefore(feb1st2024)?
            <Grid item xs={12}>
                    <StyledRadioGroup
                      name="underage"
                      options={[
                        {label: 'Yes', value: 'Yes'},
                        {label: 'No', value: 'No'}
                      ]}
                    />
            </Grid>:
            <Grid item xs={12}>
              <Typography variant="subtitle2">Underage Allowed</Typography>
              <Typography variant="body1">{rowData.underage}</Typography>
            </Grid> 
          }
        </Grid>
      )}
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Which Regional Health Authority is the sales premises located in
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Health Authority</Typography>
          <Typography variant="body1">{rowData.health_authority}</Typography>
        </Grid>
        {rowData.health_authority_other ? (
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              Health Authority Other Option
            </Typography>
            <Typography variant="body2">
              {rowData.health_authority_other}
            </Typography>
          </Grid>
        ) : null}
      </Grid>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Do you produce, formulate, package, repackage, or prepare restricted
            e-substances for sale from this sales premises?
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Manufacturing Location</Typography>
          <Typography variant="body1">{rowData.manufacturing}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
