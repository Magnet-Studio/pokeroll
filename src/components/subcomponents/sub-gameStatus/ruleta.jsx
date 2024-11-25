import React, {useState, useEffect} from 'react';
import './styles/ruleta.css';
import { GetDataByDexNum, GetImage , GetFirstType, GetSecondType, GetPrettyTypeNameSpanish, GetVariantImage} from './lib/PokemonData';
import Pokeball from "../../../images/pokeball.png";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CoinImage from "../../../images/coin.png";
import { GetFrequencyByName } from "./lib/pokemonFrequency";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { MouseOverPopover } from './mouseOverPopOver';
import { AddLastExtraDetails, AddLastExtraDetailsEvent } from './lib/pokemonList';
import {ReactComponent as SpaIcon} from '../../../images/megaIcon.svg';
import {ReactComponent as GmaxIcon} from '../../../images/gmaxIcon.svg';
import CheckIcon from '@mui/icons-material/Check';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import Confetti from 'react-confetti';

const pokeballImage = (<img src={Pokeball} className="pokeballRotar" alt="Pokéball"/>);

function Ruleta({threePokemon, tirarButtonDisable, TierRuleta, setThreePokemon, UserData, setTirarButtonDisable, setChangeTierButtonDisable, setUserData, coinsReference})
{   
    const notPokemon = [(pokeballImage), (pokeballImage), (pokeballImage)];
    const [threePokemonImages, setThreePokemonImages] = useState(notPokemon);
    useEffect(() => {
        document.title = "Ruleta · PokéRoll"
    }, []);

    useEffect(() => 
    {
        const fetchDataAndUpdateState = async () => 
        {
            let images = [];

            for(let i=0; i<3; i++)
            {
                const name = threePokemon[i].name;
                let data = null;
                if(name !== undefined)
                {
                  data = await GetDataByDexNum(name);
                }
                images[i] = threePokemon[i]?.variant === undefined ? GetImage(data, (threePokemon[i].shiny === "shiny")) : GetVariantImage(threePokemon[i].variant.name, (threePokemon[i].shiny === "shiny"));
                
                if(images[i].props.children.type !== "img")
                {
                    images[i] = pokeballImage;
                }
                else
                {
                  setThreePokemon(prevThreePokemon => 
                    { 
                      if (threePokemon[i]?.variant === undefined) {
                        prevThreePokemon[i].type1 = GetFirstType(data);
                        prevThreePokemon[i].type2 = GetSecondType(data);
                      } else {
                        if (threePokemon[i].variant?.types === undefined) {
                          prevThreePokemon[i].type1 = GetFirstType(data);
                          prevThreePokemon[i].type2 = GetSecondType(data);
                        } else {
                          prevThreePokemon[i].type1 = threePokemon[i].variant.types[0];
                          prevThreePokemon[i].type2 = threePokemon[i].variant.types[1];
                        }
                        
                      }
                      return prevThreePokemon;
                    });
                }
            }
            
            setThreePokemonImages(images);
        };
        
        fetchDataAndUpdateState();
    // eslint-disable-next-line
    }, [threePokemon]);

    let shouldShowConfetti = false;
    let colors = [];

    for (let i = 0; i < 3; i++) {
      if (threePokemon[i].shiny === "shiny") {
        shouldShowConfetti = true;
        colors = colors.concat(['#ffff00', '#ffff99', '#cccc00']);
      }
      if (threePokemon[i]?.megaevolution === true || threePokemon[i]?.gigantamax === true) {
        shouldShowConfetti = true;
        colors = colors.concat(['#ff0066', '#ff0000', '#ff6699']);
      }
      if (threePokemon[i]?.rarespecies === true) {
        shouldShowConfetti = true;
        colors = colors.concat(['#6699ff', '#0099ff', '#9966ff']);
      }
    }

    colors = [...new Set(colors)];

    return (
        <>
            {shouldShowConfetti && <Confetti width="" height="" colors={colors} numberOfPieces={50} friction={0.97}/>}
            <div className='externalArrowContainer'></div>
            <div className="boxes">
                <RuletaBox number={"1"} setThreePokemon={setThreePokemon} coinsReference={coinsReference} UserData={UserData} pokemonImage={threePokemonImages[0]} pokemonData={threePokemon[0]} tirarButtonDisable={tirarButtonDisable} TierRuleta={TierRuleta} setTirarButtonDisable={setTirarButtonDisable} setChangeTierButtonDisable={setChangeTierButtonDisable} setUserData={setUserData}/>
                <RuletaBox number={"2"} setThreePokemon={setThreePokemon} coinsReference={coinsReference} UserData={UserData} pokemonImage={threePokemonImages[1]} pokemonData={threePokemon[1]} tirarButtonDisable={tirarButtonDisable} TierRuleta={TierRuleta} setTirarButtonDisable={setTirarButtonDisable} setChangeTierButtonDisable={setChangeTierButtonDisable} setUserData={setUserData}/>
                <RuletaBox number={"3"} setThreePokemon={setThreePokemon} coinsReference={coinsReference} UserData={UserData} pokemonImage={threePokemonImages[2]} pokemonData={threePokemon[2]} tirarButtonDisable={tirarButtonDisable} TierRuleta={TierRuleta} setTirarButtonDisable={setTirarButtonDisable} setChangeTierButtonDisable={setChangeTierButtonDisable} setUserData={setUserData}/>
            </div>
            <div className='externalArrowContainer'></div>
        </>
    );
}

