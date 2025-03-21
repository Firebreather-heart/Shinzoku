"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var autoBattlefield_1 = require("./classes/autoBattlefield");
var teams_1 = require("./classes/teams");
var utils_1 = require("./utils");
var narutoData = {
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
        { name: 'evasion', value: 200, mpCost: 50, abilityName: "Shadow clone substitution" },
        { name: 'critical strike', value: 3, mpCost: 100, abilityName: "Rasengan" },
    ]
};
var sasukeData = {
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
        { name: 'stun', value: 2, mpCost: 80, abilityName: "chidori" },
        { name: 'poison', value: 5, mpCost: 400, abilityName: "Amaterasu" },
    ]
};
var naruto1Data = {
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
        { name: 'evasion', value: 200, mpCost: 50, abilityName: "Shadow clone substitution" },
        { name: 'critical strike', value: 3, mpCost: 100, abilityName: "Rasengan" },
    ]
};
var sasuke1Data = {
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
        { name: 'stun', value: 2, mpCost: 80, abilityName: "chidori" },
        { name: 'poison', value: 5, mpCost: 400, abilityName: "Amaterasu" },
    ]
};
var kakashiData = {
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
        { name: 'buff', value: 50, mpCost: 680, abilityName: "Susanoo" },
        { name: 'evasion', value: 5, mpCost: 400, abilityName: "Kamui" },
    ]
};
var obitoData = {
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
        { name: 'heal self', value: 200, mpCost: 800, abilityName: "Wood style regeneration" },
        { name: 'evasion', value: 5, mpCost: 300, abilityName: "Kamui" },
    ]
};
var narutoChar = (0, utils_1.initiatePlayerFromData)(narutoData);
var sasukeChar = (0, utils_1.initiatePlayerFromData)(sasukeData);
var naruto1Char = (0, utils_1.initiatePlayerFromData)(naruto1Data);
var sasuke1Char = (0, utils_1.initiatePlayerFromData)(sasuke1Data);
var kakashiChar = (0, utils_1.initiatePlayerFromData)(kakashiData);
var obitoChar = (0, utils_1.initiatePlayerFromData)(obitoData);
var team1 = new teams_1.Team("New Gen", [narutoChar, sasukeChar]);
var team2 = new teams_1.Team("New Gen", [naruto1Char, sasuke1Char]);
// const team2 = new Team("Old Gen", [kakashiChar, obitoChar])
var battleield = new autoBattlefield_1.AutoBattleField(team1, team2, 1);
battleield.runBattle();
