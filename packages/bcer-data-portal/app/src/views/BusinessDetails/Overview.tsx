import Page from '@/components/generic/Page';
import Note from '@/components/note/Note';
import {
  BusinessReportOverview,
  BusinessReportStatus,
  LocationRO,
} from '@/constants/localInterfaces';
import { routes } from '@/constants/routes';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import {
  Box,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  BusinessDashboard,
  BusinessOverview,
} from 'vaping-regulation-shared-components';

const useStyles = makeStyles(() => ({
  link: {
    color: 'blue',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  clickBack: {
    cursor: 'pointer',
    color: 'rgba(51, 51, 51, 0.5)',
  },
}));

function BusinessDetails() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const classes = useStyles();
  const [{ data, error, loading }] = useAxiosGet<{
    locations: LocationRO[];
    overview: BusinessReportStatus;
  }>('/data/business/report-overview/' + id);

  const renderAddress = (l: LocationRO) => (
    <span
      className={classes.link}
      onClick={() => history.push(`${routes.viewLocation}/${l.id}?businessId=${id}`)}
    >
      {l.addressLine1}
    </span>
  );

  useEffect(() => {
    if (error) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error),
      });
    }
  }, [error]);
  return (
    <Page error={error}>
      <Box pb={2}>
        <Typography variant="body1">
          <span
            className={classes.clickBack}
            onClick={() => history.push(routes.root)}
          >
            Dashboard
          </span>{' '}
          / Business Details
        </Typography>
      </Box>
      <Note targetId={id} type="business" showHideButton={true} />
      <Box pb={2} />
      {loading && <CircularProgress />}
      <BusinessDashboard
        data={data}
        showOverview={true}
        showStatusMessage={true}
        renderAddress={renderAddress}
      />
    </Page>
  );
}

export default BusinessDetails;
