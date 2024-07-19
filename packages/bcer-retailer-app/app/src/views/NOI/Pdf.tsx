import { BusinessLocation } from '@/constants/localInterfaces';
import { NoiPdfUtil } from '@/utils/noi.util';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import noiImage from '../../assets/images/noi.png';

const Container = styled(Box)(({ theme }) => ({
  height: '781px',
  width: '535px',
  position: 'relative',
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: 100,
  top: '128px',
  left: '28px',
  width: '100%',
}));

const Header = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  lineHeight: '27px',
  textAlign: 'center',
  color: '#002C71',
  fontWeight: 'bold',
  marginBottom: '10px',
}));

const HeaderV2 = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  lineHeight: '27px',
  textAlign: 'center',
  color: '#002C71',
  fontWeight: 'bold',
  marginBottom: '5px',
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: '20px',
  textAlign: 'center',
  color: '#002C71',
}));

const BodyWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: 100,
  top: '212px',
  left: '110px',
  width: '375px',
  paddingTop: '15px',
}));

const BodyWrapperV2 = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: 100,
  top: '212px',
  left: '100px',
  width: '395px',
  paddingTop: '5px',
}));

const InfoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: '20px',
}));

const InfoWrapperV3 = styled(Box)(({ theme }) => ({
  marginBottom: '20px',
  textAlign: 'center',
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontSize: '14px',
  lineHeight: '19px',
  flex: 0.55,
}));

const InfoLabelV2 = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontSize: '12px',
  lineHeight: '17px',
  flex: 0.45,
}));

const InfoData = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontSize: '14px',
  lineHeight: '19px',
  fontWeight: 'bold',
  flex: 0.5,
  overflowWrap: 'anywhere',
}));

const InfoDataV2 = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontSize: '12px',
  lineHeight: '17px',
  fontWeight: 'bold',
  flex: 0.5,
  overflowWrap: 'anywhere',
}));

const InfoDataV3 = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontSize: '11px',
  lineHeight: '16px',
  fontWeight: 'bold',
  flex: 0.5,
  overflowWrap: 'anywhere',
}));

const BottomTextWrapper = styled(Box)(({ theme }) => ({
  marginBottom: '24px',
}));

const BottomTextWrapperV3 = styled(Box)(({ theme }) => ({
  margin: '20px 0 30px',
}));

const BottomText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: '22px',
  textAlign: 'center',
  color: '#002C71',
}));

const DateText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '19px',
  textAlign: 'center',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  padding: '0 7px 7px',
  marginBottom: '5px',
  color: '#333',
}));

const DateLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '17px',
  textAlign: 'center',
  color: '#333',
}));

type PdfProps = {
  location: BusinessLocation;
  legalName: string;
};

function Pdf({ location, legalName }: PdfProps) {
  const { responsiveClass } = new NoiPdfUtil(
    location,
    legalName,
    {}
  ).build();

  const formattedData = NoiPdfUtil.formatNoiData(location, legalName);

  return (
    <Container>
      <img src={noiImage} style={{ height: '841px', width: '595px' }} alt="NOI Background" />
      <HeaderWrapper>
        <Header>B.C. E-Substances Regulation</Header>
        <SubHeader>Notice of Intent to Sell E-Substances</SubHeader>
        <SubHeader>Confirmation of Submission</SubHeader>
      </HeaderWrapper>
      <BodyWrapper>
        <InfoWrapper>
          <InfoLabel>Type of Location:</InfoLabel>
          <InfoData>{formattedData.formattedLocationType}</InfoData>
        </InfoWrapper>
        <InfoWrapper>
          <InfoLabel>Business Name:</InfoLabel>
          <InfoData>{formattedData.businessName}</InfoData>
        </InfoWrapper>
        <InfoWrapper>
          <InfoLabel>Business Legal Name:</InfoLabel>
          <InfoData>{formattedData.legalName}</InfoData>
        </InfoWrapper>
        {formattedData.locationType === 'online' ? (
          <InfoWrapper>
            <InfoLabel>URL:</InfoLabel>
            <InfoData>{formattedData.webpage}</InfoData>
          </InfoWrapper>
        ) : (
          <InfoWrapper>
            <InfoLabel>Location:</InfoLabel>
            <InfoData>
              {formattedData.address}
              <span style={{ display: 'inline-block' }}>{formattedData.postal}</span>
            </InfoData>
          </InfoWrapper>
        )}
        <InfoWrapper>
          <InfoLabel>Location permits all ages:</InfoLabel>
          <InfoData>{formattedData.ageRestricted}</InfoData>
        </InfoWrapper>
        <InfoWrapper>
          <InfoLabel>Manufacture e-substances:</InfoLabel>
          <InfoData>{formattedData.manufacturing}</InfoData>
        </InfoWrapper>
        <BottomTextWrapper>
          <BottomText>
            This e-substance retailer has submitted their Notice of Intent and is eligible to sell
            e-substances as of {formattedData.effectiveOperationDate}.
          </BottomText>
        </BottomTextWrapper>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <DateText>{formattedData.submissionDate}</DateText>
            <DateLabel>Date Submitted</DateLabel>
          </Box>
          {!!formattedData.renewalDate && (
            <Box>
              <DateText>{formattedData.renewalDate}</DateText>
              <DateLabel>Date Renewed</DateLabel>
            </Box>
          )}
          <Box>
            <DateText>{formattedData.expiryDate}</DateText>
            <DateLabel>Date of Expiry</DateLabel>
          </Box>
        </Box>
      </BodyWrapper>
    </Container>
  );
}

export default Pdf;