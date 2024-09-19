import { Pokemon } from "@/models/pokemon.interface";
import { PokemonClient } from "@/client/client";
import { PokemonDetails } from "@/models/pokemonDetails.interface";
import React, { useEffect, useState } from "react";
import { Text, Image } from "react-native";


export function PokemonComponent(props: Pokemon){

    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>()

    useEffect(() => {
        fetchDetails()
    },[])

    async function fetchDetails() {
        const response = await PokemonClient.getAPokemon(props.name)
        setPokemonDetails(response)
    }

    return(
        <>
            <Text>{pokemonDetails?.name}</Text>
            <Image style={{width:120, height:120}} source={{uri: pokemonDetails?.sprites.front_default}}/>
        </>
    )
}