const TierCosts = [100, 500, 1500, 4000, 10000];
const nombresRarezas = ['Común', 'Infrecuente', 'Peculiar', 'Épico', 'Legendario', 'Singular'];
const coloresRareza = ['#424242', '#128700', '#0057AE', '#8725B8', '#897400', '#B60000'];

function RuletaBox({number, setThreePokemon, pokemonImage, tirarButtonDisable, TierRuleta, pokemonData, UserData, setTirarButtonDisable, setChangeTierButtonDisable, setUserData, coinsReference}) {
  
    const [enabled, setEnabled] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (tirarButtonDisable === "disabled" && loaded) {
            setEnabled("enabled");
        } else {
            setEnabled("");
        }
    }, [tirarButtonDisable, loaded]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        setEnabled("");
    };

    
    const HalfCost = (TierCosts[TierRuleta - 1]) / 2;

    let RegisterCheck = false;
    if (UserData?.registers !== undefined) {
        if (UserData.registers.includes(pokemonData.name)) {
            RegisterCheck = true;
        }
    }

    useEffect(() => {
        if(pokemonData.type1 !== undefined)
        {
            setLoaded(true);
        }
        else 
        {
            setLoaded(false);
        }
    // eslint-disable-next-line
    }, [pokemonImage]);

    return (
        <div 
            className={"ruletaBox " + enabled} 
            onClick={handleOpen} 
            onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(); }} 
            tabIndex={enabled === "enabled" ? "0" : "-1"} 
            role={enabled === "enabled" ? "button" : ""}
            aria-hidden={enabled === "enabled" ? "false" : "true"}
            aria-label={enabled === "enabled" ? `Caja ${number} de 3: Pokémon ${pokemonData.speciesname} , Rareza ${nombresRarezas[GetFrequencyByName(pokemonData.speciesname) - 1]}:${(RegisterCheck === true ? "Ya registrado" : "No registrado")}${(pokemonData.shiny === "shiny" ? ": Variocolor" : "")}${(pokemonData.rarespecies === true ? ": Especie rara" : "")}${(pokemonData.megaevolution === true ? ": Megaevolución" : "")}` : ""}
            onBlur={(e) => e.currentTarget.blur()}
        >
            <div className='RegistradoCheck'>
                {RegisterCheck ? <CheckIcon style={{ fontSize: '30px' }} /> : <></>}
            </div>
            <div className='RarezaBox'>
                <p className='RarezaText' style={{ color: coloresRareza[GetFrequencyByName(pokemonData.speciesname) - 1] }}>
                    {nombresRarezas[GetFrequencyByName(pokemonData.speciesname) - 1]}
                </p>
            </div>
            {pokemonImage}
    
            <ModalConfirmar tirarButtonDisable={tirarButtonDisable} setThreePokemon={setThreePokemon} UserData={UserData} open={open} setOpen={setOpen} HalfCost={HalfCost} pokemonImage={pokemonImage} coinsReference={coinsReference} pokemonData={pokemonData} setEnabled={setEnabled} setTirarButtonDisable={setTirarButtonDisable} setChangeTierButtonDisable={setChangeTierButtonDisable} setUserData={setUserData} />
        </div>
    );
}

