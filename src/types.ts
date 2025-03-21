export type Ability = {
    name: string,
    description: string
}

export type specialAbility = Ability &{
    value: number,
}

export type attribute = {
    mp: number,
    hp: number,
    dmg: number,
    speed: number,
    range: number,
    armor: number,
    stamina: number
}

type attributeData = {
    name: string,
    value: number
}

type specialAbilityData = {
    name: string,
    value: number,
    mpCost: number,
    abilityName: string
}

export type PlayerData = {
    name: string,
    class: string,
    attributes: Array<attributeData>,
    specialAbilities: Array<specialAbilityData>
}
