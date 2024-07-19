import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Paper } from '@mui/material';

import { SuccessStepEnum } from '@/constants/localEnums';
import SuccessStep from '@/components/successStep/SuccessStep';
import FileCheckGreen from '@/assets/images/file-check-green.png';

const StyledPaper = styled(Paper)(({ theme }) => ({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem 1.4rem 0rem 1.4rem',
  marginBottom: '30px'
}));

const SuccessBanner = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#E7F9EA',
  borderRadius: '4px',
  padding: '20px',
  alignItems: 'center',
  marginBottom: '20px',
}));

const BannerIcon = styled('img')({
  height: '45px',
  paddingRight: '20px'
});

const BannerText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#3A3A3A'
}));

const Description = styled(Typography)(({ theme }) => ({
  color: '#565656',
  paddingBottom: '20px'
}));

const StepsSubtitle = styled(Typography)(({ theme }) => ({
  paddingBottom: '20px'
}));

export default function NoiSubmission() {
  return (
    <StyledPaper variant='outlined'>
      <SuccessBanner>
        <BannerIcon src={FileCheckGreen} alt="Success" />
        <BannerText variant='body2'>Your Notice of Intent has been submitted.</BannerText>
      </SuccessBanner>
      <Description variant='body1'>
        To continue to sell vape products you must also submit the following items: 
        Product Reports and Manufacturing Reports (if your retail locations also manufacture e-vape products)
      </Description>
      <StepsSubtitle variant="subtitle1">Next steps</StepsSubtitle>
      <SuccessStep active={false} completed={true} step={SuccessStepEnum.noi}/>
      <SuccessStep active={true} completed={false} step={SuccessStepEnum.product}/>
      <SuccessStep active={true} completed={false} step={SuccessStepEnum.manufacturing}/>
      <SuccessStep active={true} completed={false} step={SuccessStepEnum.sale}/>
    </StyledPaper>
  );
}