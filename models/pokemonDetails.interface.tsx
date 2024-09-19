export interface PokemonDetails {
    name: string,
    height: number,
    weight: number,
    sprites: Sprites,
    stats: Stats[]

}

interface Sprites {
    front_default: string,
    back_default?: string,
    front_female?: string,
    back_female?: string
}

interface Stats{
    base_stat: number,
    effort:number,
    stat: Stat
}

interface Stat{
    name:string,
    url:string
}