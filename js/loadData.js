var xspr

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

    xspr = xs
}

function stox(wb) {
    var out = [];
    wb.SheetNames.forEach(function(name) {
        var o = { name: name, rows: {} };
        var ws = wb.Sheets[name];
        var aoa = XLSX.utils.sheet_to_json(ws, { raw: false, header: 1 });
        aoa.forEach(function(r, i) {
            var cells = {};
            r.forEach(function(c, j) { cells[j] = ({ text: c }); });
            o.rows[i] = { cells: cells };
        })
        out.push(o);
    });
    return out;
}

function xtos(sdata) {
    var out = XLSX.utils.book_new();
    sdata.forEach(function(xws) {
        var aoa = [
            []
        ];
        var rowobj = xws.rows;
        for (var ri = 0; ri < rowobj.len; ++ri) {
            var row = rowobj[ri];
            if (!row) continue;
            aoa[ri] = [];
            Object.keys(row.cells).forEach(function(k) {
                var idx = +k;
                if (isNaN(idx)) return;
                aoa[ri][idx] = row.cells[k].text;
            });
        }
        var ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(out, ws, xws.name);
    });
    return out;
}

var process_wb = (function() {
    //var XPORT = document.getElementById('xport');

    return function process_wb(wb) {
        /* convert to x-spreadsheet form */
        var data = stox(wb);

        /* update x-spreadsheet */
        xspr.loadData(data);
        //XPORT.disabled = false;

        if (typeof console !== 'undefined') console.log("output", new Date());
    };
})();

var do_file = (function() {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;
    var domrabs = document.getElementsByName("userabs")[0];
    if (!rABS) domrabs.disabled = !(domrabs.checked = false);

    return function do_file(files) {
        rABS = domrabs.checked;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            if (typeof console !== 'undefined') console.log("onload", new Date(), rABS);
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            process_wb(XLSX.read(data, { type: rABS ? 'binary' : 'array' }));
        };

        if (rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
    };
})();

function import_file(files) {
    do_file(files)
}

function export_file() {
    console.log('exportFile clicked');
}