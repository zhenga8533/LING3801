def remove_repeating_and_non_alpha(text: str) -> str:
    """
    Removes any repeating or non alpha characters from string.

    :param text: String to strip characters from.
    :return: Inputted string without only non-repeating alpha characters.
    """

    result = []
    prev_char = None

    for char in text:
        if char.isalpha():
            if char != prev_char:
                result.append(char)
            prev_char = char

    return ''.join(result)


def vigenere_mapping(keyword: str) -> None:
    """
    Prints out the vigenere mapping of a keyword.

    :param keyword: Vigenere cipher keyword.
    """

    print('\nKey Mapping:')
    print(' '.join(chr(char) for char in range(ord('a'), ord('z') + 1)))

    base = ord('A')
    for c in keyword:
        for i in range(26):
            print(chr((ord(c) + i - base) % 26 + base), end=' ')
        if c != keyword[-1]:
            print()


def vigenere_cipher(text: str) -> str:
    """
    Decode/encodes Vigenere text given inputted keyword.

    :param text: Vigenere text to be analyzed.
    :return: Decoded/encoded Vigenere text.
    """

    keyword = remove_repeating_and_non_alpha(input('Enter keyword: ').upper())
    vigenere_mapping(keyword)
    key_length = len(keyword)
    key_index = 0
    result = ''

    base = ord('A')
    for c in text:
        if c.isalpha():
            key_char = keyword[key_index % key_length]

            shift = ord(key_char) - base
            if c.isupper():
                shifted_char = chr((ord(c) - shift - base) % 26 + base).lower()
            else:
                shifted_char = chr((ord(c.upper()) + shift - base) % 26 + base)

            result += shifted_char
            key_index += 1
        else:
            result += c

    return result
