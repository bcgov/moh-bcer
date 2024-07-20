import React from 'react';
import styled from 'styled-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { NoiPdfUtil } from '@/utils/noi.util';
import noiImage from '../../assets/images/noi.png';

const Container = styled.div`
  height: 781px;
  width: 535px;
  position: relative;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const HeaderWrapper = styled.div`
  position: absolute;
  z-index: 100;
  top: 128px;
  left: 28px;
  width: 100%;
`;

const Header = styled.h1`
  font-size: 20px;
  line-height: 27px;
  text-align: center;
  color: #002C71;
  font-weight: bold;
  margin-bottom: 10px;
  margin: 0;
`;

const SubHeader = styled.h2`
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #002C71;
  font-weight: 400;
  margin: 0;
`;

const BodyWrapper = styled.div`
  position: absolute;
  z-index: 100;
  top: 212px;
  left: 110px;
  width: 375px;
  padding-top: 15px;
`;

const InfoWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const InfoLabel = styled.span`
  color: #333;
  font-size: 14px;
  line-height: 19px;
  flex: 0.55;
`;

const InfoData = styled.span`
  color: #333;
  font-size: 14px;
  line-height: 19px;
  font-weight: bold;
  flex: 0.5;
  overflow-wrap: anywhere;
`;

const BottomTextWrapper = styled.div`
  margin-bottom: 24px;
`;

const BottomText = styled.p`
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #002C71;
  margin: 0;
`;

const DateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DateBox = styled.div``;

const Date = styled.p`
  font-size: 12px;
  line-height: 19px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid black;
  padding: 0 7px 7px;
  margin-bottom: 5px;
  color: #333;
`;

const DateLabel = styled.p`
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  color: #333;
  margin: 0;
`;

type PdfProps = {
  location: BusinessLocation;
  legalName: string;
};

function Pdf({ location, legalName }: PdfProps) {
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
        <DateWrapper>
          <DateBox>
            <Date>{formattedData.submissionDate}</Date>
            <DateLabel>Date Submitted</DateLabel>
          </DateBox>
          {!!formattedData.renewalDate && (
            <DateBox>
              <Date>{formattedData.renewalDate}</Date>
              <DateLabel>Date Renewed</DateLabel>
            </DateBox>
          )}
          <DateBox>
            <Date>{formattedData.expiryDate}</Date>
            <DateLabel>Date of Expiry</DateLabel>
          </DateBox>
        </DateWrapper>
      </BodyWrapper>
    </Container>
  );
}

export default Pdf;