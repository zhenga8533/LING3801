import os
from shift_cipher import shift_cipher
from ma_cipher import ma_cipher
from vigenere_cipher import vigenere_cipher


def load_data(file_path: str) -> str or None:
    """
    Loads String data from a specified file path.

    :param file_path: File path from current location.
    :return: Data in the file or None if path does not exist.
    """

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            data = file.read()
        return data

    print(f'{file_path} does not exist!')
    return None


def analyze_cipher(text: str) -> None:
    """
    Prints out and checks plain text for the word 'the'.

    :param text: Decoded ciphertext to analyze.
    """

    print(text)
    text.replace('\n', '')
    search = text.find('the') != -1
    print(f'Occurance of the word \'the\': {search}')


def save_cipher(text: str) -> None:
    """
    Saves plain text to user inputted file path.

    :param text: Decoded ciphertext to save.
    """

    file_path = input('Enter output file path: ')
    with open(file_path, 'w') as file:
        file.write(text)
        print(f'Successfully saved data to {file_path}!')


if __name__ == '__main__':
    # Get file data
    input_file = input('Enter input file path: ')
    cipher_text = load_data(input_file)
    if cipher_text is None:
        exit(1)

    # Other variables and constants
    ciphers = [shift_cipher, ma_cipher, vigenere_cipher, save_cipher]
    decoded_cipher = ''
    n = len(ciphers)

    while True:
        # select cipher
        choice = input('\nCiphers: \n'
                       '1. Shift Cipher\n'
                       '2. Monoalphabetic Cipher\n'
                       '3. Vigenère Cipher\n'
                       '4. Save Cipher\n'
                       '5. Quit\n'
                       'Select a ciper: ')
        if not choice.isdigit() or choice == '5':
            break
        option = (int(choice) - 1) % n
        cipher = ciphers[option]
        print()

        # decode and analyze ciphers based on choice
        if option == 3:
            cipher(decoded_cipher)
        else:
            decoded_cipher = cipher(cipher_text)
            if input('\n\nAnalyze cipher? ').lower() == 'yes':
                analyze_cipher(decoded_cipher)

    print('Goodbye!')
