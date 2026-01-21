import React from 'react';
import './Layout.css';

function Layout({children})
{
    return (
        <div className = 'app-theme'>
            {children}
        </div>
    )
}

export default Layout;