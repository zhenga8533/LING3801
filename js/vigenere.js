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
function drawChart(graphName) {
    const data = google.visualization.arrayToDataTable(frequency);
    const options = {
        chart: {
            title: 'Frequency Graph'
        }
    };
    const chart = new google.charts.Bar(document.getElementById(graphName));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function updateCharts() {

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

    // Add event listeners to the buttons
    const buttons = document.querySelectorAll('.update-btn');
    buttons.forEach(button => button.onclick = updateCharts);

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
}
updateTable(20);
document.getElementById("decipher-button").onclick = updateTable;