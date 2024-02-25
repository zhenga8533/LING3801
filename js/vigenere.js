// Load Google-Chart functions
google.charts.load('current', {'packages':['bar']});
let divs = 0;

/**
 * Find any repeating substrings in cipher text. 
 * 
 * @param {String} cipherText - Cipher text to find repeats from.
 * @returns {Object} {"substring": {"frequency": int, "distance": int[]}}
 */
function findRepeats(cipherText) {
    const repeats = {};
    cipherText = cipherText.replace(/[^a-zA-Z]/g, '');
    const n = cipherText.length;
    
    for (let i = 0; i < n - 6; i++) {
        for (let j = i + 3; j < n; j++) {
            // Check if valid repeat
            let sub = "";
            let k = 0;
            while (j + k < n && cipherText[i + k] == cipherText[j + k] && sub.length < 7) sub += cipherText[i + (k++)];

            // Update frequency
            if (sub.length > 2) {
                if (sub in repeats) {
                    repeats[sub]["frequency"]++;
                    repeats[sub]["distance"].push(j - i);
                } else {
                    repeats[sub] = {
                        "frequency": 1,
                        "distance": [j - i]
                    }
                }
                i += k - 1;
            }
        }
    }
    
    return repeats;
}

/**
 * Sort repeats object by frequency.
 * 
 * @param {Object} repeats - {"substring": {"frequency": int, "distance": int[]}}
 * @returns {Object} repeats sorted by frequency
 */
function sortRepeats(repeats) {
    return Object.entries(repeats)
        .sort((a, b) => b[1].frequency - a[1].frequency)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

/**
 * Updates the keyword and table based on current chart eleements.
 */
function updateKey() {
    let key = "";
    let keyTable = `<thead> <th></th>
        <th>a</th> <th>b</th> <th>c</th> <th>d</th> <th>e</th> <th>f</th> <th>g</th> <th>h</th> <th>i</th> <th>j</th> <th>k</th> <th>l</th> <th>m</th> 
        <th>n</th> <th>o</th> <th>p</th> <th>q</th> <th>r</th> <th>s</th> <th>t</th> <th>u</th> <th>v</th> <th>w</th> <th>x</th> <th>y</th> <th>z</th>
    </thead> <tbody>`;

    // Update keyword and HTML key table element
    for (let i = 0; i < divs; i++) {
        let shiftValue = parseInt(document.getElementById(`shift-${i}`).innerText, 10);
        let c = String.fromCharCode((26 - shiftValue) % 26 + 65);
        key += c

        let index = key.charCodeAt(i) - 65;
        keyTable += `<tr> <th>${c}</th>`;
        for (let j = 0; j < 26; j++) {
            let charCode = (j + index) % 26 + 65;
            keyTable += `<td>${String.fromCharCode(charCode)}</td>`;
        }
        keyTable += "</tr>";
    }

    document.getElementById("key").innerText = key;
    document.getElementById("key-table").innerHTML = keyTable + "</tbody>";
}


/**
 * Update google column chart.
 * 
 * @param {String} graphName - Graph ID to update.
 * @param {Type[]} frequency - [[str, int, int, int]]
 */
function drawChart(graphName, frequency) {
    const data = google.visualization.arrayToDataTable(frequency);
    const options = {
        chart: {
            title: 'Frequency Graph'
        }
    };
    const chart = new google.charts.Bar(document.getElementById(graphName));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

/**
 * Count frequency of each id x index of cipher text.
 * 
 * @param {Number} id - ID of the shift number and column chart.
 */
function updateChart(id) {
    // Load frequency into chart data
    const text = document.getElementById("cipher-text").value.replace(/[^a-zA-Z]/g, '');
    const n = text.length;

    let frequency = [
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

    // Count letter frequency
    let letterFrequency = {};
    for (let j = 0; j < n / divs; j++) {
        if (j * divs + id >= n) break;
        let c = text[j * divs + id].toLowerCase();
        letterFrequency[c] = (letterFrequency[c] ?? 0) + 1;
    }

    // Update frequency column chart
    const base = "a".charCodeAt(0);
    let shift = parseInt(document.getElementById(`shift-${id}`).innerText);
    for (let j = base; j < base + 26; j++) {
        let freq = (letterFrequency[String.fromCharCode(j)]) / (n / divs);
        let index = j - base + 1;
        frequency[index][1] = freq;
        index = (index + shift - 1) % 26 + 1;
        frequency[index][3] = freq;
    }
    drawChart(`chart-${id}`, frequency);

    // Update HTML elements
    updateKey();
    decryptVigenere();
}

/**
 * Update charts when user presses on key length.
 * 
 * @param {Number} count - Length of suspected key.
 */
function updateCharts(count) {
    // Set charts HTML
    divs = count;
    document.getElementById("charts").innerHTML = "";
    for (let i = 0; i < divs; i++) {
        document.getElementById("charts").innerHTML += `<div id="chart-${i}" class="column-chart"></div>
        <div class="chart-nav">
            <button id="left-${i}" class="button">Shift Left</button>
            <p id="shift-${i}" class="shift-value">0</p>
            <button id="right-${i}" class="button">Shift Right</button>
        </div>`;
    }

    // Update each chart and their shift button listeners.
    for (let i = 0; i < divs; i++) {
        updateChart(i);
        document.getElementById(`left-${i}`).onclick = () => {
            const shift = document.getElementById(`shift-${i}`);
            shift.innerHTML = (parseInt(shift.innerHTML) + 25) % 26;
            updateChart(i);
        }
        document.getElementById(`right-${i}`).onclick = () => {
            const shift = document.getElementById(`shift-${i}`);
            shift.innerHTML = (parseInt(shift.innerHTML) + 1) % 26;
            updateChart(i);
        }
    }
}

/**
 * Update table HTML using substring frequency of cipher text.
 */
function updateTable() {
    // Find repeating substrings in cipher text.
    const cipehrText = document.getElementById("cipher-text").value;

    // Update table HTML
    const length = document.getElementById("factor-input").value;
    const table = document.getElementById("repeat-table");

    // Update table header
    let header = "<tr><th>Sequence</th><th>Freq</th>";
    for (let i = 0; i < length - 1; i++) {
        header += `<th><a class="update-btn button" href="#charts">${i + 2}</a></th>`;
    }
    table.innerHTML = header + "</tr>";

    // Update table body and count total factor occurences
    const factors = {};
    for (let i = 2; i <= length; i++) factors[i] = 0;
    let totalRepeats = 0;

    const repeats = sortRepeats(findRepeats(cipehrText));
    let tableBody = "";
    for (let repeat in repeats) {
        let row = `<tr><td>${repeat}</td><td>${repeats[repeat].frequency}</td>`;
        for (let i = 2; i <= length; i++) {
            if (repeats[repeat].distance.find(dist => Number.isInteger(dist / i))) {
                row += "<td>X</td>";
                factors[i]++;
            } else row += "<td></td>";
        }

        totalRepeats += repeats[repeat].frequency;
        tableBody += row + "</tr>";
    }

    // Finish updating table with total counts
    let counter = `<tr><td>Total:</td><td>${totalRepeats}</td>`;
    for (let factor in factors) {
        counter += `<td>${factors[factor]}</td>`;
    }
    table.innerHTML += `${counter}</tr> ${tableBody}`;

    // Add event listeners to the buttons
    const buttons = document.querySelectorAll('.update-btn');
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            updateCharts(button.textContent);
        })
    });
}
updateTable();
document.getElementById("analyze-button").onclick = updateTable;

