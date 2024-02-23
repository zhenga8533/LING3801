const table = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "K"],
    ["L", "M", "N", "O", "P"],
    ["Q", "R", "S", "T", "U"],
    ["V", "W", "X", "Y", "Z"]
];

/**
 * Update table HTML 
 */
function updateTable() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            document.getElementById(`pf-${i * 5 + j}`).value = table[i][j];
        }
    }
}

/**
 * Shifts column of table up or down.
 * 
 * @param {Number} col 
 * @param {Number} direction 
 */
function shiftCol(col, direction) {
    // Copy the column to be shifted
    const shiftedColumn = [];
    for (let i = 0; i < table.length; i++) {
        shiftedColumn.push(table[i][col]);
    }

    // Update the original table with the shifted column
    for (let i = 0; i < table.length; i++) {
        const newRow = (i + direction + table.length) % table.length;
        table[i][col] = shiftedColumn[newRow];
    }
    updateTable();
}

/**
 * Shifts row of table left or right.
 * 
 * @param {Number} row 
 * @param {Number} direction 
 */
function shiftRow(row, direction) {
    const newRow = [];
    for (let i = 0; i < table[row].length; i++) {
        const newIndex = (i + direction + table[row].length) % table[row].length;
        newRow[newIndex] = table[row][i];
    }
    table[row] = newRow;
    updateTable();
}

/**
 * Set row/col shift button event listeners.
 */
for (let i = 0; i < 5; i++) {
    document.getElementById(`row-l${i}`).onclick = () => { shiftRow(i, -1) }
    document.getElementById(`row-r${i}`).onclick = () => { shiftRow(i, 1) }
    document.getElementById(`col-l${i}`).onclick = () => { shiftCol(i, 1) }
    document.getElementById(`col-r${i}`).onclick = () => { shiftCol(i, -1) }
}


// Encryption functions
function fixTable() {
    const keyword = document.getElementById("keyword-input").value.replace(/[^a-zA-Z]/g, "");

    // Construct the initial table with the keyword
    let keywordChars = [];
    for (let i = 0; i < keyword.length; i++) {
        const char = keyword[i].toUpperCase();
        if (!keywordChars.includes(char) && char !== 'J') {
            keywordChars.push(char);
        }
    }

    // Fill the remaining slots with the alphabet
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
        const char = alphabet[i];
        if (!keywordChars.includes(char)) {
            keywordChars.push(char);
        }
    }

    // Construct the 5x5 table
    table.length = 0;
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            row.push(keywordChars[i * 5 + j]);
        }
        table.push(row);
    }
    updateTable();
}

function findChar(char) {
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (table[i][j] === char) {
                return { row: i, col: j };
            }
        }
    }
    return null;
}

function playfairEncrypt() {
    fixTable();

    // Preprocess plaintext: replace non-alphabetic characters with 'X' and convert to uppercase
    let plaintext = document.getElementById("plain-text").value.replace(/[^a-zA-Z]/g, "X").toUpperCase();
    
    // Split plaintext into digraphs
    const digraphs = [];
    for (let i = 0; i < plaintext.length; i += 2) {
        let digraph = plaintext[i];
        if (i + 1 < plaintext.length && plaintext[i] !== plaintext[i + 1]) {
            digraph += plaintext[i + 1];
        } else {
            digraph += 'X';
            i--;
        }
        digraphs.push(digraph);
    }

    // Encrypt each digraph
    let cipherText = '';
    digraphs.forEach(digraph => {
        const char1 = digraph[0];
        const char2 = digraph[1];
        const pos1 = findChar(char1);
        const pos2 = findChar(char2);

        let encryptedDigraph = '';

        // Same row
        if (pos1.row === pos2.row) {
            encryptedDigraph += table[pos1.row][(pos1.col + 1) % table[pos1.row].length];
            encryptedDigraph += table[pos2.row][(pos2.col + 1) % table[pos2.row].length];
        }
        // Same column
        else if (pos1.col === pos2.col) {
            encryptedDigraph += table[(pos1.row + 1) % table.length][pos1.col];
            encryptedDigraph += table[(pos2.row + 1) % table.length][pos2.col];
        }
        // Rectangle rule
        else {
            encryptedDigraph += table[pos1.row][pos2.col];
            encryptedDigraph += table[pos2.row][pos1.col];
        }

        cipherText += encryptedDigraph + " ";
    });

    document.getElementById("cipher-text").value = cipherText;
}
document.getElementById("encrypt-button").onclick = playfairEncrypt;
