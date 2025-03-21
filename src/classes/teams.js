"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
var Team = /** @class */ (function () {
    function Team(name, characters) {
        this.name = name;
        this.characters = characters;
        this.size = this.characters.length;
        this.rating = this.getTeamRating();
    }
    Team.prototype.setMembers = function (characters) {
        this.characters = characters;
        this.size = this.characters.length;
        this.rating = this.getTeamRating();
    };
    Team.prototype.getMembers = function () {
        return this.characters;
    };
    Team.prototype.getName = function () {
        return this.name;
    };
    Team.prototype.getTeamRating = function () {
        var rating = 0;
        for (var _i = 0, _a = this.characters; _i < _a.length; _i++) {
            var char = _a[_i];
            rating += char.getCharRank();
        }
        return rating;
    };
    Team.prototype.getSize = function () {
        return this.size;
    };
    return Team;
}());
exports.Team = Team;
