import React, { useContext, useEffect, useState } from 'react';
import ReactDOMServer from "react-dom/server";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAxiosGet } from '@/hooks/axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { Business, BusinessLocation } from '@/constants/localInterfaces';
import { formatError } from '@/utils/formatting';
import NoiSubmission from '@/components/Noi/NoiSubmission';
import { NoiUtil } from '@/utils/noi.util';
import { NoiMissingSalesReportTable, OutstandingNoiTable, SubmittedNoiTable } from './Tables';
import FullScreen from '@/components/generic/FullScreen';
import jsPDF from 'jspdf';
import Pdf from './Pdf';

const StyledWrapper = styled('div')(({ theme }) => ({
  '& .title': {
    padding: '20px 0px',
    color: '#002C71',
  },
  '& .actionsWrapper': {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
}));

export default function NoiOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [{ data: businessData, loading: businessLoading, error: businessError }] = useAxiosGet(`/business`);
  const [outstanding, setOutstanding] = useState<Array<BusinessLocation>>([]);
  const outstandingFullscreenState = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<Array<BusinessLocation>>([]);
  const submittedFullscreenState = useState<boolean>(false);
  const [missingSales, setMissingSales] = useState<Array<BusinessLocation>>([]);
  const missingSalesFullScreenState = useState<boolean>(false);
  const [{ data, loading, error }] = useAxiosGet<{ locations: BusinessLocation[] }>(`/business/report-overview`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  useEffect(() => {
    if (location.pathname.includes('success') && !appGlobal.noiComplete) {
      setAppGlobal({ ...appGlobal, noiComplete: true });
    }
  }, [location.pathname, appGlobal.noiComplete]);

  useEffect(() => {
    if (data?.locations?.length) {
      const outstanding = data.locations?.filter(NoiUtil.outstandingNoi);
      const missingSales = data.locations?.filter(NoiUtil.missingSalesReport);
      const submitted = data.locations?.filter(NoiUtil.submittedNoi);
      setOutstanding(outstanding);
      setMissingSales(missingSales);
      setSubmitted(submitted);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(error) });
    }
  }, [error]);

  async function printDocument(location: BusinessLocation) {
    const pdf = new jsPDF('p', 'pt', 'a4');
    await pdf.html(ReactDOMServer.renderToStaticMarkup(<Pdf location={location} legalName={businessData?.legalName} />));
    pdf.save(`NOI-${location.doingBusinessAs}-${location.city}`);
  }

  if (loading) return <CircularProgress />;

  return (
    <StyledWrapper>
      <div className="actionsWrapper">
        <Typography className="title" variant='h5'>Notice of Intent</Typography>
      </div>
      {location.pathname === '/noi/success' ? <NoiSubmission /> : null}
      <>
        <Typography variant='body1'>
          Business owners must notify the Ministry of Health of their intent to sell restricted E-substances by submitting a Notice of Intent to sell E-Substances to the Ministry of Health. The Notice of Intent to Sell E-Substances is required for each separate sales premises for your business and for the sale of non-therapeutic nicotine E-substances. Business owners will be required to submit the following information:
        </Typography>
        <ul>
          <li><Typography variant='body1'>Legal name of business</Typography></li>
          <li><Typography variant='body1'>Name under which business conducted</Typography></li>
          <li><Typography variant='body1'>Address of sales premises from which restricted E-substances are sold</Typography></li>
          <li><Typography variant='body1'>Phone Number for sales premises</Typography></li>
          <li><Typography variant='body1'>Email address for sales premises</Typography></li>
          <li><Typography variant='body1'>Webpage for sales premises (if applicable)</Typography></li>
          <li><Typography variant='body1'>If persons under 19 years of age are permitted on the sales premises</Typography></li>
          <li><Typography variant='body1'>Health authority in which the retail location is located</Typography></li>
        </ul>
        <Typography variant='body1'>
          The business owner must submit the Notice of Intent a minimum of 6 weeks before an e-substance is first sold from the sales premises. The Notice of Intent must also be submitted prior to January 15 of each year that a retailer intends to continue sales.
        </Typography>
        <Box mb={2} />
        <Typography variant='body1'>
          Retailers can update business information and location details before an NOI has been submitted/renewed. Once the NOI has been submitted for a location, the location details cannot be edited.
        </Typography>
      </>
      <FullScreen fullScreenProp={outstandingFullscreenState}>
        <OutstandingNoiTable
          data={outstanding || []}
          handleActionButton={() => { navigate('/noi/submit') }}
          fullScreenProp={outstandingFullscreenState}
        />
      </FullScreen>
      <FullScreen fullScreenProp={missingSalesFullScreenState}>
        <NoiMissingSalesReportTable
          data={missingSales || []}
          fullScreenProp={missingSalesFullScreenState}
        />
      </FullScreen>
      <FullScreen fullScreenProp={submittedFullscreenState}>
        <SubmittedNoiTable
          data={submitted || []}
          fullScreenProp={submittedFullscreenState}
          downloadAction={printDocument}
        />
      </FullScreen>
    </StyledWrapper>
  );
}