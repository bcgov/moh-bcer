import { BusinessLocation } from "@/constants/localInterfaces";
import React from "react";
import styled from "styled-components";
import logo from "../../assets/images/bc-logo.png";

const Container = styled.div`
  width: 535px;
  padding: 30px;
  display: flex;
  flex-direction: column;

  /* Default styles for <Box> component */
  margin: 0;
  border: 0;
  vertical-align: baseline;
  box-sizing: border-box;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
`;

const Header = styled.p`
  font-size: 14px;
  color: #002c71;
  font-weight: bold;
  word-spacing: 6px;
  margin: 0;
`;

const LocationStatusImg = styled.img`
  height: 215px;
  width: 540px;

  @media (max-width: 600px) {
    height: 250px;
  }
`;

type LocationDetailsPdfProps = {
  location: BusinessLocation;
  locationStatusImg: string;
  userInfoImg: string;
  locationInfoImg: string;
};

export function LocationDetailsPdf({
  location,
  locationStatusImg,
  userInfoImg,
  locationInfoImg,
}: LocationDetailsPdfProps) {
  return (
    <Container>
      <Logo>
        <img src={logo} alt="BC Logo" style={{ height: "70px", width: "90px" }} />
        <Header style={{ fontSize: "16px" }}>E-Substances Regulation</Header>
      </Logo>
      <Header>{location.business.businessName}</Header>
      <LocationStatusImg src={locationStatusImg} alt="Location Status Screenshot" />
      <img src={userInfoImg} alt="User Information Screenshot" style={{ height: "80px", width: "540px" }} />
      <img src={locationInfoImg} alt="Location Information Screenshot" style={{ height: "280px", width: "540px" }} />
    </Container>
  );
}