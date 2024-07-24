import React, { useState, useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import ManufacturingReportForm from '@/components/form/forms/ManufacturingReportForm';
import ManufacturingReportSubmitButton from '@/components/ManufacturingReports/SubmitButton';

import { useAxiosGet } from '@/hooks/axios';

import { StyledButton, StyledTable, LocationTypeLabels, LocationType } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { getInitialPagination } from '@/utils/util';

const PREFIX = 'Submit';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  box: `${PREFIX}-box`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  submitWrapper: `${PREFIX}-submitWrapper`,
  section: `${PREFIX}-section`,
  highlightedText: `${PREFIX}-highlightedText`
};

const Root = styled('div')({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71'
  },
  [`& .${classes.helpTextWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  [`& .${classes.helperIcon}`]: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  [`& .${classes.boxTitle}`]: {
    padding: '10px 0px'
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px'
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  [`& .${classes.submitWrapper}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
  [`& .${classes.section}`]: {
    margin: '2rem 0',
  },
  [`& .${classes.highlightedText}`]: {
    fontWeight: 600,
    color: 'black'
  },
});

export default function ManufacturingSubmit() {

  const navigate = useNavigate();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const viewFullscreenTable = useState<boolean>(false);
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/manufacturing/locations`);
  const [tableData, setTableData] = useState<Array<BusinessLocation & { tableData: { checked: boolean } }>>([]);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])
  
  useEffect(() => {
    if (locations.length > 0) {
      const initialTableData = locations.map((location: any) => ({
        ...location,
        tableData: { checked: false }
      }));
      setTableData(initialTableData);
    }
  }, [locations]);
  
  return (loading) ? <CircularProgress /> : (
    <Root>
      <div>
        <StyledButton onClick={() => navigate('/manufacturing')}>
          <ArrowBackIcon className={classes.buttonIcon} /> Back
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Add Manufacturing Report
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
          You are required to enter this information manually. This section only applies to retailers that formulate, package or re-package e-substances for sale from their retail location.
          If you believe this does not apply to your business or any of your locations, please return to the business details section and select <span className={classes.highlightedText}>“No”</span> on the question <span className={classes.highlightedText}>“Does your business formulate, package or re-package e-substances for sale in your retail location?”</span>
          </Typography>
        </div>

        <ManufacturingReportForm>
          <FullScreen fullScreenProp={viewFullscreenTable}>
            <TableWrapper
              tableHeader={<Typography className={classes.boxTitle} variant='h6'>2. Location Information</Typography>}
              tableSubHeader='Please select the location(s) that this manufacturing report applies to'
              data={locations}
              fullScreenProp={viewFullscreenTable}
              isOutlined={false} 
            >
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <StyledTable
                columns={[
                  {title: 'Type of Location', render: (rd: BusinessLocation) => `${LocationTypeLabels[rd.location_type]}`},
                  {title: 'Address/URL', render: (rd: BusinessLocation) => rd.location_type === LocationType.online ? rd.webpage : `${rd.addressLine1}, ${rd.postal}, ${rd.city}`},
                  {title: 'Email Address', field: 'email'},
                  {title: 'Phone Number', field: 'phone'},
                ]}
                data={tableData}
                options={{ 
                  selection: true, 
                  pageSize: getInitialPagination(tableData),
                  pageSizeOptions: [5, 10, 20, 30, 50] 
                }}
                onSelectionChange={(rows: any) => {
                  const updatedTableData = tableData.map(row => ({
                    ...row,
                    tableData: { ...row.tableData, checked: rows.some((selectedRow: BusinessLocation) => selectedRow.id === row.id) }
                  }));
                  setTableData(updatedTableData);
                  setSelectedLocations(rows.map((row: BusinessLocation) => row.id));
                }}
              />
              </div>
            </TableWrapper>
          </FullScreen>
          <div className={classes.submitWrapper}>
            <ManufacturingReportSubmitButton selectedLocations={selectedLocations} />
          </div>
        </ManufacturingReportForm>
      </div>
    </Root>
  );
}
