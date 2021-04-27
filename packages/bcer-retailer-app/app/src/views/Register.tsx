import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import store from 'store';
import useAxios from 'axios-hooks';

import Header from '@/components/Header';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const Signup = () => {
  const [registerError, setRegisterError] = useState('');
  const history = useHistory();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext)

  const [{ data, loading, error, response }, register] = useAxios({
    url: `${process.env.BASE_URL}/users/register`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, { manual: true });

  useEffect(() => {
    if (response?.status === 201) {
      store.set('TOKEN', response.data.token);
      store.set('profile', response.data.profile);
      history.push('/');
    } 
  }, [data, loading, response, history]);

  useEffect(() => {
    if (error) {
      setRegisterError(error.message);
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error]);

  const [values, setValue] = useState({
    firstName: '',
    lastName: '',
    bceid: '',
    email: '',
    password: ''
  });

    function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setValue({ ...values, [name]: value });
  }

  return (
    <>
      <Header />
      <section className="signup-container">
        <h1>Signup</h1>
        <form onSubmit={(event) => event.preventDefault()} className="signup-form">
          <input
            placeholder="First name"
            className="input"
            type="text"
            name="firstName"
            onChange={handleChangeValue}
            value={values.firstName}
          />
          <input
            placeholder="Last name"
            className="input"
            type="text"
            name="lastName"
            onChange={handleChangeValue}
            value={values.lastName}
          />
          <input
            placeholder="BCeID"
            className="input"
            type="text"
            name="bceid"
            onChange={handleChangeValue}
            value={values.bceid}
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            className="input"
            onChange={handleChangeValue}
            value={values.email}
          />
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Password"
            onChange={handleChangeValue}
            value={values.password}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button className="BC-Gov-SecondaryButton" onClick={() => history.push('login')}>
              Login
            </button>
            <button className="BC-Gov-PrimaryButton" onClick={() => register({ data: { ...values, type: 'BO' } })}>
              Register
            </button>
          </div>
        </form>
        {registerError && (
          <div>
            <p>{registerError}</p>
          </div>
        )}
      </section>
    </>
  );
};
export default Signup;
