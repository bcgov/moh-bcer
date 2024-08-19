import React from 'react';

import { StyledAutocomplete } from '@/components/fields';

export default { title: 'Mui Styled Autocomplete' }

export const Autocomplete = () => {
  return (
    <div>
      <StyledAutocomplete 
      id="combo-box-demo"
      options={[
        {
          title: 'a',
          value: 'a'
        },
        {
          title: 'b',
          value: 'b'
        },
        {
          title: 'c',
          value: 'c'
        },
        {
          title: 'd',
          value: 'd'
        },
      ]}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}/>
    </div>
  )
}