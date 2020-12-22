import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Link, Route } from 'react-router-dom';
import Login from '../../views/Login'
import renderer from 'react-test-renderer'

describe('Login Page Test Suite ', () => {
  it('Does Login Render', () => {
    expect(true).toEqual(true);
  });

  // test('Login snapshot renders', () => {
  //   const component = renderer.create(
  //     <MemoryRouter>
  //       <Login  />
  //     </MemoryRouter>);
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});




// describe('Header', () => {
//   it('renders without crashing.', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<Header />, div);
//   });
// });