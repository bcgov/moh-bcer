import React, { useState, useEffect } from 'react';

import { StyledHeaderMapper } from '@/index';
import { StyledButton } from '@/components/buttons';

export default { title: 'Mui Styled Header Mapper' }


enum ProductReportHeaders {
  type = 'Type',
  brandName = 'Brand Name',
  productName = 'Product Name',
  manufacturerName = 'Manufacturer Name',
  manufacturerAddress = 'Manufacturer Address',
  manufacturerPhone = 'Manufacturer Phone',
  manufacturerEmail = 'Manufacturer Email',
  concentration = 'Concentration',
  containerCapacity = 'Container Capacity',
  cartridgeCapacity = 'Cartridge Capacity',
  ingredients = 'Ingredients',
  flavour = 'Flavour'
}

const uploadProvidedHeaders = [
  'type',
  'brand',
  'producerName',
  'producerEmail',
  'producerPhone',
  'producerAddress',
  'mg/ml',
  'contents volume',
  'cartrige size',
  'mixture',
  'mix name'
]


export const HeaderMapper = () => {
  const [headers, setHeaders] = useState();

  const cancel = () => {
    window.alert('Action was cancelled')
  }

  return (
    <>
      <div>
        <StyledHeaderMapper requiredHeaders={ProductReportHeaders} providedHeaders={uploadProvidedHeaders} updateMapCallback={setHeaders} cancelHandler={cancel}/>
      </div>
      <StyledButton variant='contained' onClick={() => console.log(headers)}>Click to log headers</StyledButton>
    </>
  )
}

const uploadProvidedHeadersRandom = [
  'variant',
  'branding',
  'producerName',
  'producerEmail',
  'producerPhone',
  'producerAddress',
  'mg/ml',
  'contentsSize',
  'cartrigeCapacity',
  'mixture',
  'mix name'
]

const uploadProvidedHeadersPartialMatch = [
  'type',
  'branding',
  'producerName',
  'producerEmail',
  'producerPhone',
  'producerAddress',
  'concentration',
  'contentsSize',
  'cartrigeCapacity',
  'mixture',
  'flavor'
]
const uploadProvidedHeadersFullMatch = [
  'type',
  'brandName',
  'productName',
  'manufacturerName',
  'manufacturerAddress',
  'manufacturerPhone',
  'manufacturerEmail',
  'concentration',
  'containerCapacity',
  'cartridgeCapacity',
  'ingredients',
  'flavour',
]

export const AutoHeaderMapper = () => {
  const [headers, setHeaders] = useState();
  const [providedHeaders, setProvidedHeaders] = useState<null | number>(null);

  useEffect(() => {
    window.alert(JSON.stringify(headers))
  },[headers])

  const handleChange = async(value: number) => {
    await setProvidedHeaders(null)
    setProvidedHeaders(value)
  }
  return (
    <>
      <div>
        {
          providedHeaders === 1
            ?         <StyledHeaderMapper requiredHeaders={ProductReportHeaders} providedHeaders={uploadProvidedHeadersRandom} updateMapCallback={setHeaders}/>
              : providedHeaders === 2
            ?         <StyledHeaderMapper requiredHeaders={ProductReportHeaders} providedHeaders={uploadProvidedHeadersPartialMatch} updateMapCallback={setHeaders}/>
              : providedHeaders === 3
            ?         <StyledHeaderMapper requiredHeaders={ProductReportHeaders} providedHeaders={uploadProvidedHeadersFullMatch} updateMapCallback={setHeaders}/>
            : null
            
        }
      </div>
      <StyledButton variant='contained' onClick={() => handleChange(1)}>Use random headers</StyledButton>
      <StyledButton variant='contained' onClick={() => handleChange(2)}>Use partially matching headers</StyledButton>
      <StyledButton variant='contained' onClick={() => handleChange(3)}>Use fully matching headers</StyledButton>


    </>
  )
}