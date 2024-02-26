const frequency = [
    ["Letter", "Plain", "Standard", "Cipher"],
    ["a", 0, 0.082, 0],
    ["b", 0, 0.015, 0],
    ["c", 0, 0.028, 0],
    ["d", 0, 0.043, 0],
    ["e", 0, 0.127, 0],
    ["f", 0, 0.022, 0],
    ["g", 0, 0.02, 0],
    ["h", 0, 0.061, 0],
    ["i", 0, 0.07, 0],
    ["j", 0, 0.0015, 0],
    ["k", 0, 0.0077, 0],
    ["l", 0, 0.04, 0],
    ["m", 0, 0.024, 0],
    ["n", 0, 0.067, 0],
    ["o", 0, 0.075, 0],
    ["p", 0, 0.019, 0],
    ["q", 0, 0.00095, 0],
    ["r", 0, 0.06, 0],
    ["s", 0, 0.063, 0],
    ["t", 0, 0.091, 0],
    ["u", 0, 0.028, 0],
    ["v", 0, 0.0098, 0],
    ["w", 0, 0.024, 0],
    ["x", 0, 0.0015, 0],
    ["y", 0, 0.02, 0],
    ["z", 0, 0.00074, 0]
];

// Load Google-Chart functions
google.charts.load("current", {"packages":["bar"]});
google.charts.setOnLoadCallback(analyzeText);

/**
 * Update google bar chart.
 */