/**
 * Encrypts plain text using inputted key.
 */
function encryptVigenere() {
    const key = document.getElementById("encrypt-key").value.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const plainText = document.getElementById("plain-text").value.toLowerCase();
    let base = "a".charCodeAt(0);

    // Set shifts based on key
    const shifts = [];
    for (let c of key) {
        shifts.push(c.charCodeAt(0) - base);
    }

    // Encode into cipher text
    let i = 0;
    let cipherText = "";
    for (let c of plainText) {
        if (/^[a-zA-Z0-9]+$/.test(c)) {
            let shift = shifts[i++ % key.length];
            cipherText += String.fromCharCode((c.toLowerCase().charCodeAt(0) - base + shift) % 26 + base).toUpperCase();
        } else cipherText += c;
    }
    document.getElementById("cipher-text").value = cipherText;
}
document.getElementById("encrypt-button").onclick = encryptVigenere;

/**
 * Shift cipher text into plain text using provided shift values.
 */
function decryptVigenere() {
    const cipherText = document.getElementById("cipher-text").value;
    const shifts = [];
    let plain = "";

    // Collect shift values
    for (let i = 0; i < divs; i++) {
        shifts.push(parseInt(document.getElementById(`shift-${i}`).innerText));
    }

    // Shift plain text
    let i = 0;
    let base = "a".charCodeAt(0);
    for (let c of cipherText) {
        if (/^[a-zA-Z0-9]+$/.test(c)) {
            let shift = shifts[i++ % divs];
            plain += String.fromCharCode((c.toLowerCase().charCodeAt(0) - base + shift) % 26 + base);
        } else plain += c;
    }
    document.getElementById("plain-text").value = plain;
}
document.getElementById("decrypt-button").onclick = decryptVigenere;
