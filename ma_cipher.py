from collections import defaultdict


def ma_cipher(text: str) -> str:
    # Letter frequency data from most to least from:
    # https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html
    frequency_table = ['e', 'a', 'r', 'i', 'o', 't', 'n', 's', 'l', 'c', 'u', 'd', 'p', 'm', 'h', 'g', 'b', 'f', 'y',
                       'w', 'k', 'v', 'x', 'z', 'j', 'q']

    # Get count of cipher text
    letter_frequency = defaultdict(int)
    total = 0

    for c in text:
        if c.isalpha():
            letter_frequency[c] += 1
            total += 1

    # Sort frequency table and print out the mapping
    sorted_letters = dict(sorted(letter_frequency.items(), key=lambda item: item[1], reverse=True))
    mapping = dict()

    print('Letter Frequency:')
    for index, (key, value) in enumerate(sorted_letters.items()):
        mapping[key] = frequency_table[index]
        frequency = round(value / total * 100, 2)
        print(f'{key}: {frequency}%', end=', ' if index != len(sorted_letters) - 1 else '\n')
        if index % 9 == 8:
            print()

    print('Key Mapping:')
    for letter in range(ord('A'), ord('Z') + 1):
        print(chr(letter), end=' ')
    print()
    for letter in range(ord('A'), ord('Z') + 1):
        print(mapping.get(chr(letter), '/'), end=' ')

    # "decode" cipher
    decoded_cipher = ""
    for c in text:
        decoded_cipher += mapping.get(c, c)

    return decoded_cipher
