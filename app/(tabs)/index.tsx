import { Image, StyleSheet, Text, ScrollView, Button, View, TextInput, TouchableHighlight, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { PokemonClient } from '@/client/client';
import { Pokemon, PokemonResponse } from '@/models/pokemon.interface';
import { PokemonDetails } from '@/models/pokemonDetails.interface';
import { PokemonComponent } from '@/components/PokemonComponent';
import { BarChart } from 'react-native-chart-kit';


export default function HomeScreen() {
  // const [pokemonList, setPokemonList] = useState<PokemonResponse>()

  const [pokemonList, setPokemonList] = useState<Array<Pokemon>>([])
  const [next, setNext] = useState('')
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>()
  const [pokemonName, setPokemonName] = useState('')

  useEffect(() => {
    fetchPokemons()
  }, [])

  async function fetchPokemons(next?:string) {
    const response = await PokemonClient.getPokemons(next)
    setPokemonList(pokemonList => [...pokemonList,...response.results]) //tem como retorno que vai trazer a lista mais o retorno atual
    setNext(response.next ?? '')
  }

  async function getAPokemon(pokemon: string) {
    const response = await PokemonClient.getAPokemon(pokemon)
    setPokemonDetails(response)
  }

  async function clear() {
    setPokemonDetails(undefined)
    fetchPokemons()
  }

  function showPokemonDetails(pokemonDetails:PokemonDetails){
    const labels = ['']
    const dataset = [0]
    pokemonDetails.stats.forEach( stat => {
      labels.push(stat.stat.name)
      dataset.push(stat.base_stat)
    })

    const data = {
      labels: labels,
      datasets: [
        {
          data: dataset
        }
      ]
    }

    const chartConfig ={
        backgroundGradientFrom: "#000",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`

    }
    
    return(
      <View style={styles.detailsContainer}>
          <Image style={styles.imageContainer} source={{uri: pokemonDetails.sprites.front_default}}/>
          <Text>{pokemonDetails.name}</Text>
          <Text>{pokemonDetails.height}</Text>
          <Text>{pokemonDetails.weight}</Text>
          <BarChart
            chartConfig={chartConfig}
            data={data}
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height/3}
            verticalLabelRotation={45}
            style={{margin:12, borderRadius:8}}          
          />
            
        </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          placeholder='Nome ou Numero do Pokemon'
          onChangeText={(text) => {setPokemonName(text)}}
          />
        <Button title="Pesquisar" onPress={() => getAPokemon(pokemonName)} />
        <Button title="Limpar" onPress={() => clear()} />
      </View>
      {
        pokemonDetails ? 
        showPokemonDetails(pokemonDetails)
        :
        <FlatList
          data={pokemonList}
          renderItem={((pokemon) => {
            return(
            <>
              <TouchableHighlight onPress={() => getAPokemon(pokemon.item.name)}>
                <PokemonComponent {...pokemon.item}/>
              </TouchableHighlight>
            </>
            )
              
          })}
          // onEndReached={() => console.log('Chegou ao fim da lista')}
          onEndReached={() => fetchPokemons(next)}

        />
      //   <ScrollView style={styles.scrollContainer}>
      //   {
      //     pokemonList.map((pokemon) => {
      //       return (
      //         <TouchableHighlight onPress={() => getAPokemon(pokemon.name)}>
      //           <Text style={{marginVertical: 12}}>{pokemon.name}</Text>
      //         </TouchableHighlight>
      //       )
      //     })
      //   }
      // </ScrollView>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    margin: 12
  },
  searchContainer: {
    margin: 12,
    flexDirection: 'row'
  },
  detailsContainer: { 
    alignItems: 'center'
  },
  imageContainer: {
    height: 120,
    width: 120
  }
});
