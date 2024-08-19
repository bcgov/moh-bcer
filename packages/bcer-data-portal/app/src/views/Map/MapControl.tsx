import AutoSubmitFormik from '@/components/AutoSubmitFormik';
import { styled } from '@mui/material/styles';
import { RouteOptions } from '@/constants/localInterfaces';
import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { SetStateAction, useEffect } from 'react';
import {
  StyledCheckbox,
  StyledRadioGroup,
  StyledCheckboxInput,
} from 'vaping-regulation-shared-components';

const PREFIX = 'MapControl';

const classes = {
  root: `${PREFIX}-root`,
  routeOption: `${PREFIX}-routeOption`,
  otherOptions: `${PREFIX}-otherOptions`,
  text: `${PREFIX}-text`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {},

  [`& .${classes.routeOption}`]: {
    padding: '5px 15px',
    maxHeight: '45px',
    overflow: 'hidden',
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      '& .MuiTypography-body1': {
        fontSize: 14
      }
    }
  },

  [`& .${classes.otherOptions}`]: {
    padding: '5px 15px',
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      '& .MuiTypography-body1': {
        fontSize: 14
      }
    }
  },

  [`& .${classes.text}`]: {
    fontSize: '16px',
    fontWeight: 'bold',
  }
}));

function MapControl({
  initialRoutingOptions,
  setRouteOptions,
  setShowHALayer,
}: {
  initialRoutingOptions: RouteOptions;
  setRouteOptions: React.Dispatch<SetStateAction<RouteOptions>>;
  setShowHALayer: React.Dispatch<SetStateAction<boolean>>;
}) {

  return (
    <StyledBox>
      <Formik
        initialValues={initialRoutingOptions}
        onSubmit={(v) => setRouteOptions(v)}
      >
        {({ values, ...helpers }) => (
          <Form
            onChange={(e:any) => {
              if(e.target.name === 'haOverlay') {
                setShowHALayer(e.target.checked);
              }
            }}
          >
            <Box mt={2} mb={2}>
              <Typography className={classes.text}>Map Options</Typography>
              <Box className={classes.routeOption}>
                <Box>
                  <StyledCheckboxInput
                    name="haOverlay"
                    label="Display Health Authority Boundaries"
                  />
                </Box>
              </Box>
            </Box>

            <Typography className={classes.text}>Filter Options</Typography>
            <Box className={classes.routeOption}>
              <Box flex={0.5}>
                <StyledRadioGroup
                  label={``}
                  name="option"
                  options={[{ label: 'Fastest', value: 'fastest' }]}
                />
              </Box>
              <Box flex={0.5}>
                <StyledRadioGroup
                  label={``}
                  name="option"
                  options={[{ label: 'Shortest', value: 'shortest' }]}
                />
              </Box>
            </Box>
            <Box className={classes.routeOption} mt={2}>
              <Box flex={0.5}>
                <StyledCheckboxInput name="roundTrip" label="Round Trip" />
              </Box>
              <Box flex={0.5}>
                <StyledCheckboxInput
                  name="optimizeOrder"
                  label="Optimize Order"
                />
              </Box>
            </Box>
            <Box className={classes.otherOptions} mt={2}>
              <Box flex={0.5}>
                <Box>
                  <StyledCheckboxInput
                    name="ferrySchedule"
                    label="Ferry Schedule"
                  />
                </Box>
                <Box>
                  <StyledCheckboxInput name="traffic" label="Traffic" />
                </Box>
                {/* Not needed for now */}
                {/* <Box>
                  <StyledCheckboxInput
                    name="globalDistortionField"
                    label="Global Distortion Field"
                  />
                </Box>
                <Box>
                  <StyledCheckboxInput
                    name="localDistortionField"
                    label="Local Distortion Field"
                  />
                </Box> */}
              </Box>
              <Box flex={0.5}>
                <Box>
                  <StyledCheckboxInput name="events" label="Events" />
                </Box>

                <Box>
                  <StyledCheckboxInput
                    name="turnRestriction"
                    label="Turn Restriction"
                  />
                </Box>
                {/* Not needed for now. */}
                {/* <Box>
                  <StyledCheckboxInput
                    name="timeDependent"
                    label="Time Dependent"
                  />
                </Box>
                <Box>
                  <StyledCheckboxInput
                    name="crossingCost"
                    label="Crossing Cost"
                  />
                </Box>
                <Box>
                  <StyledCheckboxInput name="turnCost" label="Turn Cost" />
                </Box> */}
              </Box>
            </Box>
            <AutoSubmitFormik values={values} submitForm={helpers.submitForm} />
          </Form>
        )}
      </Formik>
    </StyledBox>
  );
}

export default MapControl;
