import { BCDirectionData, BusinessLocation } from '@/constants/localInterfaces';
import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/images/bc-logo.png';
import { MapUtil } from '@/util/map.util';

const Container = styled.div`
  width: 535px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding-bottom: 20px;
`;

const Itinerary = styled.div`
  padding-bottom: 20px;
`;

const Header = styled.div`
  font-size: 14px;
  color: #002c71;
  font-weight: bold;
  word-spacing: 6px;
`;

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const GridItem = styled.div`
  flex: 1;
  min-width: calc(50% - 16px);
`;

type ItineraryPdfProps = {
  routeData: BCDirectionData;
  locations: BusinessLocation[];
  imageString: string;
};

function ItineraryPdf({ routeData, locations, imageString }: ItineraryPdfProps) {
  const formattedData = MapUtil.formatLocationsForPDF(locations, routeData);

  return (
    <Container>
      <Logo>
        <img src={logo} alt="BC Logo" style={{ height: '70px', width: '90px' }} />
        <Header style={{ fontSize: '16px' }}>E-Substances Regulation</Header>
      </Logo>

      <Itinerary>
        <Header>Itinerary</Header>
        <div style={{ marginTop: '8px' }} />
        <img src={imageString} alt="Itinerary Map" style={{ height: '330px', width: '540px' }} />
      </Itinerary>

      <GridContainer>
        <GridItem>
          <Header>Directions</Header>
          <div style={{ marginTop: '8px' }} />
          {formattedData.directions}
        </GridItem>
        <GridItem>
          <Header>Business Location</Header>
          <div style={{ marginTop: '8px' }} />
          {formattedData.locations}
        </GridItem>
      </GridContainer>
    </Container>
  );
}

export default ItineraryPdf;