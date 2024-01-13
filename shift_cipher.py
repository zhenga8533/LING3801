def shift_cipher(text: str):
    # get shift amount
    shift = ''
    while not shift.isdigit():
        shift = input('Enter shift amount: ')
    shift = int(shift)

    shifted_text = ''
    base = ord('A')

    # print out the mapping
    print('\nKey Mapping:')
    for letter in range(ord('a'), ord('z') + 1):
        print(chr(letter), end=' ')
    print()
    for letter in range(ord('A'), ord('Z') + 1):
        shifted_letter = chr((letter - ord('A') + shift) % 26 + ord('A'))
        print(shifted_letter, end=' ')

    print('\nDecoded Cipher:')
    for c in text:
        if c.isalpha():
            ascii_value = ord(c.upper())
            shifted_ascii = (ascii_value - base + shift) % 26 + base
            shifted_text += chr(shifted_ascii).lower()
        elif c == '\n':
            shifted_text += c

    return shifted_text