function ModalConfirmar({ setThreePokemon, tirarButtonDisable, pokemonData, setOpen, open, UserData, HalfCost, pokemonImage, setEnabled, setTirarButtonDisable, setChangeTierButtonDisable, setUserData, coinsReference }) {
    
    useEffect(() => {
        if (open) {
            document.body.classList.add('modal-open');
        } else 
        {
            if(tirarButtonDisable === "" && coinsReference) 
            {
                coinsReference.current.focus(); // Te cambia el tab a las monedas si has reclamado
            }
            document.body.classList.remove('modal-open');
        }
    // eslint-disable-next-line
    }, [open]);

    const HandleClose = (event) => {
        event.stopPropagation();
        setOpen(false);
        setEnabled("enabled");
    };

    const HandleReclamar = (event) => {
        event.stopPropagation();
        Reclamar(pokemonData, UserData, setThreePokemon, setUserData, HalfCost);
        setChangeTierButtonDisable("");
        setTirarButtonDisable("");
        setEnabled("");
        setOpen(false);
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "40vw",
        bgcolor: "white",
        boxShadow: 24,
        p: 4,
        borderRadius: "2vw",
    };

    let firstTypeContainer = (<div className={"pokemonType " + pokemonData.type1} aria-description={' del tipo '}><span aria-label=''>{GetPrettyTypeNameSpanish(pokemonData.type1)}</span></div>);
    let secondTypeContainer = (<></>);
    if (pokemonData.type2 !== null) {
        secondTypeContainer = (<div className={"pokemonType " + pokemonData.type2} aria-description={' y '}><span aria-label="">{GetPrettyTypeNameSpanish(pokemonData.type2)}</span></div>);
    }

    const nombresRarezas = ['Común', 'Infrecuente', 'Peculiar', 'Épico', 'Legendario', 'Singular'];
    const frequency = GetFrequencyByName(pokemonData.speciesname);
    const nombreRareza = nombresRarezas[frequency - 1];

    let shinyIndication = (<></>);
    let megaIndication = (<></>); // Se usa tambien para indicación de Gigamax !!!
    let rareIndication = (<></>);
    if (pokemonData.shiny === "shiny") {
        const shinyMsg = ("¡Felicidades! ¡Has conseguido un Pokémon Variocolor! Obtendrás una bonificación de 5000 puntos en el cálculo final de Rareza por ello");
        shinyIndication = (<MouseOverPopover className="mop" content={<AutoAwesomeIcon className="shinyIcon" />} shown={shinyMsg} />);
    }

    
    let megaWord = "una Megaevolución";
    if (pokemonData.name === 382 || pokemonData.name === 383) {
        megaWord = "una Regresión Primigenia";
    } 
    else if (pokemonData.name === 800) {
        megaWord = "a Ultra Necrozma";
    }
    

    if (pokemonData?.megaevolution !== undefined) {
        if (pokemonData.megaevolution === true) {
            const megaMsg = ("¡Felicidades! ¡Has conseguido" + megaWord + "! Obtendrás una bonificación de 1500 puntos en el cálculo final de Rareza por ello");
            megaIndication = (<MouseOverPopover className="mop" content={<SpaIcon className="megaIcon" />} shown={megaMsg} />);
        }
    }

    if (pokemonData?.gigantamax !== undefined) {
        if (pokemonData.gigantamax === true) {
            const megaMsg = ("¡Felicidades! ¡Has conseguido una especie Gigamax! Obtendrás una bonificación de 1500 puntos en el cálculo final de Rareza por ello");
            megaIndication = (<MouseOverPopover className="mop" content={<GmaxIcon className="megaIcon" />} shown={megaMsg} />);
        }
    }

    if (pokemonData?.rarespecies !== undefined) {
        if (pokemonData.rarespecies === true) {
            const rareMsg = ("¡Felicidades! ¡Has conseguido una especie rara! Obtendrás una bonificación de 1000 puntos en el cálculo final de Rareza por ello");
            rareIndication = (<MouseOverPopover className="mop" content={<MilitaryTechIcon className="rareIcon" />} shown={rareMsg} />);
        }
    }

    let unregisterMessage = <></>;
    if (UserData?.registers !== undefined) {
        if (!UserData.registers.includes(pokemonData.name)) {
            unregisterMessage = <p aria-description=":" className='unregisterMessage'>¡No registrado!</p>;
        } else {
            unregisterMessage = <p aria-description=":" className='registerMessage'>¡Ya registrado!</p>;
        }
    }

    return (
        <>
            <Modal
                open={open}
                onClose={HandleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                id='reclamarButtonContainer'
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title">
                        ¿Quieres reclamar este Pokémon?
                    </Typography>

                    <Typography id="modal-modal-description" style={{ fontFamily: "vanilla-regular", margin: "0", textAlign: "center" }}>
                        El Pokémon elegido será guardado en tu Almacén. ¡Recibirás además la mitad de las monedas que gastaste en la tirada!
                    </Typography>

                    <div className="containerModal">
                        {pokemonImage}
                        <div>
                            <div className='inlineContainer' style={{ color: "black" }}>
                                <p className='nombrePokemonReclamar' aria-label={pokemonData.speciesname}>{pokemonData.speciesname}</p>
                                <p aria-label={pokemonData.shiny === "shiny" ? " Variocolor:" : ":" } role="contentinfo"></p>
                                <p aria-label={pokemonData.megaevolution === true ? " Megaevolución:" : ":"} role="contentinfo"></p>
                                <p aria-label={pokemonData.rarespecies === true ? " Especie rara:" : ":"} role="contentinfo"></p>
                                {shinyIndication}
                                {megaIndication}
                                {rareIndication}
                            </div>
                            <div id="tiposPokemon">
                                {firstTypeContainer}
                                {secondTypeContainer}
                            </div>
                            <p className="rareza" aria-description=':' style={{ color: 'black' }}>Rareza: <span style={{ color: coloresRareza[GetFrequencyByName(pokemonData.speciesname) - 1] }}>{(nombreRareza === undefined ? "Cargando..." : nombreRareza + " ")}</span></p>
                        </div>
                    </div>
                    
                    {unregisterMessage}

                    <div className="containerModal moneyCount">
                        <img className="coin" src={CoinImage} alt="Moneda" aria-hidden="true" tabIndex="-1"/> {"+" + HalfCost}
                        <span role="contentinfo" aria-label={" monedas de vuelta:"}></span>
                    </div>

                    <div className="containerModal">
                        <Button
                            className="cerrarButton"
                            onClick={HandleClose}
                            style={{
                                backgroundColor: "#8A0000",
                                color: "white",
                                padding: "14px 20px",
                                border: "0.2vw solid #9f4949",
                                borderRadius: "1vw",
                                cursor: "pointer",
                                fontSize: "calc(0.3vw + 0.9vh)",
                                width: "8vw",
                                pointerEvents: "all",
                                fontFamily: "vanilla-regular",
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="confirmarButton"
                            onClick={HandleReclamar}
                            style={{
                                backgroundColor: "#006400",
                                color: "#ffffff",
                                padding: "14px 20px",
                                border: "0.2vw solid #89ff8e",
                                borderRadius: "1vw",
                                cursor: "pointer",
                                fontSize: "calc(0.3vw + 0.9vh)",
                                width: "8vw",
                                marginLeft: "1.5vw",
                                pointerEvents: "all",
                                fontFamily: "vanilla-regular",
                            }}
                        >
                            Reclamar
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

function Reclamar(pokemonData, UserData, setThreePokemon, setUserData, HalfCost) {    
    const notPokemon = [{}, {}, {}];
    setThreePokemon(notPokemon);

    AddLastExtraDetails(pokemonData, UserData); 

    setUserData(prevUserData => {
        const updatedUserData = { ...prevUserData };
        updatedUserData.currency += HalfCost;
        updatedUserData.pokemonList = [...updatedUserData.pokemonList, JSON.stringify(pokemonData)];
        if(!updatedUserData.registers.includes(pokemonData.name)) updatedUserData.registers = [...updatedUserData.registers, pokemonData.name];
        
        if (pokemonData.shiny === "shiny") {
            if (updatedUserData?.shinycount === undefined) {
                updatedUserData.shinycount = 1;
            } else {
                updatedUserData.shinycount = parseInt(updatedUserData.shinycount) + 1;
            }
        }

        if (pokemonData?.megaevolution === true || pokemonData?.gigantamax == true) {
            if (updatedUserData?.megacount === undefined) {
                updatedUserData.megacount = 1;
            } else {
                updatedUserData.megacount = parseInt(updatedUserData.megacount) + 1;
            }
        }

        if (pokemonData?.rarespecies === true) {
            if (updatedUserData?.rarecount === undefined) {
                updatedUserData.rarecount = 1;
            } else {
                updatedUserData.rarecount = parseInt(updatedUserData.rarecount) + 1;
            }
        } 
        return updatedUserData;
    });
}

export function ReclamarEvent(pokemonData, UserData, setUserData, event) {
    AddLastExtraDetailsEvent(pokemonData, UserData); 
    //console.log(pokemonData);
    setUserData(prevUserData => {
        const updatedUserData = { ...prevUserData };
        updatedUserData.pokemonList = [...updatedUserData.pokemonList, JSON.stringify(pokemonData)];
        if(!updatedUserData.registers.includes(pokemonData.name)) updatedUserData.registers = [...updatedUserData.registers, pokemonData.name];
        
        if (pokemonData.shiny === "shiny") {
            if (updatedUserData?.shinycount === undefined) {
                updatedUserData.shinycount = 1;
            } else {
                updatedUserData.shinycount = parseInt(updatedUserData.shinycount) + 1;
            }
        }

        if (pokemonData?.megaevolution === true || pokemonData?.gigantamax === true) {
            if (updatedUserData?.megacount === undefined) {
                updatedUserData.megacount = 1;
            } else {
                updatedUserData.megacount = parseInt(updatedUserData.megacount) + 1;
            }
        }

        if (pokemonData?.rarespecies === true) {
            if (updatedUserData?.rarecount === undefined) {
                updatedUserData.rarecount = 1;
            } else {
                updatedUserData.rarecount = parseInt(updatedUserData.rarecount) + 1;
            }
        } 
        return updatedUserData;
    });
    
    localStorage.setItem(event, true);

    
}

export default Ruleta;
