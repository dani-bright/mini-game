import axios from 'axios';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { useHistory } from 'react-router';
import {IUser} from '../../interfaces/IUser';
import { useAppContext } from '../../contexts/AppContext';

import './Login.css';

export default function Login() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAppContext();


  const onUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
  };

  const onPasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

 const onSubmit = async(e: MouseEvent<HTMLButtonElement>) => {
   e.preventDefault();
    const result = await axios.post('http://localhost:4242/user/login', {
      username,
      password,
    });

    localStorage.setItem('idUser', result.data.user.id);

    setToken(result.data.token);
    history.push(`/scores?token=${result.data.token}`);
 };

  return (
    <div className="Login">
      <form>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" onChange={onUsernameInputChange} value={username}></input>
        <label htmlFor="username">Password</label>
        <input id="password" type="password" onChange={onPasswordInputChange} value={password}></input>
        <button className="button" type="submit" onClick={onSubmit}>Login</button>
      </form>
    </div>
  );
}
