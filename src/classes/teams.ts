import { Character } from "./characters"

export class Team {
    private name: string
    private rating: number
    private characters: Character[]
    private size: number

    constructor(name: string, characters: Character[]) {
        this.name = name;
        this.characters = characters;
        this.size = this.characters.length;
        this.rating = this.getTeamRating()

    }

    setMembers(characters: Character[]){
        this.characters = characters
        this.size = this.characters.length
        this.rating = this.getTeamRating()
    }
    getMembers(){
        return this.characters
    }
    getName(){
        return this.name
    }
    getTeamRating(): number {
        let rating = 0;
        for (let char of this.characters) rating += char.getCharRank();
        return rating
    }

    getSize(): number{
        return this.size
    }
}