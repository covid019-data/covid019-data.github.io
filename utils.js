function addCommas(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function camelPad(str){ 
    return str.replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2').replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/([a-zA-Z])(\d)/g, '$1 $2') .replace(/^./, function(str){ return str.toUpperCase(); }).trim(); 
}