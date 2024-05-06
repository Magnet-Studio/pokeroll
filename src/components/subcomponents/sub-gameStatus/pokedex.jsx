import React from 'react';
import './styles/pokedex.css'
import {GetDataByDexNum, GetFirstType, GetName, GetSecondType} from './PokeAPI/PokemonData';
import {GetSpeciesDataByDexNum, GetSpanishName} from './PokeAPI/PokemonSpeciesData';
import {useState, useEffect} from 'react';

/**
 * Array con todos los ID de pokémon que hay.
 * @warn Quizás usemos otro método
 */
const dexNumber = Array.from({length: 1025}, (_, index) => index + 1);

/**
 * Función principal que se exporta.
 */
function Pokedex() {
    return (
        <>
            <div id="previousGenContainer">
                <NavGenArrow previous />
            </div>

            <div id="pokedexBigBox">
                <CompleteEntryList />
            </div>

            <div id="nextGenContainer"> 
                <NavGenArrow />
            </div>
        </>
    );
}

/**
 * Lista completa de la Pokédex.
 */
function CompleteEntryList()
{
    const known = 'known'
    const list = dexNumber.map((num) => 
        <PokemonEntry num={num} known={known} key={num} />
    );

    return (
        <>
            {list}
        </>
    );
}

/**
 * Un solo contenedor de un pokémon.
 * @param num [Integer | Obligatorio] El número de registro del pokémon
 * @param known [String] "known" si se ha descubierto
 */
function PokemonEntry(props) {
    
    let num = 0;
    if(props.num != undefined)
    {
        num = props.num;
    }

    let pokemon, known, firstType = ''; 

    const [pokemonData, setPokemonData] = useState(null);
    const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);

    useEffect(() => {
        const fetchDataAndUpdateState = async () => 
        {
            const data = await GetDataByDexNum(num);
            const dataSpecies = await GetSpeciesDataByDexNum(num);
            setPokemonData(data);
            setPokemonSpeciesData(dataSpecies);
        };

        fetchDataAndUpdateState();
    }, [num]);

    if(props.known === 'known')
    {
        // Caso de pokémon descubierto
        known = "known";

        const name = GetSpanishName(pokemonSpeciesData);
        firstType = GetFirstType(pokemonData);
        const imageName = GetName(pokemonData);

        const secondType = GetSecondType(pokemonData);
        const secondcontainer = secondType !== null ? (<div className="pokemonType">{prettyTypeNameSpanish(secondType)}</div>) : (<></>);
        

        pokemon = (
        <>
            <img className="pokemonImg" src={"https://img.pokemondb.net/sprites/home/normal/" + imageName + ".png"} alt={name}></img>
            
            <div className='types'>
                <div className="pokemonType">{prettyTypeNameSpanish(firstType)}</div>
                {secondcontainer}
            </div>
            <p className='pokemonName'>{name}</p>
            
        </>);
    }
    else 
    {
        // Caso de pokémon desconocido
        pokemon = <p className="unknownMessage">???</p>
    }



    return (
        <div className={"entryBox " + known + " " + firstType} key={"pokemon-" + num}>
            <p className="dexNumber">Nº {num}</p>
            {pokemon}
        </div>
    );
}

function NavGenArrow(props)
{
    let previous = '';
    if(props.previous === true)
    {
        previous = props.previous;
    }

    return (
        <div className={'nextGenArrow ' + previous}>

        </div>
    );
}

function prettyTypeNameSpanish(name) {
    switch (name) {
        case "normal":
            return "Normal";
        case "fire":
            return "Fuego";
        case "water":
            return "Agua";
        case "grass":
            return "Planta"
        case "poison":
            return "Veneno"
        case "bug":
            return "Bicho"
        case "flying":
            return "Volador"
        case "electric":
            return "Eléctrico"
        case "ground":
            return "Tierra"
        case "fairy":
            return "Hada"
        case "fighting":
            return "Lucha"
        case "rock":
            return "Roca"
        case "psychic":
            return "Psíquico"
        case "steel":
            return "Acero"
        case "ice":
            return "Hielo"
        case "ghost":
            return "Fantasma"
        case "dragon":
            return "Dragón"
        case "dark":
            return "Siniestro"
    }
}



export default Pokedex;