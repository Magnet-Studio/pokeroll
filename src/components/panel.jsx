import React from 'react';
import './styles/panel.css';
import Logo from './subcomponents/logo';
import Coins from './subcomponents/coins';
import Username from './subcomponents/username';
import TopElements from './subcomponents/topElements';
import BottomElements from './subcomponents/bottomElements';
import { BrowserRouter } from 'react-router-dom';
import GameState from './subcomponents/gameState';
import {useState, useEffect} from 'react';

const initData = {
    name:"CreatorBeastGD",
    pass:"beast",
    currency: 100
}

const savedData = () => 
{
    const savedName = localStorage.getItem("username");
    const savedPass = localStorage.getItem("pass");
    const savedCurrency = localStorage.getItem("currency");


    if(savedName == undefined || savedPass == undefined || savedCurrency == undefined)
    {
        return null;
    }

    return {
        name: savedName,
        pass: savedPass,
        currency: parseInt(savedCurrency)
    };
}

/** 
 * Este es el panel principal azul donde se contiene todo
*/
function MainPanel()
{
     
    const [UserData, setUserData] = useState(savedData() || initData);

    useEffect(() => {
        localStorage.setItem("username", UserData.name);
        localStorage.setItem("pass", UserData.pass);
        localStorage.setItem("currency", UserData.currency.toString());
    }, [UserData]);

    useEffect(() => {
        const data = savedData();
        if (data !== null) {
            setUserData(data);
        }
    }, []);

    const [TierRuleta, setTierRuleta] = useState(1);

    const [tirarButtonDisable, setTirarButtonDisable] = useState("");
    const [changeTierButtonDisable, setChangeTierButtonDisable] = useState("");

    return (
        <>

            <div id='mainPanelContainer'>
                <div id='mainPanel'>

                    <BrowserRouter>

                        <div id='logoContainer' className='subpanelContainer'>
                            <LogoPanel/>
                        </div>

                        <div id='coinsPanelContainer' className='subpanelContainer'>
                            <CoinsPanel UserData={UserData} />
                        </div>

                        <div id='topelementsPanelContainer' className='subpanelContainer'>
                            <TopElementsPanel/>
                        </div>

                        <div id='usernamePanelContainer' className='subpanelContainer'>
                            <UsernamePanel UserData={UserData}/>
                        </div>

                        <div id='gamestatePanelContainer' className='subpanelContainer'> 
                            <GameStatePanel setUserData={setUserData} TierRuleta={TierRuleta} />
                        </div>

                        <div id='bottomelementsPanelContainer' className='subpanelContainer'>
                            <BottomElementsPanel UserData={UserData} setUserData={setUserData} 
                                                TierRuleta={TierRuleta} setTierRuleta={setTierRuleta} 
                                                tirarButtonDisable={tirarButtonDisable} setTirarButtonDisable={setTirarButtonDisable}
                                                changeTierButtonDisable={changeTierButtonDisable} setChangeTierButtonDisable={setChangeTierButtonDisable}/>
                        </div>

                    </BrowserRouter>
                    
                </div>
            </div>
        </>
    );
}

/**
 * Este es el panel que contiene el logo
 */
function LogoPanel()
{
    return (
        <div className='subpanel' id='logoPanel'>
            <Logo/>
        </div>
    );
}

/**
 * Este es el panel que contiene el número de monedas
 */
function CoinsPanel({UserData})
{
    return (
        <div className='subpanel'>
            <Coins UserData={UserData}/>
        </div>
    );
}

/**
 * Este es el panel que contiene el título de dónde te encuentras
 */
function TopElementsPanel()
{
    return (
        <div className='subpanel' id='topelementsPanel'>
            <TopElements/>
        </div>
    );
}


/**
 * Este es el panel que contiene el username
 */
function UsernamePanel({UserData})
{
    return (
        <div className='subpanel'>
            <Username UserData={UserData}/>
        </div>
    );
}

/**
 * Este es el panel que contiene el estado actual del juego (game state)
 */
function GameStatePanel({UserData, setUserData})
{
    return (
        <div className='subpanel' id='gamestatePanel'>
            <GameState UserData={UserData} setUserData={setUserData} />
        </div>
    );
}


/**
 * Este es el panel que contiene los botones de navegación / el botón de Tirar / la pokéball
 */
function BottomElementsPanel({UserData, setUserData, TierRuleta, setTierRuleta, tirarButtonDisable, setChangeTierButtonDisable, setTirarButtonDisable, changeTierButtonDisable})
{
    return (
        <div className='subpanel' id='bottomelementsPanel'>
            <BottomElements UserData={UserData} setUserData={setUserData} TierRuleta={TierRuleta} setTierRuleta={setTierRuleta} 
                            tirarButtonDisable={tirarButtonDisable} setTirarButtonDisable={setTirarButtonDisable}
                            changeTierButtonDisable={changeTierButtonDisable} setChangeTierButtonDisable={setChangeTierButtonDisable}/>
        </div>
    );
}

/* Lo único que hace falta exportar */
export default MainPanel;