function drawChart() {
    const data = google.visualization.arrayToDataTable(frequency);
    const options = {
        chart: {
            title: "Frequency Graph"
        }
    };
    const chart = new google.charts.Bar(document.getElementById("columnchart"));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

/**
 * Reverses table to be used in decryption.
 * 
 * @param {Object} table - Current table element.
 * @returns {Object} Reveresed dictionary.
 */
function reverseTable(table) {
    const reversed = {};
    for (const key in table) {
        const value = table[key];
        reversed[value] = key;
    }
    return reversed;
}

/**
 * Initializes the table with the key and fills in the rest in alphabetical order of non-used letters.
 * 
 * @param {String} key - Key word/phrase to use to set the table.
 */
function setTable(key) {
    if (!key.length) return;
    
    key = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
    key = [...new Set(key.split(""))].join("");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let availableLetters = alphabet.split("").filter(letter => !key.includes(letter));

    key.split("").forEach((letter, index) => {
        document.getElementById(`ma-${index}`).value = letter;
    });

    availableLetters.forEach((letter, index) => {
        document.getElementById(`ma-${key.length + index}`).value = letter;
    });
}

/**
 * Parses HTML table into a dictionary for use in decryption/encryption.
 * 
 * @returns {Object} - Dictionary replication of table.
 */
function getTable() {
    const table = {};

    let base = "a".charCodeAt(0);
    for (let i = 0; i < 26; i++) {
        table[String.fromCharCode(base + i)] = document.getElementById(`ma-${i}`).value.toUpperCase();
    }

    return table;
}

/**
 * Encrypts plain text by applying key/table.
 */
function encryptMA() {
    // Count letter frequency
    const plainText = document.getElementById("plain-text").value.replace(/[^a-zA-Z]/g, "").toLowerCase();
    setTable(document.getElementById("encrypt-key").value);
    const table = getTable();

    // Convert plain into cipher based on table
    let cipherText = "";
    for (let i in plainText) {
        let c = table[plainText[i]];
        cipherText += c === "" ? "-" : c;
        if (i % 5 == 4) cipherText += " ";
    }

    // Update HTML elements
    document.getElementById("cipher-text").value = cipherText;
    analyzeText();
}
document.getElementById("encrypt-button").onclick = encryptMA;

/**
 * Decrypts cipher text by applying key/table.
 */
function decryptMA() {
    // Count letter frequency
    const cipherText = document.getElementById("cipher-text").value.toUpperCase();
    setTable(document.getElementById("decrypt-key").value);
    const table = reverseTable(getTable());

    // Convert plain into cipher based on table
    let plainText = "";
    for (let c of cipherText) {
        if (/^[A-Z]$/.test(c)) {
            plainText += table[c] ?? "-";
        } else {
            plainText += c;
        }
    }
    
    // Update HTML elements
    document.getElementById("plain-text").value = plainText;
    analyzeText();
}
document.getElementById("decrypt-button").onclick = decryptMA;

/**
 * Analyzes both cipher and plain text to determine letter, bigram, and trigram frequencies to update chart and table elements.
 */
function analyzeText() {
    const cipherText = document.getElementById("cipher-text").value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const plainText = document.getElementById("plain-text").value.replace(/[^a-zA-Z]/g, "").toLowerCase();

    // Count the frequency of each letter
    const upperFreq = {};
    for (let c of cipherText) {
        upperFreq[c] = (upperFreq[c] ?? 0) + 1;
    }

    const lowerFreq = {};
    for (let c of plainText) {
        lowerFreq[c] = (lowerFreq[c] ?? 0) + 1;
    }
    
    // Update frequency graph
    const capitalBase = "A".charCodeAt(0);
    const lowerBase = "a".charCodeAt(0);
    for (let i = 0; i < 26; i++) {
        frequency[i + 1][1] = (lowerFreq[String.fromCharCode(lowerBase + i)] ?? 0) / (plainText.length || 1);
        frequency[i + 1][3] = (upperFreq[String.fromCharCode(capitalBase + i)] ?? 0) / (cipherText.length || 1);
    }
    drawChart();


    // Count the frequency of each bigram
    const n = cipherText.length;
    const bigramFreq = {};
    for (let i = 0; i < n - 2; i++) {
        const bigram = cipherText.slice(i, i + 2);
        bigramFreq[bigram] = (bigramFreq[bigram] ?? 0) + 1;
    }

    // Update bigram table
    let bigramTable = "<tr><th>Cipher</th><th>Count</th><th>Frequency (%)</th></tr>\n";
    const sortedBigrams = Object.keys(bigramFreq).sort((a, b) => bigramFreq[b] - bigramFreq[a]);
    const processedBigrams = {};

    // Format each bigram and its frequency into the table
    sortedBigrams.forEach(bigram => {
        if (!processedBigrams[bigram]) {
            const freq = bigramFreq[bigram];
            const oppositeBigram = bigram[1] + bigram[0];
            const oppositeFreq = bigramFreq[oppositeBigram] || 0;

            // Add row for the bigram
            bigramTable += `<tr><td>${bigram}</td><td>${freq}</td><td>${Math.round(freq / n * 10_000) / 100}%</td></tr>\n`;
            processedBigrams[bigram] = true;

            // Add row for the opposite bigram if it exists and mark it as processed
            if (oppositeFreq > 0) {
                bigramTable += `<tr><td>${oppositeBigram}</td><td>${oppositeFreq}</td><td>${Math.round(oppositeFreq / n * 10_000) / 100}%</td></tr>\n`;
                processedBigrams[oppositeBigram] = true;
            }
        }
    });
    document.getElementById("bigram-freq").innerHTML = bigramTable;
    

    // Count the frequency of each trigram
    const trigramFreq = {};
    for (let i = 0; i < n - 3; i++) {
        const trigram = cipherText.slice(i, i + 3);
        trigramFreq[trigram] = (trigramFreq[trigram] ?? 0) + 1;
    }

    // Update trigram table
    let trigramTable = "<tr><th>Cipher</th><th>Count</th><th>Frequency (%)</th></tr>\n";
    const sortedTrigrams = Object.keys(trigramFreq).sort((a, b) => trigramFreq[b] - trigramFreq[a]);

    // Format each trigram and its frequency into the table
    sortedTrigrams.forEach(trigram => {
        const freq = trigramFreq[trigram];
        if (freq > 1) {
            trigramTable += `<tr><td>${trigram}</td><td>${freq}</td><td>${Math.round(freq / n * 10_000) / 100}%</td></tr>\n`;
        }
    });
    document.getElementById("trigram-freq").innerHTML = trigramTable;
}
document.getElementById("analyze-button").onclick = analyzeText;
