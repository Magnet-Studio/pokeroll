import React, { useState , useEffect } from "react";
import './styles/almacen.css';
import { GetSpeciesDataByName, GetSpanishName} from './lib/PokemonSpeciesData';
import { GetDataByName, GetPrettyTypeNameSpanish, GetImage, GetDexNum, GetVariantImage} from './lib/PokemonData';
import { Link } from "react-router-dom";

// LiberarMenu SOLO se utiliza en LiberarButton, si se usaba tab, se podia seleccionar

function PokemonCard({data, liberarMenu}) 
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
    firstType = data.type1;
    const secondType = data.type2;
    const dexNum = GetDexNum(pokemonData);
    
    let secondTypeContainer = (<></>); 
    if(secondType !== null)
    {
        secondTypeContainer = (<div className="pokemonType">{GetPrettyTypeNameSpanish(secondType)}</div>);
    }  

    
        
    pokemon = (
        <>
            {data?.variant === undefined ? GetImage(pokemonData, (data.shiny === "shiny")) : GetVariantImage(data.variant.name, (data.shiny === "shiny"))}    
                <div className='types'>
                    <div className="pokemonType">{GetPrettyTypeNameSpanish(firstType)}</div>
                    {secondTypeContainer}
                </div>
            <p className='pokemonName'>{name}</p>
        </>
    );

    let megaData="";
    if (data?.megaevolution !== undefined) {
        if (data.megaevolution === true) {
            megaData = "mega"
        }
    }

    let rareData="";
    if (data?.rarespecies !== undefined) {
        if (data.rarespecies === true) {
            rareData = "rare"
        }
    }

    let liberar = false;
    if (liberarMenu === "true") {
        liberar = true;
    }

    return (
        (!liberar ? 
            <Link to={"ver-pokemon?id=" + data.id}>
                <div className={"entryBox " + firstType + " " + megaData + " " + rareData + " " + data.shiny} key={data.id}>
                    <p className="dexNumber">Nº {dexNum}</p>
                    {pokemon}
                </div>
            </Link>
            :
            <div className={"entryBox " + firstType + " " + megaData + " " + rareData + " " + data.shiny} key={data.id}>
                <p className="dexNumber">Nº {dexNum}</p>
                {pokemon}
            </div>
        )
    );
}

export default PokemonCard;