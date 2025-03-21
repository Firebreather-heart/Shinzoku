import { AutoBattleField } from "./classes/autoBattlefield"
import { Team } from "./classes/teams"
import { PlayerData } from "./types"
import { initiatePlayerFromData } from "./utils"

const narutoData: PlayerData = {
    name: "Naruto Uzumaki",
    class: "Konoha Shinobi",
    attributes: [
        { name: "hp", value: 5000 },
        { name: "mp", value: 8000 },
        { name: "armor", value: 600 },
        { name: "range", value: 350 },
        { name: "dmg", value: 250 },
        { name: "speed", value: 500 },
        { name: "stamina", value: 1200 }
    ],
    specialAbilities: [
        {name: 'evasion', value: 200, mpCost: 50, abilityName: "Shadow clone substitution"},
        {name: 'critical strike', value: 3, mpCost: 100, abilityName: "Rasengan"},

    ]
}

const sasukeData = {
    name: "Sasuke Uchiha",
    class: "Konoha Shinobi",
    attributes: [
        { name: "hp", value: 4800 },
        { name: "mp", value: 5000 },
        { name: "armor", value: 620 },
        { name: "range", value: 340 },
        { name: "dmg", value: 260 },
        { name: "speed", value: 590 },
        { name: "stamina", value: 1100 }
    ],
    specialAbilities: [
        {name: 'stun', value: 2, mpCost: 80, abilityName: "chidori"},
        {name: 'poison', value: 5, mpCost: 400, abilityName: "Amaterasu"},

    ]
}

const naruto1Data: PlayerData = {
    name: "Naruto Uzumaki",
    class: "Konoha Shinobi",
    attributes: [
        { name: "hp", value: 5000 },
        { name: "mp", value: 8000 },
        { name: "armor", value: 600 },
        { name: "range", value: 350 },
        { name: "dmg", value: 250 },
        { name: "speed", value: 500 },
        { name: "stamina", value: 1200 }
    ],
    specialAbilities: [
        {name: 'evasion', value: 200, mpCost: 50, abilityName: "Shadow clone substitution"},
        {name: 'critical strike', value: 3, mpCost: 100, abilityName: "Rasengan"},

    ]
}

const sasuke1Data = {
    name: "Sasuke Uchiha",
    class: "Konoha Shinobi",
    attributes: [
        { name: "hp", value: 4800 },
        { name: "mp", value: 5000 },
        { name: "armor", value: 620 },
        { name: "range", value: 340 },
        { name: "dmg", value: 260 },
        { name: "speed", value: 590 },
        { name: "stamina", value: 1100 }
    ],
    specialAbilities: [
        {name: 'stun', value: 2, mpCost: 80, abilityName: "chidori"},
        {name: 'poison', value: 5, mpCost: 400, abilityName: "Amaterasu"},

    ]
}

const kakashiData = {
    name: "Kakashi Hatake",
    class: "Konoha Shinobi",
    attributes: [
        { name: "hp", value: 6800 },
        { name: "mp", value: 3000 },
        { name: "armor", value: 620 },
        { name: "range", value: 540 },
        { name: "dmg", value: 460 },
        { name: "speed", value: 790 },
        { name: "stamina", value: 1500 }
    ],
    specialAbilities: [
        {name: 'buff', value: 50, mpCost: 680, abilityName: "Susanoo"},
        {name: 'evasion', value: 5, mpCost: 400, abilityName: "Kamui"},

    ]
}

const obitoData = {
    name: "Obito Uchiha",
    class: "Konoha Shinobi",
    attributes: [
        { name: "hp", value: 4800 },
        { name: "mp", value: 5500 },
        { name: "armor", value: 650 },
        { name: "range", value: 700 },
        { name: "dmg", value: 460 },
        { name: "speed", value: 590 },
        { name: "stamina", value: 1150 }
    ],
    specialAbilities: [
        {name: 'heal self', value: 200, mpCost: 800, abilityName: "Wood style regeneration"},
        {name: 'evasion', value: 5, mpCost: 300, abilityName: "Kamui"},
    ]
}

const narutoChar = initiatePlayerFromData(narutoData)
const sasukeChar = initiatePlayerFromData(sasukeData)
const naruto1Char = initiatePlayerFromData(naruto1Data)
const sasuke1Char = initiatePlayerFromData(sasuke1Data)
const kakashiChar = initiatePlayerFromData(kakashiData)
const obitoChar = initiatePlayerFromData(obitoData)

const team1 = new Team("New Gen", [narutoChar, sasukeChar])
const team2 = new Team("New Gen", [naruto1Char, sasuke1Char])
// const team2 = new Team("Old Gen", [kakashiChar, obitoChar])

const battleield = new AutoBattleField(team1, team2, 1)
battleield.runBattle()