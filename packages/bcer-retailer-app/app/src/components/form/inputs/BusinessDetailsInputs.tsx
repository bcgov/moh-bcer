import React, { useContext, useEffect, useState } from 'react';
import { Grid, Typography, styled, Tooltip, IconButton } from '@mui/material';
import { StyledSelectField, StyledTextField } from 'vaping-regulation-shared-components';
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import { provinceOptions } from '@/constants/arrays';
import { BIContext, BusinessInfoContext } from '@/contexts/BusinessInfo';
import SubmitBusinessInfoButton from '@/components/MyBusiness/SubmitBusinessInfoButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useFormikContext } from 'formik';

const FormBorderGrid = styled(Grid)(({ theme }) => ({
  padding: '25px 20px 15px 20px',
  border: '1px solid #CDCED2',
  borderRadius: '5px',
  backgroundColor: '#fff',
  margin: '-8px',
}));

const PaddedGrid = styled(Grid)(({ theme }) => ({
  '&.MuiGrid-item': {
    padding: theme.spacing(1), // 1 unit = 8px
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontSize: '17px',
  fontWeight: 600,
  paddingBottom: '24px'
}));

const LabelContainer = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'normal',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#0053A4',
  padding: '0 4px',
  marginLeft: theme.spacing(1),
  verticalAlign: 'middle',
}));

function BusinessDetailsInputs() {
  const [businessInfo, setBusinessInfo] = useContext<[BIContext, Function]>(BusinessInfoContext);
  const [initialState, setInitialState] = useState(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const { handleBlur } = useFormikContext();
  
  useEffect(() => {
    if (Object.keys(businessInfo.details).length > 0) {
      if(businessInfo.details.legalName !== ''){
        setInitialState(businessInfo.details);
      }
    }
  }, [businessInfo]);

  const handleFocus = (field: string) => {
    setEditingField(field);
  };

  const handleBlurOfLegalName = (event: any) => {
    setEditingField(null);
    handleBlur(event);
  };

  return (
    <FormBorderGrid container spacing={2}>
      <PaddedGrid item xs={12}>
        <FormTitle variant='h6'>
          Please confirm your business details below
        </FormTitle>
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <LabelContainer>
          <RequiredFieldLabel label="Business legal name" />
          {editingField === 'legalName' && (
            <Tooltip title="This is the legal business name (i.e., 498390 Shell Ltd)." arrow>
              <StyledIconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </StyledIconButton>
            </Tooltip>
          )}
        </LabelContainer>
        <StyledTextField
          name="legalName"
          fullWidth
          onFocus={() => handleFocus('legalName')}
          onBlur={handleBlurOfLegalName}
        />
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Name under which business is conducted"/>}
          name="businessName"
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business address line 1"/>}
          name="addressLine1"
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label="Business address line 2"
          name="addressLine2"
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="City"/>}
          name="city"
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid container item xs={12} md={6} spacing={1}>  
        
      <PaddedGrid item xs={6}>
        <StyledSelectField
          label={<RequiredFieldLabel label="Province"/>}
          name="province"
          options={provinceOptions}
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid item xs={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Postal code"/>}
          name="postal"          
        />
      </PaddedGrid>

      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business phone number"/>}
          name="phone"
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business email"/>}
          name="email"
          fullWidth
        />
      </PaddedGrid>

      <PaddedGrid item xs={12} md={6}>
        <StyledTextField
          label="Business web page"
          name="webpage"
          fullWidth
        />
      </PaddedGrid> 

      {initialState &&
      <PaddedGrid item xs={12} md={6}>
        <SubmitBusinessInfoButton updateType="businessInfoOnly" />
      </PaddedGrid>
      }
    </FormBorderGrid>
  );
}

export default BusinessDetailsInputs;
