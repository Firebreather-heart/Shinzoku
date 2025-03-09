from typing import List
from characters import Character

class Team:
    def __init__(self, name):
        self.name =  name 
        self.rating = 0
        self.characters = []

    def _populate_team(self, characters:List[Character]):
        self.characters = characters
        self.size = len(characters)

    def compute_rating(self):
        self.rating = sum(i.rank for i in self.characters)
        return self.rating

    def assemble(self, characters:list):
        self._populate_team(characters)

    def count(self):
        return len(self.characters)
    
    def __iter__(self):
        return iter(self.characters)
    
    def shuffle(self):
        import random
        random.shuffle(self.characters)

    def __str__(self):
        return self.name