function load() {

    var xs = x_spreadsheet('#x-spreadsheet-auto-checker', {
        showToolbar: true,
        showGrid: true,
        showBottomBar: true
    })

    xs.on('cell-selected', (cell, ri, ci) => {
        console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
    }).on('cell-edited', (text, ri, ci) => {
        console.log('text:', text, ', ri: ', ri, ', ci:', ci);
    }).on('pasted-clipboard', (data) => {
        console.log('>>>> data is ', data);
    });
}

function importFile() {
    console.log('importFile clicked');
}

function exportFile() {
    console.log('exportFile clicked');
}