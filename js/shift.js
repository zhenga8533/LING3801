const frequency = [
    ["Letter", "Cipher", "Standard", "Shifted"],
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
 * 
 */
function drawChart() {
    // Count letter frequency
    const shift = parseInt(document.getElementById("shift-input").value);
    const letterFrequency = {};
    const shiftText = document.getElementById("shift-text").value;
    let plainText = "";
    const count = shiftText.length;
    let base = 'a'.charCodeAt(0);
    
    for (let i in shiftText) {
        let c = shiftText[i].toLowerCase();
        if (/^[a-zA-Z]$/.test(c)) {
            letterFrequency[c] = (letterFrequency[c] ?? 0) + 1;
            let shifted = String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
            plainText += shifted;
        } else plainText += c;
    }
    document.getElementById("plain-text").value = plainText;
    
    // Set frequency chart data
    for (let i = base; i < base + 26; i++) {
        let freq = (letterFrequency[String.fromCharCode(i)] ?? 0) / count;
        let index = i - base + 1;
        frequency[index][1] = freq;
        index = (index + shift - 1) % 26 + 1;
        frequency[index][3] = shift === 0 ? 0 : freq;
    }

    // Update column chart
    var data = google.visualization.arrayToDataTable(frequency);
    var options = {
        chart: {
            title: 'Frequency Graph'
        }
    };
    var chart = new google.charts.Bar(document.getElementById('columnchart'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}
document.getElementById("shift-button").onclick = drawChart;

function leftShift() {
    document.getElementById("shift-input").value--;
    drawChart();
}
document.getElementById("left-shift").onclick = leftShift;

function rightShift() {
    document.getElementById("shift-input").value++;
    drawChart();
}
document.getElementById("right-shift").onclick = rightShift;
