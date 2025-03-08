from typing import List


class Attribute(object):
    def __init__(self, name, value):
        self.name = name
        self.value = value

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    def __eq__(self, other):
        return self.name == other.name


class SpecialAbility:
    def __init__(self, name, value):
        self.name = name
        self.value = value
        self.description = self.get_description(name)

    def get_description(self, name):
        ability_dict = {
            "evasion": 'Evade attacks to certain extent',
            'critical strike': 'Chance to deal certain multiple of damage',
            'poison': 'Deal damage over time',
            'stun': 'Stun the enemy for a turn',
            'heal self': 'Heal self',
            'heal others': 'Heal others',
            'buff': 'Increase hp to certain extent'
        }
        return ability_dict.get(name)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    def __eq__(self, other):
        return self.name == other.name


class Character(object):
    def __init__(self, name, attributes: List[Attribute], character_class):
        self.name = name
        self.character_class = character_class
        self.attributes = attributes
        self.special_abilities = []
        self.rank = 0
        for attribute in attributes:
            self.rank += attribute.value
            setattr(self, attribute.name, attribute.value)

    def _add_special_ability(self, special_ability: SpecialAbility):
        self.rank += special_ability.value
        self.special_abilities.append(special_ability)

    def to_json(self):
        return {
            'name': self.name,
            'class': self.character_class,
            'attributes': [attribute.__dict__ for attribute in self.attributes],
            'special_abilities': [special_ability.__dict__ for special_ability in self.special_abilities]
        }

    @classmethod
    def from_json(cls, data):
        name = data['name']
        character_class = data['class']
        attributes = [Attribute(attribute['name'], attribute['value'])
                      for attribute in data['attributes']]
        character = cls(name, attributes, character_class)
        for special_ability in data['special_abilities']:
            character._add_special_ability(SpecialAbility(
                special_ability['name'], special_ability['value']))
        return character
    
    def battle_rank(self):
        if self.rank <= 4000:
            return 'E'
        elif self.rank > 4000 and self.rank <= 6000:
            return 'D' 
        elif self.rank > 6000 and self.rank <= 8000:
            return 'C'
        elif self.rank > 8000 and self.rank <= 10000:
            return 'B'
        elif self.rank > 10000 and self.rank <= 14000:
            return 'A'
        else:
            return 'S'

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    def __eq__(self, other):
        return self.name == other.name
