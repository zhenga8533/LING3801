let table = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "K"],
    ["L", "M", "N", "O", "P"],
    ["Q", "R", "S", "T", "U"],
    ["V", "W", "X", "Y", "Z"]
];
let lastSave = table.map(row => row.slice());
let rowSwap = [];
let colSwap = [];

/**
 * Set correct events for all table inputs. Verifies correct inputs and table.
 */
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        let tableInput = document.getElementById(`pf-${i * 5 + j}`);
        tableInput.onkeydown = () => /[a-z]/i.test(event.key);
        tableInput.addEventListener("input", (event) => {
            tableInput.value = tableInput.value.toUpperCase();
            setTable();

            // Verify table is valid
            const id = tableInput.id;
            const index = parseInt(id.split("-")[1]);
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let k = i * 5 + j;
                    if (k != index && tableInput.value == document.getElementById(`pf-${k}`).value) {
                        table[i][j] = "-";
                    }
                }
            }

            updateTable();
        });
    }

    // Set playfair table swapping
    let rowElement = document.getElementById(`row-${i + 1}`);
    rowElement.onclick = () => {
        const index = rowSwap.indexOf(i);
        if (index !== -1) {
            rowSwap.splice(index, 1);
            rowElement.classList.toggle("selected");
        } else {
            rowSwap.push(i);

            // Swap if two rows selected
            if (rowSwap.length === 2) {
                let temp = table[rowSwap[0]];
                table[rowSwap[0]] = table[rowSwap[1]];
                table[rowSwap[1]] = temp;

                updateTable();
                document.getElementById(`row-${rowSwap[0] + 1}`).classList.toggle("selected");
                rowSwap = [];
            } else rowElement.classList.toggle("selected");
        }
    }
    let colElement = document.getElementById(`col-${i + 1}`);
    colElement.onclick = () => {
        const index = colSwap.indexOf(i);
        if (index !== -1) {
            colSwap.splice(index, 1);
            colElement.classList.toggle("selected");
        } else {
            colSwap.push(i);

            // Swap if two columns selected
            if (colSwap.length === 2) {
                for (let row = 0; row < table.length; row++) {
                    let temp = table[row][colSwap[0]];
                    table[row][colSwap[0]] = table[row][colSwap[1]];
                    table[row][colSwap[1]] = temp;
                }

                updateTable();
                document.getElementById(`col-${colSwap[0] + 1}`).classList.toggle("selected");
                colSwap = [];
            } else colElement.classList.toggle("selected");
        }
    }
}

/**
 * 
 */
function setTable() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let c = document.getElementById(`pf-${i * 5 + j}`).value;
            table[i][j] = c === "" ? "-" : c;
        }
    }
}

/**
 * Update table HTML 
 */
function updateTable() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let c = table[i][j];
            document.getElementById(`pf-${i * 5 + j}`).value = c === "-" ? "" : c;
        }
    }
}

/**
 * Clears table and HTML table.
 */
function clearTable() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            document.getElementById(`pf-${i * 5 + j}`).value = "";
            table[i][j] = "-";
        }
    }
}
document.getElementById("clear-table").onclick = clearTable;

/**
 * Set load/save buttons
 */
document.getElementById("save-btn").onclick = () => {
    setTable();
    lastSave = table.map(row => row.slice());
}
document.getElementById("load-btn").onclick = () => {
    table = lastSave.map(row => row.slice());
    updateTable();
}

/**
 * 
 * @param {Number} direction 
 * @returns 
 */
function shiftRows(direction) {
    const numRows = table.length;
    
    if (direction === 1) {
        const lastRow = table[numRows - 1];
        for (let i = numRows - 1; i > 0; i--) {
            table[i] = table[i - 1];
        }
        table[0] = lastRow;
    } else if (direction === -1) {
        const firstRow = table[0];
        for (let i = 0; i < numRows - 1; i++) {
            table[i] = table[i + 1];
        }
        table[numRows - 1] = firstRow;
    }
    updateTable();
}
document.getElementById("row-up").onclick = () => { shiftRows(-1) }
document.getElementById("row-down").onclick = () => { shiftRows(1) }

/**
 * 
 * @param {Number} direction 
 * @returns 
 */
