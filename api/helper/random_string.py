import string
import random

def generate(length):
    """ Generate a random string of a given length """
    random.seed()
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for _ in range(length))
    print("Random string of length", length, "is:", result_str)
    return result_str
