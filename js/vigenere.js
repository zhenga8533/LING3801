// Load Google-Chart functions
google.charts.load('current', {'packages':['bar']});

function findRepeats(str) {
    const repeats = {};
    str = str.replace(/[^a-zA-Z]/g, '');
    const n = str.length;
    
    for (let i = 0; i < n - 6; i++) {
        for (let j = i + 3; j < n; j++) {
            // Check if valid repeat
            let sub = "";
            let k = 0;
            while (j + k < n && str[i + k] == str[j + k] && sub.length < 7) sub += str[i + (k++)];

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

function sortRepeats(dictionary) {
    return Object.entries(dictionary)
        .sort((a, b) => b[1].frequency - a[1].frequency)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

/**
 * 
 * @param {String} graphName 
 */
function drawChart(graphName, frequency) {
    var data = google.visualization.arrayToDataTable(frequency);
    var options = {
        chart: {
            title: 'Frequency Graph'
        }
    };
    var chart = new google.charts.Bar(document.getElementById(graphName));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function updateCharts(count) {
    document.getElementById("charts").innerHTML = "";

    for (let i = 0; i < count; i++) {
        document.getElementById("charts").innerHTML += `<div id="chart-${i}" class="column-chart"></div>
        <div class="chart-nav">
            <button id="left-shift">Shift Left</button>
            <p id="shift-label">0</p>
            <button id="right-shift">Shift Right</button>
        </div>`;
    }

    for (let i = 0; i < count; i++) {
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
        drawChart("chart-" + i, frequency)
    }
}

/**
 * 
 * @param {*} length 
 */
function updateTable() {
    // Find repeating substrings in cipher text.
    const cipehrText = document.getElementById("cipher-text").value;

    // Update table HTML
    const length = document.getElementById("decrypt-input").value;
    const table = document.getElementById('repeat-table');

    // Update table header
    let header = "<tr><th>Sequence</th><th>Freq</th>";
    for (let i = 0; i < length - 1; i++) {
        header += `<th><button class="update-btn">${i + 2}</button></th>`;
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
updateTable(20);
document.getElementById("decipher-button").onclick = updateTable;