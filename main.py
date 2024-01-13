import os
from shift_cipher import shift_cipher


def load_data(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            data = file.read()
        return data

    print(f'{file_path} does not exist!')
    return None


def analyze_cipher(text: str):
    print(text)
    search = text.find('the') != -1
    print(f'Occurance of the word \'the\': {search}')


if __name__ == '__main__':
    # Get file data
    input_file = input('Enter file path: ')
    cipher_text = load_data(input_file)
    if cipher_text is None:
        exit(1)

    # Other variables and constants
    ciphers = [shift_cipher]
    n = len(ciphers)

    while True:
        # select cipher
        choice = input('\nCiphers: \n'
                       '1. Shift Cipher\n'
                       '2. Quit\n'
                       'Select a ciper: ')
        if not choice.isdigit() or int(choice) == n + 1:
            break
        option = (int(choice) - 1) % n
        cipher = ciphers[option]

        # decode and analyze ciphers based on choice
        decoded_cipher = cipher(cipher_text)
        analyze_cipher(decoded_cipher)

    print('Goodbye!')
