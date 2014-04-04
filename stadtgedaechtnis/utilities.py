__author__ = 'jpi'

import re


def replace_multiple(text, dictionary):
    """
    Replaces different words in a string using a dictionary.
    """
    # escape for regular expressions
    dictionary = dict((re.escape(key), value) for key, value in dictionary.iteritems())
    # compile joint pattern
    pattern = re.compile("|".join(dictionary.keys()))
    # replace all the keys with the values
    text = pattern.sub(lambda m: dictionary[re.escape(m.group(0))], text)
    return text