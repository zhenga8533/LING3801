const frequency = [
    ['Letter', 'Standard', 'Ciphertext'],
    ['a', 0.082, 0],
    ['b', 0.015, 0],
    ['c', 0.028, 0],
    ['d', 0.043, 0],
    ['e', 0.127, 0],
    ['f', 0.022, 0],
    ['g', 0.02, 0],
    ['h', 0.061, 0],
    ['i', 0.07, 0],
    ['j', 0.0015, 0],
    ['k', 0.0077, 0],
    ['l', 0.04, 0],
    ['m', 0.024, 0],
    ['n', 0.067, 0],
    ['o', 0.075, 0],
    ['p', 0.019, 0],
    ['q', 0.00095, 0],
    ['r', 0.06, 0],
    ['s', 0.063, 0],
    ['t', 0.091, 0],
    ['u', 0.028, 0],
    ['v', 0.0098, 0],
    ['w', 0.024, 0],
    ['x', 0.0015, 0],
    ['y', 0.02, 0],
    ['z', 0.00074, 0]
];  

google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    // Count letter frequency
    const letterFrequency = {};
    const shiftText = document.getElementById("shift-text").value.replace(/[^a-zA-Z]/g, '');
    const count = shiftText.length;
    for (let i in shiftText) {
        letterFrequency[shiftText[i].toLowerCase()] = (letterFrequency[shiftText[i].toLowerCase()] ?? 0) + 1;
    }
    
    const base = 'a'.charCodeAt(0) - 1;
    for (let i = base + 1; i < base + 27; i++) {
        frequency[i - base][2] = letterFrequency[String.fromCharCode(i)] / count;
    }

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