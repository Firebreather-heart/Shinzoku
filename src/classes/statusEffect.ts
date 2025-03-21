import { Character } from "./characters"
import { SpecialAbilityHandler } from "./handlers"

export class StatusEffect {
    private name: string
    private value: number
    private duration: number
    private isActive: boolean = false
    private receipient: Character

    constructor(name: string, value: number, duration: number, recipient: Character) {
        this.name = name;
        this.value = value;
        this.duration = duration;
        this.receipient = recipient
    }

    getReceipient(){
        return this.receipient
    }
    getName(){
        return this.name
    }
    getValue(){
        return this.value
    }
    getDuration(){
        return this.duration
    }
    setDuration(duration:number){
        this.duration = duration
    }
    activate() {
        this.isActive = true
    }

    deactivate() {
        this.isActive = false
    }

    use() {
        if (this.isActive) {
            this.duration -= 1
            if (this.duration === 0) this.deactivate()
        }
    }
}