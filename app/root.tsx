import React from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
} from '@remix-run/react';
import '~/tailwind.css';
import { LinksFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Ahmad Koye Official Website' },
    {
      description:
        "Welcome to Ahmad Koye's official website. Discover books, events, and more!",
    },
    { name: 'keywords', content: 'books, bookstore, events, Ahmad Koye' },
    { name: 'author', content: 'Ahmad Koye' },
    { property: 'og:title', content: 'Ahmad Koye Official Website' },
    {
      property: 'og:description',
      content:
        "Welcome to Ahmad Koye's official website. Discover books, events, and more!",
    },
    {
      property: 'og:image',
      content: 'https://ahmad-koye.com/images/AKlogo.png',
    },
    { property: 'og:url', content: 'https://ahmad-koye.com/' },
  ];
};

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Carlito&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
    </>
  );
}
