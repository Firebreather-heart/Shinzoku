class Team:
    def __init__(self, name):
        self.name =  name 

    def _populate_team(self, characters:list):
        self.characters = characters

    def assemble(self, characters:list):
        self._populate_team(characters)