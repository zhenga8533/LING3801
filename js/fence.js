function createHtmlTableFromArray(array) {
    let table = '<table border="1">';
    for (let i = 0; i < array.length; i++) {
        table += '<tr>';
        for (let j = 0; j < array[i].length; j++) {
            if (/[^A-Za-z]/g.test(array[i][j])) {
                table += '<td>' + array[i][j] + '</td>';
            } else {
                table += `<td><b>${array[i][j]}</b></td>`;
            }
        }
        table += '</tr>';
    }
    table += '</table>';

    document.getElementById("fence-table").innerHTML = table;
}

/**
 * 
 */
function encryptFence() {
    // Validate height of fence
    let height = parseInt(document.getElementById("encrypt-input").value);
    const positive = height > 0;
    height = Math.abs(height);
    if (height <= 1) return;
    
    // Fence and text variables
    const fence = Array.from({ length: height }, () => []);
    const plainText = document.getElementById("plain-text").value.replace(/[^A-Za-z]/g, '');

    // Iterate through the string and fill the rail fence array
    let index = positive ? height - 1 : 0;
    let direction = positive ? -1 : 1;
    for (let i in plainText) {
        let char = plainText[i];
        fence[index].push(char);

        // Update the index and direction
        if (index === 0) {
            direction = 1;
            if (i != 0) fence[index].push("↓");
        } else if (index === height - 1) {
            direction = -1;
            if (i != 0) fence[index].push("↑");
        }
        index += direction;
    }

    // Generate cipher text
    let cipherText = "";
    for (let i = 0; i < height; i++) {
        let row = fence[i];
        for (let j = 0; j < row.length; j++) {
            if (/^[a-zA-Z]+$/.test(row[j])) cipherText += row[j].toUpperCase();
        }
        cipherText += " ";
    }
    document.getElementById("cipher-text").value = cipherText;

    // Update table
    createHtmlTableFromArray(fence);
}
document.getElementById("encrypt-button").onclick = encryptFence;

/**
 * 
 */
function decipherFence() {
    // Validate height
    let height = parseInt(document.getElementById("decrypt-input").value);
    const positive = height > 0;
    height = Math.abs(height);
    if (height <= 1) return;

    // Fence and text variables
    const cipherText = document.getElementById("cipher-text").value.replace(/[^A-Za-z]/g, '');
    const fence = Array.from({ length: height }, () => []);

    // Iterate through the string and fill the rail fence array
    let index = positive ? height - 1 : 0;
    let direction = positive ? -1 : 1;
    for (let i in cipherText) {
        fence[index].push("a");

        // Update the index and direction
        if (index === 0) {
            direction = 1;
            if (i != 0) fence[index].push("↓");
        } else if (index === height - 1) {
            direction = -1;
            if (i != 0) fence[index].push("↑");
        }
        index += direction;
    }

    // Replace fence with correct characters
    index = 0;
    for (let i = 0; i < height; i++) {
        let row = fence[i];
        for (let j = 0; j < row.length; j++) {
            if (/^[a-zA-Z]+$/.test(row[j])) row[j] = cipherText[index++];
        }
    }

    // Generate plain text
    let plainText = "";
    index = positive ? height - 1 : 0;
    direction = positive ? -1 : 1;
    const length = fence.reduce((longest, current) => current.length > longest.length ? current : longest, []).length;
    for (let i = 0; i < length; i++) {
        // Loop through i index of each row
        for (let j = index; (index === 0 && j < height) || (index === height - 1 && j >= 0); j += direction) {
            if (fence[j][i] === undefined) break;
            if (/^[a-zA-Z]+$/.test(fence[j][i])) plainText += fence[j][i].toLowerCase();
        }

        // Reverse index and direction
        index = Math.abs(index - (height - 1));
        direction = -direction;
    }
    document.getElementById("plain-text").value = plainText;
    
    // Update table
    createHtmlTableFromArray(fence);
}
document.getElementById("decipher-button").onclick = decipherFence;
