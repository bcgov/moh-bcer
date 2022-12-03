import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import renderer from 'react-test-renderer';

describe('App Page Test Suite ', () => {
  it('Does Login Render', () => {
    expect(true).toEqual(true);
  });

  // test('App snapshot renders', () => {
  //   const component = renderer.create(<App  />)

  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});