/**
 * 
 */
function updateTable() {
    // Count letter frequency
    const h = Math.abs(parseInt(document.getElementById("shift-input").value));
    if (h === 0) return;
    const railFence = [];
    for (let i = 0; i < h; i++) railFence.push([]);
    const str = document.getElementById("cipher-text").value;
    let plainText = "";

    let index = h - 1;
    let direction = -1;

    // Iterate through the string and fill the rail fence array
    for (let char of str) {
        railFence[index].push(char);
        // Update the index and direction
        if (index === 0) {
            direction = 1;
            if (char != str[0]) railFence[index].push(" ");
        } else if (index === h - 1) {
            direction = -1;
            if (char != str[0]) railFence[index].push(" ");
        }
        index += direction;
    }

    // Set plainText
    for (let i = 0; i < h; i++) {
        let row = railFence[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] !== " ") plainText += row[j];
        }
        plainText += " ";
    }
    document.getElementById("plain-text").value = plainText;
}
document.getElementById("build-button").onclick = updateTable;
