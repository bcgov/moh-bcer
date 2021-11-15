import React from 'react';

export default function RequiredFieldLabel ({label}: {label: string}) {
  return (
    <div>
      {label}
      <span style={{color: 'red'}} > *</span>
    </div>
  )
}