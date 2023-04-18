import React, { useEffect, useState } from 'react';

let token = localStorage.getItem('token');

let subs: ((token: string | null) => void)[] = [];

export const auth = {
  setToken: (t: string | null) => {
    token = t;
    if (t) {
      localStorage.setItem('token', t);
    } else {
      localStorage.removeItem('token');
    }
    subs.forEach((cb) => cb(t));
  },
  subscribe: (cb: (token: string | null) => void) => {
    subs.push(cb);
    return () => {
      subs = subs.filter((s) => s !== cb);
    }
  },
  getToken: () => token,
};

export const AuthContext = React.createContext<string | null>(null);

export const useToken = () => {
  const [token, setToken] = useState(auth.getToken());

  useEffect(() => {
    return auth.subscribe(setToken);
  }, []);

  return token;
};
