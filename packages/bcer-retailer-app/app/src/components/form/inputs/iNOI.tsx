import React from 'react';
import { Field, ErrorMessage, FormikProps, useFormikContext } from 'formik';
import ErrorComponent from '@/components/form/ErrorComponent';
import S from '@/css/forms.module.scss';

function NoiInputs(props: FormikProps<{}>) {
  const { values, errors } = useFormikContext();
  return (
    <form onSubmit={props.handleSubmit}>
      <section>
        <fieldset>
          <p>1. Please indicate what type of submission you are providing.</p>
          <label><Field id="type-new" name="type" type="radio" value="new" />First time Notice of Intent to sell vapour products</label>
          <label><Field id="type-update" name="type" type="radio" value="update" />Updating business information</label>
          <label><Field id="type-renew" name="type" type="radio" value="renew" />Annual renewal of your Notice of Intent to sell vapour products</label>
        </fieldset>
        <ErrorMessage name="type" />
      </section>

      <section className={S.spread}>
        <p>2. Please identify the following premises contact and identification information:*</p>
        <label>Legal name of business <Field name="legalName" /></label>
        <ErrorMessage name="legalName" component={ErrorComponent} />
        <label>Name under which business conducted <Field name="businessName" /></label>
        <ErrorMessage name="businessName" component={ErrorComponent} />
        <label>Address of sales premises from which restricted e-substance sold <Field name="address" /></label>
        <ErrorMessage name="address" component={ErrorComponent} />
        <label>City <Field name="city" /></label>
        <ErrorMessage name="city" component={ErrorComponent} />
        <label>Postal code <Field name="postal" /></label>
        <ErrorMessage name="postal" component={ErrorComponent} />
        <label>Business phone number <Field name="phone" /></label>
        <ErrorMessage name="phone" component={ErrorComponent} />
      </section>

      <section>
        <p>3. Business email address</p>
        <Field type="email" name="email"/>
        <ErrorMessage name="email" component={ErrorComponent} />
      </section>

      <section>
        <p>4. If applicable, please include a link to the business webpage:</p>
        <Field name="webpage" />
      </section>

      <section>
        <p>
          5. Please state if persons under 19 years of age are permitted on the sales premises*
          <br />
          <small>
            If your retail location has unique circumstances surrounding age-restriction, please select "other" and describe in the comment box below.
          </small>
        </p>
        <label><Field name="underage" type="radio" value="yes" />Yes</label>
        <label><Field name="underage" type="radio" value="no" />No</label>
        <label><Field name="underage" type="radio" value="other" />Other, please specify</label>
        <ErrorMessage name="underage" />
        {values.underage === 'other' && <Field type="textarea" name="underage_other" />}
        {values.underage === 'other' && <ErrorMessage name="underage_other" component={ErrorComponent} />}
      </section>

      <section>
        <p>6. Which regional health authority is the sales premises located in? <a href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services/land-use/administrative-boundaries/health-boundaries" target="_blank" rel="noopener noreferrer">A map of the regional health authorities</a></p>
        <label><Field name="ha" type="radio" value="fraser" />Fraser Health</label>
        <label><Field name="ha" type="radio" value="interior" />Interior Health</label>
        <label><Field name="ha" type="radio" value="island" />Island Health</label>
        <label><Field name="ha" type="radio" value="northern" />Northern Health</label>
        <label><Field name="ha" type="radio" value="coastal" />Vancouver Coastal Health</label>
        <ErrorMessage name="ha" component={ErrorComponent} />
      </section>

      <section className={S.buttons}>
        <button className="BC-Gov-PrimaryButton" type="submit" disabled={props.isSubmitting}>
          Save
        </button>
      </section>
    </form>
  );
}

export default NoiInputs;
