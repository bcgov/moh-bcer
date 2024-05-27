import React, { useEffect, useState } from 'react';

import { StyledButton } from '@/index';
import { mapToObject } from '@/index';

export default { title: 'Util Functions' }

enum BusinessLocationDTOHeaders {
  addressLine1 = 'Address',
  addressLine2 = 'Address 2',
  postal = 'Postal Code',
  city = 'City',
  email = 'Buiness Email',
  phone = 'Phone Number',
  underage = 'Underage Permitted',
  health_authority = 'Health Authority',
  manufacturing = 'Manufacturing',
}

const intermediaryMappedObject = {
  'Address': 'biz address',
  'Address 2': 'biz address 2',
  'Postal Code': 'Post',
  'City': 'Locality',
  'Buiness Email': 'Email',
  'Phone Number': 'Phn',
  'Underage Permitted': 'allow minors',
  'Health Authority': 'HA',
  'Manufacturing': 'production location',
}

export const MapToObject = () => {
  const [mapping, setMapping] = useState();

  useEffect(() => {
    mapping !== undefined
    ? window.alert(JSON.stringify(mapping))
    : null
  }, [mapping])
  
  return (
    <div>
      <StyledButton variant="contained" onClick={() => setMapping(mapToObject(BusinessLocationDTOHeaders, intermediaryMappedObject))}>Test MapToObject</StyledButton>
    </div>
  )
}