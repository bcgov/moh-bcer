import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Typography,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import {
  StyledTable,
  StyledButton,
  StyledWarning,
} from 'vaping-regulation-shared-components';
import { ProductInfoContext } from '@/contexts/ProductReport';
import { useValidator } from '@/hooks/useValidator';
import { ProductReportCsvValidation } from '@/components/form/validations/CsvSchemas/vProductReportCsv';
import { ProductUtil } from '@/utils/product.util';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { getInitialPagination } from '@/utils/util';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71',
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  boxTitle: {
    paddingBottom: '10px',
  },
  tableRowCount: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: '10px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px',
  },
  checkboxLabel: {
    marginTop: '20px',
  },
  formControl: {
    fontSize: '14px',
    '& .MuiIconButton-colorSecondary': {
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      },
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    '& .Mui-checked': {
      color: '#0053A4',
    },
  },
});

export default function ConfirmProducts() {
  const classes = useStyles();
  const history = useHistory();
  const [filterTable, setFilterTable] = useState(false);
  const viewFullscreenTable = useState<boolean>(false);

  const [productInfo, setProductInfo] = useContext(ProductInfoContext);
  const {
    errors: uploadErrors,
    validatedData = [],
    erroredOnlyData = [],
    validate,
  } = useValidator();

  useEffect(() => {
    if (productInfo?.products?.length) {
      validate(ProductReportCsvValidation, productInfo.products);
    }
  }, [productInfo?.products]);
  
  return (
    <>
      <div>
        <StyledButton onClick={() => history.push('/products/add-reports')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant="h5" className={classes.title}>
          Confirm Product List
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant="body1">
            Please confirm that your product list file has imported correctly.
            Once you confirm your product file, press the "Next" button to
            select which location(s) this product list applies to.
          </Typography>
        </div>
        <Paper className={classes.box} variant="outlined">
          <Typography variant="subtitle1">Confirm Product List</Typography>
          {!!erroredOnlyData?.length && (
            <StyledWarning
              text={`There are ${erroredOnlyData.length} error(s) found. Please resolve them and try again. You can download the Error Report by clicking on “Download Errors CSV” button.`}
            />
          )}
          <div className={classes.actionsWrapper}>
            <Box>
              <Typography variant="body2">
                {productInfo?.products?.length} products found
              </Typography>
              {!!erroredOnlyData?.length &&<FormControlLabel
                className={classes.formControl}
                label={`Only display products in error (${erroredOnlyData.length} Product(s))`}
                labelPlacement="end"
                control={
                  <Checkbox
                    onChange={(event) => setFilterTable(event.target.checked)}
                    color="primary"
                  />
                }
              />}
            </Box>
            <Box display="flex">
              {productInfo?.products?.length > 0 ? (
                <CSVLink
                  {...ProductUtil.getCsvProp(
                    productInfo.products,
                    'product_report'
                  )}
                  className={classes.csvLink}
                  target="_blank"
                >
                  <StyledButton variant="table">
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              ) : null}
              {uploadErrors?.length > 0 && (
                <Box ml={2}>
                  <CSVLink
                    headers={['Row', 'Field', 'Value', 'Message']}
                    data={uploadErrors?.map((error) => {
                      return [error.row, error.field, error.value, error.message];
                    })}
                    filename={'product_report_errors.csv'}
                    className={classes.csvLink}
                    target="_blank"
                  >
                    <StyledButton variant="table">
                      <SaveAltIcon className={classes.buttonIcon} />
                      Download Errors CSV
                    </StyledButton>
                  </CSVLink>
                </Box>
              )}
            </Box>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <FullScreen fullScreenProp={viewFullscreenTable}>
              <TableWrapper
                 data={filterTable ? erroredOnlyData : validatedData}
                 fullScreenProp={viewFullscreenTable}
                 isOutlined={false}
              >
                <StyledTable
                  options={{
                    pageSize: getInitialPagination(filterTable ? erroredOnlyData : validatedData),
                    pageSizeOptions: [5, 10, 20, 30, 50]
                  }}
                  columns={ProductUtil.columns}
                  data={filterTable ? erroredOnlyData : validatedData}
                />
              </TableWrapper>
            </FullScreen>
          </div>
        </Paper>
        <div></div>
        <div className={classes.submitWrapper}>
          <StyledButton
            variant="contained"
            onClick={() => history.push('/products/select-locations')}
            disabled={!!uploadErrors?.length}
          >
            Next
          </StyledButton>
        </div>
      </div>
    </>
  );
}
