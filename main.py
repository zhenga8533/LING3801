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
    text.replace('\n', '')
    search = text.find('the') != -1
    print(f'Occurance of the word \'the\': {search}')


def save_cipher(text: str):
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
    ciphers = [shift_cipher, save_cipher]
    decoded_cipher = ''
    n = len(ciphers)

    while True:
        # select cipher
        choice = input('\nCiphers: \n'
                       '1. Shift Cipher\n'
                       '2. Save Cipher\n'
                       '3. Quit\n'
                       'Select a ciper: ')
        if not choice.isdigit() or int(choice) == 3:
            break
        option = (int(choice) - 1) % n
        cipher = ciphers[option]
        print()

        # decode and analyze ciphers based on choice
        if option == 1:
            cipher(decoded_cipher)
        else:
            decoded_cipher = cipher(cipher_text)
            analyze_cipher(decoded_cipher)

    print('Goodbye!')
