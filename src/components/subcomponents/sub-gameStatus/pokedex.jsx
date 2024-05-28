import React from 'react';
import './styles/pokedex.css'
import {useState, useEffect} from 'react';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {GetSpeciesDataByDexNum, GetSpanishName} from './lib/PokemonSpeciesData';
import {GetDataByDexNum, GetFirstType, GetSecondType, GetPrettyTypeNameSpanish, GetImage} from './lib/PokemonData';
import CircularProgress from '@mui/material/CircularProgress';
import { MouseOverPopover } from './mouseOverPopOver';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { GetFrequencyByDexNum } from './lib/pokemonFrequency';
import { Link } from 'react-router-dom';

/**
 * Función principal que se exporta.
 */
function Pokedex({UserData}) 
{
    const initGenerationNum = sessionStorage.getItem("generationNum");
    const [generationNum, setGenerationNum] = useState(initGenerationNum ? parseInt(initGenerationNum) : 1);
    const [dexNumbers, setDexNumbers] = useState(MakeDexNumByGeneration(generationNum));
    const [selectedPokemon, setSelectedPokemon] = useState(0);

    useEffect(() => {
        setDexNumbers(MakeDexNumByGeneration(generationNum));
    }, [generationNum]);

    return (
        <>
            <div id="previousGenContainer">
                <NavGenArrow reversed setGenerationNum={setGenerationNum} generationNum={generationNum}  />
            </div>

            <div id="pokedexBigBox" tabIndex="1">
                <CompleteEntryList UserData={UserData} setGenerationNum={setGenerationNum} generationNum={generationNum} setDexNumbers={setDexNumbers} dexNumbers={dexNumbers} selectedPokemon={selectedPokemon} />
            </div>

            <div id="nextGenContainer"> 
                <NavGenArrow setGenerationNum={setGenerationNum} generationNum={generationNum}  />
            </div>
        </>
    );
}
    
    /**
     * Botones de navegación entre generaciones.
     * @param reversed [Boolean] True si es la flecha izquierda
     * @param generationNum [Obligatorio]
     * @param setGenerationNum [Obligatorio]
     */
function NavGenArrow(props)
{
    const [disabled, setDisabled] = useState(props.reversed ? props.generationNum <= 1 : props.generationNum >= MAX_GENERATION_NUM);

    useEffect(() => {
        // Estado desactivado del botón
        setDisabled(props.reversed ? props.generationNum <= 1 : props.generationNum >= MAX_GENERATION_NUM);
    }, [props.generationNum]); // Cambia solo si se cambia de generación

    // Handler del botón para que cambie de generación
    const handler = () => {

        const newGenerationNum = props.reversed ? props.generationNum - 1 : props.generationNum + 1;
        
        if (newGenerationNum >= 1 && newGenerationNum <= MAX_GENERATION_NUM) 
        {
            sessionStorage.setItem("generationNum", newGenerationNum);
            props.setGenerationNum(newGenerationNum);
        }

    };

    return (
        <div className={'nextGenArrow ' + (props.reversed ? 'reversed ' : '') + (disabled ? 'disabled' : '')}>
            <Link onClick={handler} aria-label={!props.reversed ? "Avanzar a la siguiente generación" : "Regresar a la anterior generación"}>
                <ArrowRightIcon />
            </Link>
        </div>
    );
}

/**
 * Lista de la Pokédex.
 * @param setGenerationNum [Obligatorio]
 * @param generationNum [Obligatorio]
 * @param setDexNumbers [Obligatorio]
 * @param dexNumbers [Obligatorio]
 */
