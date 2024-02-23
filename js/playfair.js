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

    // Preprocess plainText: replace non-alphabetic characters with 'X' and convert to uppercase
    let plainText = document.getElementById("plain-text").value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    
    // Split plainText into digraphs
    const digraphs = [];
    for (let i = 0; i < plainText.length; i += 2) {
        let digraph = plainText[i];
        if (i + 1 < plainText.length && plainText[i] !== plainText[i + 1]) {
            digraph += plainText[i + 1];
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


// Decryption functions
function setTable() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let c = document.getElementById(`pf-${i * 5 + j}`).value;
            table[i][j] = c === "" ? "-" : c;
        }
    }
}

function findDigraph(char1, char2) {
    const pos1 = findChar(char1);
    const pos2 = findChar(char2);

    // If either position is not found, return '--'
    if (!pos1 || !pos2) {
        return ['-', '-'];
    }

    // Same row
    if (pos1.row === pos2.row) {
        return [
            table[pos1.row][(pos1.col - 1 + table[pos1.row].length) % table[pos1.row].length],
            table[pos2.row][(pos2.col - 1 + table[pos2.row].length) % table[pos2.row].length]
        ];
    }
    // Same column
    else if (pos1.col === pos2.col) {
        return [
            table[(pos1.row - 1 + table.length) % table.length][pos1.col],
            table[(pos2.row - 1 + table.length) % table.length][pos2.col]
        ];
    }
    // Rectangle rule
    else {
        return [
            table[pos1.row][pos2.col],
            table[pos2.row][pos1.col]
        ];
    }
}

function playfairDecrypt() {
    setTable();
    const cipherText = document.getElementById("cipher-text").value.replace(/[^a-zA-Z]/g, "").toUpperCase();

    // Split cipherText into digraphs
    const digraphs = [];
    for (let i = 0; i < cipherText.length; i += 2) {
        digraphs.push([cipherText[i], cipherText[i + 1]]);
    }

    // Decrypt each digraph
    let plainText = '';
    digraphs.forEach(digraph => {
        const decryptedDigraph = findDigraph(digraph[0], digraph[1]);
        plainText += decryptedDigraph[0].toLowerCase() + decryptedDigraph[1].toLowerCase() + " ";
    });

    document.getElementById("plain-text").value = plainText;
}
document.getElementById("decrypt-button").onclick = playfairDecrypt;


// Bigram frequency functions
function countBigramFrequency() {
    const bigramFreq = {};
    const cipherText = document.getElementById("cipher-text").value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const n = cipherText.length;

    // Count the frequency of each bigram
    for (let i = 0; i < n - 1; i += 2) {
        const bigram = cipherText.slice(i, i + 2);
        bigramFreq[bigram] = (bigramFreq[bigram] ?? 0) + 1;
    }

    // Update bigram table
    let bigramTable = "<tr><th>Bigram</th><th>Count</th><th>Frequency (%)</th></tr>\n";
    const sortedBigrams = Object.keys(bigramFreq).sort((a, b) => bigramFreq[b] - bigramFreq[a]);

    // Format each bigram and its frequency into the table
    sortedBigrams.forEach(bigram => {
        const freq = bigramFreq[bigram];
        bigramTable += `<tr><td>${bigram}</td><td>${freq}</td><td>${Math.round(freq / n * 20_000) / 100}%</td></tr>\n`;
    });
    document.getElementById("bigram-freq").innerHTML = bigramTable;
}
document.getElementById("analyze-button").onclick = countBigramFrequency;
countBigramFrequency();
