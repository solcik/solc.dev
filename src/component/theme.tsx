import React, { useState } from 'react';

export const dark = 'dark';
export const light = 'light';
export const auto = 'auto';

import css from './theme.module.css';

export default function ThemeToolbar(): JSX.Element {
  const [theme, setTheme] = useState(dark);

  let changeTheme = (theme) => {
    setTheme(theme);
  };

  if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
    const html = document.documentElement;
    const preference = window.matchMedia('(prefers-color-scheme: dark)');

    html.classList.remove(dark);
    html.classList.remove(light);
    html.classList.remove(auto);

    if (!('theme' in localStorage) && preference.matches && theme !== dark) {
      setTheme(dark);
    }
    if (localStorage.theme === dark && theme !== dark) {
      setTheme(dark);
    }
    if (localStorage.theme === light && theme !== light) {
      setTheme(light);
    }

    changeTheme = (theme) => {
      if (theme === 'auto') {
        localStorage.removeItem('theme');
      } else {
        localStorage.theme = theme;
      }
      setTheme(theme);
    };

    html.classList.add(theme);
  }

  return (
    <div className="">
      <button
        type="button"
        className={css.button}
        onClick={() => {
          changeTheme(dark);
        }}
      >
        <svg
          aria-hidden="true"
          role="presentation"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.2 13.01a6.41 6.41 0 01-1.554.194c-3.235 0-5.823-2.577-5.823-5.797 0-.515.065-1.03.194-1.546.065-.193 0-.45-.194-.644-.194-.193-.388-.257-.647-.193C7.136 5.926 5 8.76 5 11.915 5 15.845 8.17 19 12.117 19c3.17 0 6.018-2.125 6.859-5.217.064-.193 0-.45-.194-.644-.13-.129-.389-.193-.583-.129z" />
        </svg>
      </button>
      <button
        type="button"
        className={css.button}
        onClick={() => {
          changeTheme(light);
        }}
      >
        <svg
          aria-hidden="true"
          role="presentation"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.454 3.727a.727.727 0 10-1.454 0v.728a.727.727 0 001.454 0v-.728zM5.54 5.54a.727.727 0 011.029 0l.509.51a.727.727 0 11-1.029 1.028l-.509-.51a.727.727 0 010-1.028zM3 11.727c0-.401.326-.727.727-.727h.728a.727.727 0 010 1.454h-.728A.727.727 0 013 11.727zM17.914 5.54a.727.727 0 010 1.029l-.509.509a.727.727 0 11-1.028-1.029l.509-.509a.727.727 0 011.028 0zM19 11a.727.727 0 100 1.454h.727a.727.727 0 000-1.454H19zm-2.623 5.377a.727.727 0 011.028 0l.51.509a.727.727 0 01-1.03 1.028l-.508-.509a.727.727 0 010-1.028zM12.455 19A.727.727 0 1011 19v.727a.727.727 0 001.454 0V19zm-5.377-2.623a.727.727 0 010 1.028l-.51.51a.727.727 0 01-1.028-1.03l.51-.508a.727.727 0 011.028 0zm9.013-4.65a4.364 4.364 0 11-8.727 0 4.364 4.364 0 018.727 0z"
          />
        </svg>
      </button>
      <button
        type="button"
        className={css.button}
        onClick={() => {
          changeTheme(auto);
        }}
      >
        <svg
          aria-hidden="true"
          role="presentation"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM15 16H13.5542L13.0722 14.0596H10.8305L10.3397 16H9L11.2152 8H12.7848L15 16ZM11.9978 9.62439H11.9182L11.1179 12.8067H12.7892L11.9978 9.62439Z"
          />
        </svg>
      </button>
    </div>
  );
}
