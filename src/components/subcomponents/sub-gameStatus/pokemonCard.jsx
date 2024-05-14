import React, { useState , useEffect } from "react";
import './styles/almacen.css';
import { GetSpeciesDataByName, GetSpanishName} from './lib/PokemonSpeciesData';
import { GetDataByName, GetFirstType, GetSecondType, GetPrettyTypeNameSpanish, GetImage, GetDexNum} from './lib/PokemonData';
import { Link } from "react-router-dom";


function PokemonCard({data}) 
{
    /* Esto habria que hacerlo con un array de pokemon? */
    const [pokemonData, setPokemonData] = useState(null);
    const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);

    useEffect(() => {
        const fetchDataAndUpdateState = async () => 
            {
                const dataNormal = await GetDataByName(data.name);
                const dataSpecies = await GetSpeciesDataByName(data.name);
                setPokemonData(dataNormal);
                setPokemonSpeciesData(dataSpecies);
            };

            fetchDataAndUpdateState();
    });

    let pokemon, firstType = '';

    const name = data.nametag === null ? GetSpanishName(pokemonSpeciesData) : data.nametag;
    firstType = GetFirstType(pokemonData);
    const secondType = GetSecondType(pokemonData);
    const dexNum = GetDexNum(pokemonData);
    
    let secondTypeContainer = (<></>); 
    if(secondType !== null)
    {
        secondTypeContainer = (<div className="pokemonType">{GetPrettyTypeNameSpanish(secondType)}</div>);
    }  
        
    pokemon = (
        <>
            {GetImage(pokemonData, (data.shiny === "shiny"))}    
                <div className='types'>
                    <div className="pokemonType">{GetPrettyTypeNameSpanish(firstType)}</div>
                    {secondTypeContainer}
                </div>
            <p className='pokemonName'>{name}</p>
        </>
    );

    return (
        <Link to={"ver-pokemon?id=" + data.id}>
            <div className={"entryBox " + firstType + " " + data.shiny} key={data.id}>
                <p className="dexNumber">Nº {dexNum}</p>
                {pokemon}
            </div>
        </Link>
    );
}

export default PokemonCard;