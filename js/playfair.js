const table = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "Y", "Z"]
];

/**
 * Update table HTML 
 */
function updateTable() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            document.getElementById(`pf-${i * 5 + j}`).value = table[i][j];
        }
    }
}

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
    document.getElementById(`row-l${i}`).onclick = () => { shiftRow(i, -1) }
    document.getElementById(`row-r${i}`).onclick = () => { shiftRow(i, 1) }
    document.getElementById(`col-l${i}`).onclick = () => { shiftCol(i, 1) }
    document.getElementById(`col-r${i}`).onclick = () => { shiftCol(i, -1) }
}
