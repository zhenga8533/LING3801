let length = 18;

// Load Google-Chart functions
google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(updateTable);

/**
 * Update google bar chart.
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

function updateTable() {
    const table = document.getElementById('repeat-table');

    let header = "<tr><th>Sequence</th><th>Spacing</th>";
    for (let i = 0; i < length; i++) {
        header += `<th><button>${i + 3}</button></th>`;
    }
    table.innerHTML = header + "</tr>";
}
updateTable();