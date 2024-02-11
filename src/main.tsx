import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Layout from './exemple/Layout';
import Exemple1 from './exemple/Exemple1';
import Exemple2 from './exemple/Exemple2';
import Exemple3 from './exemple/Exemple3';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <Exemple1 /> },
            { path: '/exemple2', element: <Exemple2 /> },
            { path: '/exemple3', element: <Exemple3 /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