function CompleteEntryList(props)
{

    const list = props.dexNumbers.map((num) => {
        const card = (<PokemonEntry num={num} known={props.UserData.registers.includes(num) ? "known" : ""} key={num} />);
        return card;
        }
    );

    const registeredMons = props.UserData.registers.length - 1;
    const percentage = (100*(registeredMons/1025)).toFixed(2);

    return (
        <>
            <p className="yourRegisters"><label>Registrados: {registeredMons} / 1025 ({percentage}%)</label></p>
            <p className="generationTitle inlineContainer">
                {props.generationNum + "º Generación"} 
                <MouseOverPopover content={<InfoOutlinedIcon className="infoGenerationIcon"/>} 
                                shown={
                                <span> 
                                    La generación de un Pokémon es el grupo de Pokémon que se introdujeron en un mismo juego de la saga.
                                </span>
                                } />
            </p>
            {list}
        </>
    );
}


/**
 * Un solo contenedor de un pokémon.
 * @param num [Integer | Obligatorio] El número de registro del pokémon
 * @param known [String] "known" si se ha descubierto
*/
function PokemonEntry(props) 
{
    
    // Data
    const [pokemonData, setPokemonData] = useState(null);
    const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);

    // Actualizador de los datos
    useEffect(() => {
        const fetchDataAndUpdateState = async () => 
        {
            const data = await GetDataByDexNum(props.num);
            const dataSpecies = await GetSpeciesDataByDexNum(props.num);
            setPokemonData(data);
            setPokemonSpeciesData(dataSpecies);
        };

        fetchDataAndUpdateState();
    }, [props.num]);

    let knownCond= '';
    let name = ""; 
    let pokemon, firstType, rarityNum = '0'; 
    if(props.known === 'known')
    {
        name = GetSpanishName(pokemonSpeciesData);
        firstType = GetFirstType(pokemonData);
        const secondType = GetSecondType(pokemonData);

        let secondTypeContainer = (<></>); 
        if(secondType !== null)
        {
            secondTypeContainer = (<div className="pokemonType" tabindex="-1" aria-hidden="true">{GetPrettyTypeNameSpanish(secondType)}</div>);
        }  
        knownCond = props.known + " " + firstType;
        
        pokemon = (
            <div aria-label={"Número " + props.num + ":" +name}>
                {GetImage(pokemonData, false)}    

                <div className='types' tabindex="-1" aria-hidden="true">
                    <div className="pokemonType">{GetPrettyTypeNameSpanish(firstType)}</div>
                    {secondTypeContainer}
                </div>

                <p className='pokemonName' tabindex="-1" aria-hidden="true">{(name === undefined ? "Cargando..." : name)}</p>
            </div>
        );
    }
    else 
    {
        // Caso de pokémon desconocido
        rarityNum = GetFrequencyByDexNum(props.num);

        pokemon = <div className='unknownMessageContainer' aria-label={"Número " + props.num + ':No se ha descubierto todavía'}>
                    <MouseOverPopover content={<p className="unknownMessage" tabindex="-1" aria-hidden="true">???</p>} 
                        shown={
                            <span > 
                                Este Pokémon aún no ha sido descubierto.
                            </span>
                        } />
                    </div>
    }

    // Si los datos aún se están cargando, muestra CircularProgress dentro de la tarjeta
    const content = (pokemonData === null || pokemonSpeciesData === null) ? 
        <div className="loadingPokemon">
            <CircularProgress />
        </div> : 
        pokemon;

    return (
        <div className={"entryBox " + knownCond + " rarity" + (rarityNum)} key={"pokemon-" + props.num}>
            <p className="dexNumber" aria-hidden="true" tabindex="-1">Nº {props.num}</p>
            {content}
        </div>
    );
}

/**
 * Devuelve un array con los dexNum de los pokémon de la generación indicada
 * @param numGen [Integer | Obligatorio] El número de la generación que deseas
 */
const MakeDexNumByGeneration = (numGen) =>
{
    if(numGen <= 0 || numGen > MAX_GENERATION_NUM)
    {
        return null;
    }

    function ArrayFrom(first, last)
    {
        return Array.from({ length: last - first + 1 }, (_, index) => index + first);
    }

    // Obtenemos el intervalo de dexNums de la generación indicada
    const interval = generationDexNums[numGen];

    return ArrayFrom(interval[0], interval[1]);
}

const MAX_GENERATION_NUM = 9;
const generationDexNums = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025]
};




export default Pokedex;