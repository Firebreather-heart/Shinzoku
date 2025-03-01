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


class HP(Attribute):
    def __init__(self, value):
        super().__init__('hp', value)

class MP(Attribute):
    def __init__(self, value):
        super().__init__('mp', value)

class Armor(Attribute):
    def __init__(self, value):
        super().__init__('armor', value)

class Range(Attribute):
    def __init__(self, value):
        super().__init__('range', value)

class Damage(Attribute):
    def __init__(self, value):
        super().__init__('dmg', value)

class Speed(Attribute):
    def __init__(self, value):
        super().__init__('speed', value)

class SpecialAbility:
    def __init__(self, name, description):
        self.name = name
        self.description = description

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    def __eq__(self, other):
        return self.name == other.name
    
class Evasion(SpecialAbility):
    def __init__(self, value):
        self.value = value
        super().__init__('evasion', 'Evade attacks to certain extent')


class Character(object):
    def __init__(self, name, attributes:List[Attribute], character_class):
        self.name = name
        self.character_class = character_class
        self.attributes = attributes
        for attribute in attributes:
            setattr(self, attribute.name, attribute.value)
    
    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.name
    
    def __eq__(self, other):
        return self.name == other.name