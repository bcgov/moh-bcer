import React, { useContext, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { CSVLink } from 'react-csv';
import { Checkbox, FormControlLabel, makeStyles, Typography } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { StyledButton, StyledTable, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import WarningIcon from '@mui/icons-material/Warning';
import CircularProgress from '@mui/material/CircularProgress';

import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessInfoContext } from '@/contexts/BusinessInfo';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import { useCsvValidator } from '@/hooks/useCsvValidator';
import { BusinessCsvValidation } from '@/components/form/validations/CsvSchemas/vBusinessLocationsCsv';
import { editLocationFormatting } from '@/utils/formatting';
import { LocationUtil } from '@/utils/location.util';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { getInitialPagination } from '@/utils/util';

const PREFIX = 'ConfirmLocations';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  buttonIconLight: `${PREFIX}-buttonIconLight`,
  csvLink: `${PREFIX}-csvLink`,
  subHeader: `${PREFIX}-subHeader`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  tableWrapper: `${PREFIX}-tableWrapper`,
  locationCount: `${PREFIX}-locationCount`,
  tableWrapperSubheader: `${PREFIX}-tableWrapperSubheader`,
  errorCountBox: `${PREFIX}-errorCountBox`,
  warningIcon: `${PREFIX}-warningIcon`,
  errorCountBoxText: `${PREFIX}-errorCountBoxText`,
  formControl: `${PREFIX}-formControl`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  [`& .${classes.buttonIconLight}`]: {
    paddingRight: '5px',
    color: '#fff',
    fontSize: '20px',
  },
  [`& .${classes.csvLink}`]: {
    textDecoration: 'none',
  },
  [`& .${classes.subHeader}`]: {
    fontSize: '16px',
    color: '#A3A3A3',
    paddingBottom: '30px',
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    alignItems: 'center',
  },
  [`& .${classes.tableWrapper}`]: {
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff',
    padding: '20px',
  },
  [`& .${classes.locationCount}`]: {
    fontSize: '14px',
    color: '#3A3A3A',
    paddingBottom: '10px'
  },
  [`& .${classes.tableWrapperSubheader}`]: {
    fontSize: '14px',
    color: '#3A3A3A',
  },
  [`& .${classes.errorCountBox}`]: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #F9F1C6',
    backgroundColor: '#FAF3CA',
    color: '#785400',
    marginBottom: '20px',
    alignItems: 'center',
  },
  [`& .${classes.warningIcon}`]: {
    color: '#785400',
    padding: '0px 10px 0px 0px'
  },
  [`& .${classes.errorCountBoxText}`]: {
    fontSize: '16px', 
    fontWeight: 600
  },
  [`& .${classes.formControl}`]: {
    fontSize: '14px',
    '& .MuiIconButton-colorSecondary':{
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      }
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    '& .Mui-checked': {
      color: '#0053A4'
    },
  },
}));

