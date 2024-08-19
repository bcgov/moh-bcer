import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  Typography,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

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

const PREFIX = 'ConfirmProducts';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  box: `${PREFIX}-box`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  csvLink: `${PREFIX}-csvLink`,
  submitWrapper: `${PREFIX}-submitWrapper`,
  checkboxLabel: `${PREFIX}-checkboxLabel`,
  formControl: `${PREFIX}-formControl`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71',
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
    paddingBottom: '10px',
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px',
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: '10px',
  },
  [`& .${classes.csvLink}`]: {
    textDecoration: 'none',
  },
  [`& .${classes.submitWrapper}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px',
  },
  [`& .${classes.checkboxLabel}`]: {
    marginTop: '20px',
  },
  [`& .${classes.formControl}`]: {
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

  const navigate = useNavigate();
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
    (<Root>
      <div>
        <StyledButton onClick={() => navigate('/products/add-reports')}>
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
            onClick={() => navigate('/products/select-locations')}
            disabled={!!uploadErrors?.length}
          >
            Next
          </StyledButton>
        </div>
      </div>
    </Root>)
  );
}
