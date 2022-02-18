import Page from '@/components/generic/Page';
import {
  BusinessReportOverview,
  BusinessReportStatus,
  LocationRO,
} from '@/constants/localInterfaces';
import { routes } from '@/constants/routes';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { CircularProgress, makeStyles } from '@material-ui/core';
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
      onClick={() => history.push(`${routes.viewLocation}/${l.id}`)}
    >
      {l.addressLine1}
    </span>
  );

  useEffect(() => {
    if(error){
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error)
      })
    }
  }, [error])
  return (
    <Page error={error}>
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
