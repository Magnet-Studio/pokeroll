
export const rarezaExtraPoints = [100, 500, 1500, 4000, 10000, 13500];

export const GetRarezaExtraPoints = (frequency) => {
    return rarezaExtraPoints[frequency - 1];
}

/**
 * Calcula los puntos de rareza de un pokémon 
 * @param ivs 
 * @param shiny 
 * @param frequency 
 */
export const GetRarezaPoints = (ivs, shiny, frequency, mega, rare) => {
    const rarity = GetRarezaExtraPoints(frequency);
    const shinyFactor = (shiny === "shiny" ? 5000 : 0);
    const megaFactor = (mega !== undefined ? (mega === true ? 1500 : 0) : 0);
    const rareFactor = (rare !== undefined ? (rare === true ? 1000 : 0) : 0);
    const ivsSum = ivs ? (ivs.hp + ivs.atq + ivs.def + ivs.spatq + ivs.spdef + ivs.spe) : 0;
    const ivFactor = (Math.pow(ivsSum , 1.4)) * 10
    const finalValue = Math.trunc((Math.pow(shinyFactor + rarity + megaFactor + rareFactor, 1.2) + ivFactor) / 5);

    return !isNaN(finalValue) ? (finalValue < 10 ? 10 : finalValue) : "Calculando...";
}

export const GetRarezaPointsSimplified = (pokeData) => {
    return GetRarezaPoints(pokeData.iv, pokeData.shiny, parseInt(pokeData.frequency), pokeData.megaevolution, pokeData.rarespecies);
}