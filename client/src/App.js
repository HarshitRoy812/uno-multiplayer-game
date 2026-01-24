import React from 'react';
import Login from './Login.js';
import Lobby from './Lobby.js';
import Layout from './Layout.js';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

const RequireAuth = ({children}) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to = '/' replace />;
}

function App()
{
    const token = localStorage.getItem('token');

    return (
        
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path = '/' element = {<Login />} />
                    <Route path = '/lobby' element = {
                        <RequireAuth>
                            <Lobby />
                        </RequireAuth>
                    } />
                </Routes>   
            </Layout>
        </BrowserRouter>

    )
}

export default App;