function shiftColumns(direction) {
    const numRows = table.length;
    const numCols = table[0].length;
    
    if (direction === 1) {
        for (let i = 0; i < numRows; i++) {
            const lastElement = table[i][numCols - 1];
            for (let j = numCols - 1; j > 0; j--) {
                table[i][j] = table[i][j - 1];
            }
            table[i][0] = lastElement;
        }
    } else if (direction === -1) {
        for (let i = 0; i < numRows; i++) {
            const firstElement = table[i][0];
            for (let j = 0; j < numCols - 1; j++) {
                table[i][j] = table[i][j + 1];
            }
            table[i][numCols - 1] = firstElement;
        }
    }
    updateTable();
}
document.getElementById("col-left").onclick = () => { shiftColumns(-1) }
document.getElementById("col-right").onclick = () => { shiftColumns(1) }

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
    document.getElementById(`row-l${i}`).addEventListener('click', function(event) {
        event.stopPropagation();
        shiftRow(i, -1);
    });
    document.getElementById(`row-r${i}`).addEventListener('click', function(event) {
        event.stopPropagation();
        shiftRow(i, 1);
    });
    document.getElementById(`col-l${i}`).addEventListener('click', function(event) {
        event.stopPropagation();
        shiftCol(i, 1);
    });
    document.getElementById(`col-r${i}`).addEventListener('click', function(event) {
        event.stopPropagation();
        shiftCol(i, -1);
    });
}

/**
 * 
 * @param {*} direction 
 */
function rotateTable(direction) {
    const n = table.length;
    for (let layer = 0; layer < n / 2; layer++) {
        const first = layer;
        const last = n - 1 - layer;
        for (let i = first; i < last; i++) {
            const offset = i - first;
            const top = table[first][i];

            if (direction === 1) { // Clockwise rotation
                table[first][i] = table[last - offset][first];
                table[last - offset][first] = table[last][last - offset];
                table[last][last - offset] = table[i][last];
                table[i][last] = top;
            } else if (direction === -1) { // Counterclockwise rotation
                table[first][i] = table[i][last];
                table[i][last] = table[last][last - offset];
                table[last][last - offset] = table[last - offset][first];
                table[last - offset][first] = top;
            }
        }
    }
    updateTable();
}
document.getElementById("rotate-cw").onclick = () => { rotateTable(1) }
document.getElementById("rotate-ccw").onclick = () => { rotateTable(-1) }


// Encryption functions
function fixTable(keyType) {
    const key = document.getElementById(keyType).value.replace(/[^a-zA-Z]/g, "");
    if (key === "") return;

    // Construct the initial table with the key
    let keyChars = [];
    for (let i = 0; i < key.length; i++) {
        const char = key[i].toUpperCase();
        if (!keyChars.includes(char) && char !== 'J') {
            keyChars.push(char);
        }
    }

    // Fill the remaining slots with the alphabet
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
        const char = alphabet[i];
        if (!keyChars.includes(char)) {
            keyChars.push(char);
        }
    }

    // Construct the 5x5 table
    table.length = 0;
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            row.push(keyChars[i * 5 + j]);
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
    fixTable("encrypt-key");

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

        // Not found
        if (pos1 === null || pos2 === null) {
            encryptedDigraph += "--";
        }
        // Same row
        else if (pos1.row === pos2.row) {
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
    fixTable("decrypt-key");
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
    let bigramTable = "<tr><th>Cipher</th><th>Count</th><th>Frequency (%)</th></tr>\n";
    const sortedBigrams = Object.keys(bigramFreq).sort((a, b) => bigramFreq[b] - bigramFreq[a]);
    const processedBigrams = {}; // To keep track of processed bigrams

    // Format each bigram and its frequency into the table
    sortedBigrams.forEach(bigram => {
        if (!processedBigrams[bigram]) {
            const freq = bigramFreq[bigram];
            const oppositeBigram = bigram[1] + bigram[0]; // Create the opposite bigram
            const oppositeFreq = bigramFreq[oppositeBigram] || 0; // Frequency of the opposite bigram

            // Add row for the bigram
            bigramTable += `<tr><td>${bigram}</td><td>${freq}</td><td>${Math.round(freq / n * 20_000) / 100}%</td></tr>\n`;
            processedBigrams[bigram] = true;

            // Add row for the opposite bigram if it exists and mark it as processed
            if (oppositeFreq > 0) {
                bigramTable += `<tr><td>${oppositeBigram}</td><td>${oppositeFreq}</td><td>${Math.round(oppositeFreq / n * 20_000) / 100}%</td></tr>\n`;
                processedBigrams[oppositeBigram] = true;
            }
        }
    });
    document.getElementById("bigram-freq").innerHTML = bigramTable;
}

document.getElementById("analyze-button").onclick = countBigramFrequency;
countBigramFrequency();
