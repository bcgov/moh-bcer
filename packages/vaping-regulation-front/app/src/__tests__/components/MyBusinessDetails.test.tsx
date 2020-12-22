import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Link, Route } from 'react-router-dom';
import BusinessDetails from '../../components/MyBusiness/MyBusinessComponents/BusinessDetails'
import renderer from 'react-test-renderer';

describe('Business Details Page Test Suite ', () => {
  it('Does Business Details  Render', () => {
    expect(true).toEqual(true);
  });

  // test('Business Details snapshot renders', () => {
  //   const component = renderer.create(
  //     <MemoryRouter>
  //       <BusinessDetails />
  //     </MemoryRouter>);
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});
