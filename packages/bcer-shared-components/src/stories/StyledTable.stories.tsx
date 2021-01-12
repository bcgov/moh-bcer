import React, { forwardRef } from 'react';
import { StyledTable } from '@/index';
import { Typography } from '@material-ui/core';

import { StyledButton } from '@/index';

export default { title: 'Mui Styled table' }

export const Table = () => {
  return (
  <StyledTable
    columns={[
      {title: 'First Name', field: 'firstName'},
      {title: 'Last Name', field: 'lastName'},
      {title: 'Address', field: 'address'},
    ]}
    data={[
      {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.'},
      {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous'},
      {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous'},
    ]}
  />
  )
}

export const WideTable = () => {
  
  return (
    <StyledTable
      columns={[
        {title: 'First Name', field: 'firstName', editable: 'never' },
        {title: 'Last Name', field: 'lastName', editable: 'never' },
        {title: 'Address', field: 'address', editable: 'never' },
        {title: 'ex1', field: 'ex1', editable: 'never' },
        {title: 'ex1', field: 'ex1', editable: 'never' },
        {title: 'ex2', field: 'ex2', editable: 'never' },
        {title: 'ex3', field: 'ex3', editable: 'never' },
        {title: 'ex4', field: 'ex4' },
        {title: 'ex5', field: 'ex5' },
      ]}
      data={[
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
      ]}
      icons={{
        Edit: forwardRef((props, ref) => (
          <StyledButton variant='outlined' onClick={(event) => alert('Edit All')} >
            Edit All
          </StyledButton>
        ))
      }}
      editable={{
        onBulkUpdate: changes =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(1);
            }, 1000);
          }),     
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(1);
            }, 1000);
          }),     
      }}
    />
  )
}

const test = (rowData: any) => {
  window.alert(JSON.stringify(rowData))
}
const test2 = (rowData: any) => {
  window.alert(`You are deleting: ${JSON.stringify(rowData)}`)
}

export const EditableTable = () => {
  
  return (
    <StyledTable
      columns={[
        {title: 'First Name', field: 'firstName'},
        {title: 'Last Name', field: 'lastName'},
        {title: 'Address', field: 'address'},
        {title: 'ex1', field: 'ex1'},
        {title: 'ex1', field: 'ex1'},
        {title: 'ex2', field: 'ex2'},
        {title: 'ex3', field: 'ex3'},
        {title: 'ex4', field: 'ex4'},
        {title: 'ex5', field: 'ex5'},
      ]}
      data={[
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
      ]}
      isEditable={true}
      editHandler={test}
      deleteHandler={test2}
      />
  )
}


export const SelectableTable = () => {
  
  return (
    <StyledTable
      columns={[
        {title: 'First Name', field: 'firstName'},
        {title: 'Last Name', field: 'lastName'},
        {title: 'Address', field: 'address'},
        {title: 'ex1', field: 'ex1'},
        {title: 'ex1', field: 'ex1'},
        {title: 'ex2', field: 'ex2'},
        {title: 'ex3', field: 'ex3'},
        {title: 'ex4', field: 'ex4'},
        {title: 'ex5', field: 'ex5'},
      ]}
      data={[
        {id: "id's disable deleting", firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
      ]}
      isEditable={true}
      editHandler={test}
      deleteHandler={test2}
      options={{ selection: true }}
      onSelectionChange={(rows: any) => console.log('selected rows: ', rows)}
    />
  )
}

export const TableWithOverrides = () => {
  
  return (
    <>
      <StyledTable
        columns={[
          {title: 'First Name', field: 'firstName'},
          {title: 'Last Name', field: 'lastName'},
          {title: 'Address', field: 'address'},
          {title: 'ex1', field: 'ex1'},
          {title: 'ex1', field: 'ex1'},
          {title: 'ex2', field: 'ex2'},
          {title: 'ex3', field: 'ex3'},
          {title: 'ex4', field: 'ex4'},
          {title: 'ex5', field: 'ex5'},
        ]}
        data={[]}
        localization={{
          body: {
            emptyDataSourceMessage: `You’re good to go 🎉`
          }
        }}
        isEditable={true}
        editHandler={test}
        deleteHandler={test2}
        options={{ selection: true }}
        onSelectionChange={(rows: any) => console.log('selected rows: ', rows)}
      />
      <StyledTable
        columns={[
          {title: 'First Name', field: 'firstName'},
          {title: 'Last Name', field: 'lastName'},
          {title: 'Address', field: 'address'},
          {title: 'ex1', field: 'ex1'},
          {title: 'ex1', field: 'ex1'},
          {title: 'ex2', field: 'ex2'},
          {title: 'ex3', field: 'ex3'},
          {title: 'ex4', field: 'ex4'},
          {title: 'ex5', field: 'ex5'},
        ]}
        data={[
          {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'My Name', lastName: 'A Surname', address: '1234 North S.E. West st.', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Not my Name', lastName: 'A different Surname', address: 'something equally ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
          {firstName: 'Also not my Name', lastName: 'Another different Surname', address: 'something not so ridiculous', ex1: 'somthing long', ex2: 'something longer', ex3: 'something else', ex4: 'something not else', ex6: 'the end'},
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: `You’re good to go 🎉`
          }
        }}
        isEditable={true}
        editHandler={test}
        deleteHandler={test2}
        options={{ selection: true, pageSize: 8 }}
        onSelectionChange={(rows: any) => console.log('selected rows: ', rows)}
      />
    </>
  )
}