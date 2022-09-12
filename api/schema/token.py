"""JWT schema"""
from datetime import datetime,timedelta
from copy import deepcopy

class TokenSchema:
    """This class defines the expected structure of the JWT"""
    public_id = str
    exp = datetime
    def __init__(self,_public_id:str="",_exp:datetime =datetime.utcnow() + timedelta(minutes=45)):
        self.public_id =_public_id
        self.exp=_exp

    @property
    def serialize(self):
        """Serialize the JWT to show it in the result"""
        return {
            "public_id":self.public_id,
            "exp":self.exp
        }

    def from_dict(self,_dict:dict):
        """Create a JWT from the given data"""
        self.public_id=_dict['public_id']
        self.exp=_dict['exp']
        return deepcopy(self)
