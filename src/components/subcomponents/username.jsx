/**
 * Contenidos del panel que tiene el usuario
 */

import React, {useState, useEffect} from 'react';
import './styles/username.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Username({UserData})
{
   

    /* Calcula a partir del length del username el font size */
    useEffect(() => {
        const nameTag = document.querySelector('#username p');

        if(UserData.name.length > 10)
        {
            const newLenght = (15 / UserData.name.length).toFixed(3);
            nameTag.style.setProperty('font-size', 'calc(0.01vw + ' + newLenght + "vw)");
        }
        else // Size mínimo
        {
            nameTag.style.setProperty('font-size', '1.375vw');
        }
        
    }, [UserData.name]);

    return(
        <div id="username">
            <AccountCircleIcon id="icon"/>
            <p>{UserData.name}</p>
        </div>
    );
}

export default Username;