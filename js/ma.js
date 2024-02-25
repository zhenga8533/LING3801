const frequency = [
    ["Letter", "Plain", "Standard", "Cipher"],
    ['a', 0, 0.082, 0],
    ['b', 0, 0.015, 0],
    ['c', 0, 0.028, 0],
    ['d', 0, 0.043, 0],
    ['e', 0, 0.127, 0],
    ['f', 0, 0.022, 0],
    ['g', 0, 0.02, 0],
    ['h', 0, 0.061, 0],
    ['i', 0, 0.07, 0],
    ['j', 0, 0.0015, 0],
    ['k', 0, 0.0077, 0],
    ['l', 0, 0.04, 0],
    ['m', 0, 0.024, 0],
    ['n', 0, 0.067, 0],
    ['o', 0, 0.075, 0],
    ['p', 0, 0.019, 0],
    ['q', 0, 0.00095, 0],
    ['r', 0, 0.06, 0],
    ['s', 0, 0.063, 0],
    ['t', 0, 0.091, 0],
    ['u', 0, 0.028, 0],
    ['v', 0, 0.0098, 0],
    ['w', 0, 0.024, 0],
    ['x', 0, 0.0015, 0],
    ['y', 0, 0.02, 0],
    ['z', 0, 0.00074, 0]
];

// Load Google-Chart functions
google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawChart);

/**
 * Update google bar chart.
 */
function drawChart() {
    const data = google.visualization.arrayToDataTable(frequency);
    const options = {
        chart: {
            title: 'Frequency Graph'
        }
    };
    const chart = new google.charts.Bar(document.getElementById('columnchart'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

/**
 * Encrypt plain text by shifting.
 */
function encryptMA() {
    // Count letter frequency
    const plainText = document.getElementById("plain-text").value;

    // Update column chart
    drawChart();
}
document.getElementById("encrypt-button").onclick = encryptMA;

/**
 * Decrypt cipher text by shifting.
 */
function decryptMA() {
    // Count letter frequency
    const letterFrequency = {};

    // Update column chart
    drawChart();
}
document.getElementById("decrypt-button").onclick = decryptMA;

/**
 * Analyzes
 */
function analyzeCipher() {
    const cipherText = document.getElementById("cipher-text").value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const n = cipherText.length;

    // Count the frequency of each bigram
    const bigramFreq = {};
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
    
    // Count the frequency of each trigram
    const trigramFreq = {};
    for (let i = 0; i < n - 1; i += 3) {
        const trigram = cipherText.slice(i, i + 3);
        trigramFreq[trigram] = (trigramFreq[trigram] ?? 0) + 1;
    }

    // Update trigram table
    let trigramTable = "<tr><th>Cipher</th><th>Count</th><th>Frequency (%)</th></tr>\n";
    const sortedTrigrams = Object.keys(trigramFreq).sort((a, b) => trigramFreq[b] - trigramFreq[a]);

    // Format each trigram and its frequency into the table
    sortedTrigrams.forEach(trigram => {
        const freq = trigramFreq[trigram];
        trigramTable += `<tr><td>${trigram}</td><td>${freq}</td><td>${Math.round(freq / n * 30_000) / 100}%</td></tr>\n`;
    });
    document.getElementById("trigram-freq").innerHTML = trigramTable;
}
document.getElementById("analyze-button").onclick = analyzeCipher;
analyzeCipher();
