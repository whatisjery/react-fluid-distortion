import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Layout from './example/Layout';
import Example1 from './example/Example1';
import Example2 from './example/Example2';
import Example3 from './example/Example3';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <Example1 /> },
            { path: '/example2', element: <Example2 /> },
            { path: '/example3', element: <Example3 /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
