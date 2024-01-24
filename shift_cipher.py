def shift_cipher(text: str) -> str:
    """
    Shifts ciphertext by user inputted amount.

    :param text: Caeser Shift ciphertext.
    :return: Decoded plain text.
    """

    # get shift amount
    shift = ''
    while not shift.isdigit():
        shift = input('Enter shift amount: ')
    shift = int(shift)

    shifted_text = ''

    # print out the mapping
    mapping = dict()
    print('\nKey Mapping:')
    for letter in range(ord('A'), ord('Z') + 1):
        print(chr(letter), end=' ')
    print()
    for letter in range(ord('a'), ord('z') + 1):
        shifted_letter = chr((letter - ord('a') + shift) % 26 + ord('a'))
        mapping[chr(letter).upper()] = shifted_letter
        print(shifted_letter, end=' ')

    # decode cipher
    for c in text:
        if c.isupper():
            shifted_text += mapping[c]
        else:
            shifted_text += c

    return shifted_text
