import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { CSVLink } from 'react-csv';
import { StyledButton } from 'vaping-regulation-shared-components';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const SubtitleWrapper = styled('div')({
  display: 'flex',
  alignItems: 'bottom',
  justifyContent: 'space-between',
  padding: '30px 0px 10px 0px',
});

const Subtitle = styled(Typography)({
  color: '#0053A4',
});

const BoxTitle = styled(Typography)({
  paddingBottom: '10px',
});

const TableRowCount = styled(Typography)({
  paddingBottom: '10px',
});

const ActionsWrapper = styled('div')({
  display: 'flex',
  paddingBottom: '10px',
});

const HeaderWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

const CsvLink = styled(CSVLink)({
  textDecoration: 'none',
  marginRight: '10px',
});

const ButtonIcon = styled(SaveAltIcon)({
  paddingRight: '5px',
  color: '#285CBC',
  fontSize: '20px',
});

const Box = styled(Paper)({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
});

const ButtonWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

interface TableWrapperProp {
  data: Array<any>;
  children: React.ReactNode;
  blockHeader?: string | React.ReactNode;
  tableHeader?: string | React.ReactNode;
  tableSubHeader?: string | React.ReactNode;
  tableButton?: React.ReactNode;
  csvProps?: CsvProps;
  fullScreenProp?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  isOutlined?: boolean;
}

interface CsvProps {
  data: Array<any>;
  headers: Array<string>;
  filename: string;
}

function TableWrapper({
  data,
  children,
  blockHeader,
  tableHeader,
  tableSubHeader,
  tableButton,
  csvProps,
  fullScreenProp,
  isOutlined = true,
}: TableWrapperProp) {

  function TableContainer({ children }: { children: React.ReactNode }) {
    if (!isOutlined) {
      return <Paper style={{ boxShadow: 'none' }}>{children}</Paper>;
    } else {
      return (
        <Box style={{ boxShadow: 'none' }} variant="outlined">
          {children}
        </Box>
      );
    }
  }

  return (
    <div>
      {blockHeader && (
        <SubtitleWrapper>
          <Subtitle variant="h6">{blockHeader}</Subtitle>
        </SubtitleWrapper>
      )}
      <TableContainer>
        <HeaderWrapper>
          <div>
            {tableHeader && (
              <BoxTitle variant="subtitle1">{tableHeader}</BoxTitle>
            )}
            {tableSubHeader && (
              <TableRowCount variant="body2">{tableSubHeader}</TableRowCount>
            )}
          </div>
          {!!data.length && tableButton ? (
            <ButtonWrapper>{tableButton}</ButtonWrapper>
          ) : null}
        </HeaderWrapper>
        <ActionsWrapper>
          {!!data.length && csvProps ? (
            <CsvLink {...csvProps} target="_blank">
              <StyledButton variant="table" size="small">
                <ButtonIcon />
                Download CSV
              </StyledButton>
            </CsvLink>
          ) : null}
          {!!data.length && fullScreenProp && !fullScreenProp[0] && (
            <StyledButton
              variant="table"
              size="small"
              onClick={() => fullScreenProp[1]((current) => !current)}
            >
              <ZoomOutMapIcon sx={{ paddingRight: '5px', color: '#285CBC', fontSize: '20px' }} />
              View Fullscreen
            </StyledButton>
          )}
        </ActionsWrapper>
        <div>{children}</div>
      </TableContainer>
    </div>
  );
}

export default TableWrapper;
