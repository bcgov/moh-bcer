import React, { useState, useEffect, useRef } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import useLocation from '@/hooks/useLocation';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';

const StyledSelect = styled(Select)({
  '& .MuiInputBase-input': {
    color: 'black',
    fontSize: '14px',
    fontWeight: 600,
    WebkitTextFillColor: 'black',
  },
  '& .MuiInput-underline:before': {
    borderBottomStyle: 'none',
  },
  '& .MuiSelect-select:focus': {
    backgroundColor: 'transparent',
  },
  '& .Mui-selected': {
    backgroundColor: 'transparent !important',
  },
});

interface StyledEditableDropdownProps {
  id: string;
  value: any;
  type: string;
  options: Array<{ label: string; value: any }>;
  onSuccessfulUpdate?: (data: string) => void;
}

function StyledEditableDropdown({ id, value, type, options, onSuccessfulUpdate }: StyledEditableDropdownProps) {
  const [content, setContent] = useState(value);
  const { updateLocationInfo, patchLocationError } = useLocation(id);
  const [noteMessage, updateNoteMessage] = useState('');
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const notInitialRender = useRef(false);

  useEffect(() => {
    if (notInitialRender.current) {
      const sendToDB = async () => {
        await updateLocationInfo(type, content);

        if (patchLocationError) {
          showNetworkErrorMessage(patchLocationError);
        } else {
          onSuccessfulUpdate(noteMessage + ' to ' + content);
        }
      };

      sendToDB();
    } else {
      notInitialRender.current = true;
    }
  }, [content]);

  const handleChange = (event:any) => {
    updateNoteMessage(type + ' changed from ' + content);
    setContent(event.target.value);
  };

  const isLegacyValue = !options.some(option => option.value === content);
  
  return (
    <>
      <StyledSelect
        name={type}
        value={content}
        onChange={handleChange}
        variant="standard"
      >
        {isLegacyValue && (
          <MenuItem value={content} disabled>
            {content}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </>
  );
}

export default StyledEditableDropdown;