interface ConfirmLocationsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ConfirmLocations({ isLoading, setIsLoading }: ConfirmLocationsProps) {

  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);
  const [targetRow, setTargetRow] = useState<IBusinessLocationValues>();
  const [isEditOpen, setOpenEdit] = useState<boolean>();
  const [isDeleteOpen, setOpenDelete] = useState<boolean>();
  const [filterTable, setFilterTable] = useState<boolean>(false);
  const viewFullscreenTable = useState<boolean>(false);
  const [newLocations, setNewLocations] = useState<Array<IBusinessLocationValues>>([]);
  const { errors: uploadErrors, validatedData, validateCSV, duplicateWarning, duplicateCount } = useCsvValidator();

  useEffect(() => {
    setNewLocations(businessInfo.locations.filter((l: any) => !l.id)); //locations without id are new
  }, [businessInfo.locations])

  useEffect(() => {
    const validateAndCheckDuplicates = async () => {
      setIsLoading(true);
      await validateCSV(BusinessCsvValidation, newLocations);
      setIsLoading(false);
    };
    validateAndCheckDuplicates();
  }, [newLocations]);

  useEffect(() => {
    if (uploadErrors !== undefined) {
      setBusinessInfo({...businessInfo, uploadErrors: uploadErrors})
    }
  }, [uploadErrors])

  const confirmDelete = () => {
    const remainder = newLocations.filter((element: IBusinessLocationValues) =>{
      return element.tableData.id !== targetRow.tableData.id
    })
    const existingLocations = businessInfo.locations.filter((l: any) => !!l.id);
    setBusinessInfo({...businessInfo, locations: [...existingLocations, ...remainder]});
    setOpenDelete(false);
  }

  const handleDelete = (rowData: IBusinessLocationValues) => {
    setTargetRow(rowData);
    setOpenDelete(true);
  }

  const handleEdit = (rowData: IBusinessLocationValues) => {
    setTargetRow(rowData);
    setOpenEdit(true);
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    (<Root>
      <div className={classes.subHeader} >
        Please confirm your business locations. Ensure that all locations have been entered correctly
        as they are required when submitting reports and your notice of intent to sell e-substances.
      </div>
      <div className={classes.tableWrapper}>
        {
          (validatedData?.length) 
            ?
          <FullScreen fullScreenProp={viewFullscreenTable}>
            <TableWrapper
              tableHeader='Business Locations'
              tableSubHeader={`You have ${newLocations?.length ? newLocations.length : '0'} retail locations.`}
              data={filterTable ? validatedData.filter(e => e.error === true) : validatedData} 
              fullScreenProp={viewFullscreenTable} 
              isOutlined={false}
            >
              <div className={classes.tableWrapperSubheader}>
                {
                  uploadErrors?.length > 0
                    &&
                  <div className={classes.errorCountBox}>
                    <WarningIcon className={classes.warningIcon}/>
                    <Typography className={classes.errorCountBoxText}>
                      {
                        uploadErrors.length > 1 
                          ?
                            `There are ${uploadErrors.length} errors found. `
                          :
                            `There is 1 error found. `
                      }
                      You can download the Error Report by clicking on the "Download Error CSV" button.
                    </Typography>
                  </div>

                }
                {
                  duplicateCount > 0
                    &&
                  <div className={classes.errorCountBox}>
                    <WarningIcon className={classes.warningIcon}/>
                    <Typography className={classes.errorCountBoxText}>
                      {
                        duplicateCount > 1 
                          ?
                            `There are ${duplicateCount} duplicate addresses found. `
                          :
                            `There is 1 duplicate address found. `
                      }
                      {duplicateWarning}
                    </Typography>
                  </div>

                }
                <div className={classes.actionsWrapper} >
                <FormControlLabel
                  className={classes.formControl}
                  label='Only display locations in error'
                  labelPlacement="end"
                  control={
                    <Checkbox
                      checked={filterTable}
                      onChange={(event) => setFilterTable(event.target.checked)}
                      color='primary'
                    />
                  }
                />
                  {
                    uploadErrors?.length > 0
                      ?
                    <CSVLink
                      headers={['Row', 'Field', 'Message']}
                      data={uploadErrors?.map(error => {
                        return [error.row, error.field, error.message];
                      })}
                      filename={'location_errors.csv'} className={classes.csvLink} target='_blank'>
                      <StyledButton variant='contained'>
                        <SaveAltIcon className={classes.buttonIconLight} />
                        Download Errors CSV
                      </StyledButton>
                    </CSVLink>
                      :
                    <CSVLink
                      headers={Object.keys(BusinessLocationHeaders)}
                      data={newLocations?.map((l: any) => {
                        return [l.addressLine1, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                      })}
                      filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                      <StyledButton variant='outlined'>
                        <SaveAltIcon className={classes.buttonIcon} />
                        Download CSV
                      </StyledButton>
                    </CSVLink>
                  }
                </div>
              </div>

                  <StyledTable
                    options={{
                      fixedColumns: {
                        right: 1,
                      },
                      pageSize: getInitialPagination(validatedData),
                      pageSizeOptions: [5, 10, 20, 30, 50]
                    }}
                    columns={[                      
                      ...LocationUtil.getTableColumns(),
                      {title: '', render: LocationUtil.renderNewLocationActions({ handleEdit, handleDelete }), width: 100}
                    ]}
                    data={filterTable ? validatedData.filter(e => e.error === true) : validatedData}
                    editHandler={(rowData: IBusinessLocationValues) => handleEdit(rowData)}
                    deleteHandler={(rowData: IBusinessLocationValues) => handleDelete(rowData)}
                  />
            </TableWrapper>
          </FullScreen>
            : null
        }
      </div>
      {
        targetRow
          &&
        <LocationsEditForm rowData={editLocationFormatting(targetRow)} 
          openProps={{isOpen: isEditOpen, toggleOpen: setOpenEdit}} 
        />
      }
      {
        isDeleteOpen
          &&
        <StyledConfirmDialog 
          open={isDeleteOpen}
          maxWidth='xs'
          dialogTitle='Delete location'
          checkboxLabel='I understand that I cannot submit a Notice of Intent for this location if I chose to delete it.' 
          dialogMessage='If you delete this location you will be unable to submit a Notice of Intent for this location.' 
          setOpen={() => setOpenDelete(false)} 
          confirmHandler={confirmDelete} 
        />
      }
    </Root>)
  );
}
