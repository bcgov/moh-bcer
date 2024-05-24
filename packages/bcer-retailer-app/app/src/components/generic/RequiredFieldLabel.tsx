import React from 'react';

export default function RequiredFieldLabel ({label}: {label: string}) {
  return (
    <span>
      {label}
      <span style={{color: 'red'}} > *</span>
    </span>
  )
}