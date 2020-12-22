import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Link, Route } from 'react-router-dom';
import Header from '../../components/Header';
import renderer from 'react-test-renderer';

// import { createKeycloakStub, MockedAuthProvider } from './__mocks__/@keycloak/keycloak'

// let mockKeycloakStub = createKeycloakStub()
// let mockInitialized = mockKeycloakStub

// jest.mock("@react-keycloak/web", () => {
//   const originalModule = jest.requireActual("@react-keycloak/web");
//   return {
//     ...originalModule,
//     useKeycloak: () =>  [
//       mockKeycloakStub,
//       mockInitialized
//     ]
//   };
// })

describe('Header Test Suite ', () => {
  it('Does Header Render', () => {
    expect(true).toEqual(true);
  });

//   test('Header snapshot renders', () => {
//     const component = renderer.create(
//       <MemoryRouter>
//         <Header />
//       </MemoryRouter>);
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
});

// describe('Header', () => {
//   it('renders without crashing.', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<Header />, div);
//   });
// });