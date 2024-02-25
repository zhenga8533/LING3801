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
google.charts.setOnLoadCallback(decryptMA);

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
    const shift = ((parseInt(document.getElementById("plain-shift").value) % 26) + 26) % 26;
    const letterFrequency = {};
    const plainText = document.getElementById("plain-text").value;
    let shiftText = "";
    const count = plainText.length;
    let base = 'a'.charCodeAt(0);

    // Update shift label
    document.getElementById("cipher-shift").value = (26 - shift) % 26;
    
    // Count letter frequency
    for (let i in plainText) {
        let c = plainText[i].toLowerCase();
        if (/^[a-zA-Z]$/.test(c)) {
            letterFrequency[c] = (letterFrequency[c] ?? 0) + 1;
            let shifted = String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
            shiftText += shifted.toUpperCase();
        } else shiftText += c;
    }
    document.getElementById("shift-text").value = shiftText;
    
    // Set frequency chart data
    for (let i = base; i < base + 26; i++) {
        let freq = (letterFrequency[String.fromCharCode(i)] ?? 0) / count;
        let index = i - base + 1;
        frequency[index][1] = freq;
        index = (index + shift - 1) % 26 + 1;
        frequency[index][3] = freq;
    }

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
