//http://www.kryogenix.org/code/browser/sorttable/

addEvent(window, "load", sortables_init);

var SORT_COLUMN_INDEX;
var decimalPointDelimiter = ",";
var defaultEmptyOK = false;


function sortables_init() {
    // Find all tables with class sortable and make them sortable
    if (!document.getElementsByTagName) return;
    tbls = document.getElementsByTagName("table");
    for (ti=0;ti<tbls.length;ti++) {
        thisTbl = tbls[ti];
        if (((' '+thisTbl.className+' ').indexOf("sortable") != -1) && (thisTbl.id)) {
            //initTable(thisTbl.id);
            ts_makeSortable(thisTbl);
        }
    }
}

function ts_makeSortable(table) {
    //A�adimos funcionalidad contemplando que la fila de ordenacion no tiene porque ser la primera, sino la ultima que encontramos dentro del thead
    if (table.rows && table.rows.length > 0) {
        if (!table.tHead || !table.tHead.rows || 0 == table.tHead.rows.length) {
			    var firstRow = table.rows[0];
		    } else {
          var firstRow = table.tHead.rows[table.tHead.rows.length - 1];
        }        
    }
    if (!firstRow) return;
    
    // We have a first row: assume it's the header, and make its contents clickable links
    for (var i=0;i<firstRow.cells.length;i++) {
        var cell = firstRow.cells[i];
        //A�adimos funcionalidad indicando que solo sera ordenable las celdas con clase sort
        if(cell.className == "sort")
        {
          var txt = ts_getInnerText(cell);
          cell.innerHTML = '<a href="#" class="sortheader" onclick="ts_resortTable(this);return false;">'+txt+'<span class="sortarrow">&nbsp;&nbsp;&nbsp;</span></a>';
        }
    }
}

function ts_getInnerText(el) {
	if (typeof el == "string") return el;
	if (typeof el == "undefined") { return el };
	if (el.innerText) return el.innerText;	//Not needed but it is faster
	var str = "";
	
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
			case 1: //ELEMENT_NODE
				str += ts_getInnerText(cs[i]);
				break;
			case 3:	//TEXT_NODE
				str += cs[i].nodeValue;
				break;
		}
	}
	return str;
}

function esDigito(sChr){
    var sCod = sChr.charCodeAt(0);
    return ((sCod > 47) && (sCod < 58));
}
   
function finMes(oTxt){
	var nMes = parseInt(oTxt.substr(4, 2));
	var nRes = 0;
	switch (nMes){
	case 1: nRes = 31; break;
	case 2: nRes = 29; break;
	case 3: nRes = 31; break;
	case 4: nRes = 30; break;
	case 5: nRes = 31; break;
	case 6: nRes = 30; break;
	case 7: nRes = 31; break;
	case 8: nRes = 31; break;
	case 9: nRes = 30; break;
	case 10: nRes = 31; break;
	case 11: nRes = 30; break;
	case 12: nRes = 31; break;
	}
	return nRes;
}
 
function valDia(oTxt){ 
    var bOk = true; 
    var nDia = oTxt.substr(1, 2); 
    
    bOk = bOk || ((nDia >= 1) && (nDia <= finMes(oTxt))); 
    
    return bOk; 
   } 

function valMes(oTxt){
    
    var bOk = true; 
    var nMes = oTxt.substr(4, 2);
    
    bOk = bOk || ((nMes >= 1) && (nMes <= 12)); 
    
    return bOk; 
   } 

function valAno(oTxt){ 

    var bOk = true; 
    var nAno = oTxt.substr(7,4);
    
    bOk = bOk && ((nAno.length == 2) || (nAno.length == 4)); 
    
    if (bOk){ 
     for (var i = 0; i < nAno.length; i++){ 
      bOk = bOk && esDigito(nAno.charAt(i)); 
     } 
    }
    
    return bOk; 
} 


function valFecha(oTxt){ 
    var bOk = true; 
    if (oTxt != ""){ 
     bOk = bOk && (valAno(oTxt)); 
     bOk = bOk && (valMes(oTxt)); 
     bOk = bOk && (valDia(oTxt)); 
    }else {
	bOk = false;
    }
    return bOk;  
} 

function isEmpty(s){
  return ((s == null) || (s.length == 0))
}


function isFloat (s){
  var i;
  var seenDecimalPoint = false;
  var vacio = isEmpty(s);
  if (vacio== true){
    if (isFloat.arguments.length == 1) return defaultEmptyOK;
    else return (isFloat.arguments[1] == true);
  }
  if (s == decimalPointDelimiter) return false;
  for (i = 1; i < s.length; i++){   
    var c = s.charAt(i);
    if ((c == decimalPointDelimiter) && !seenDecimalPoint) 
	  seenDecimalPoint = true;
    else if (!esDigito(c)) return false;
  }
  return (true && seenDecimalPoint);
}


function ts_resortTable(lnk) {
    // get the span
    var span;
    for (var ci=0;ci<lnk.childNodes.length;ci++) {
        if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') span = lnk.childNodes[ci];
    }
    var spantext = ts_getInnerText(span);
    var td = lnk.parentNode;
    var column = td.cellIndex;
    var table = getParent(td,'TABLE');
    
    // Work out a type for the column
    if (table.rows.length <= 1) return;
    //A�adimos funcionalidad, en vez de leer el dato de la fila 1 de la tabla, la leemos de la primera fila que encontramos en el tBodies
    //Esto solo ocurrira en el caso de que esten definidos correctamente tanto un tHead como un tBody
    if (!table.tHead || !table.tHead.rows || 0 == table.tHead.rows.length || !table.tBodies[0] || !table.tBodies[0].rows || 0 == table.tBodies[0].rows.length) {
      var itm = ts_getInnerText(table.rows[1].cells[column]);
    } else {
      var itm = ts_getInnerText(table.tBodies[0].rows[0].cells[column]);
    }
    
    var validarFecha = valFecha(itm);
    sortfn = ts_sort_caseinsensitive;
    if (validarFecha == true){
      sortfn = ts_sort_date_hhmm;
    }
    var esFloat = isFloat(itm);
    if (esFloat == true) sortfn = ts_sort_numeric;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^[�$]/)) sortfn = ts_sort_currency;
    if (itm.match(/^[\d\.]+$/)) sortfn = ts_sort_numeric;
    
    SORT_COLUMN_INDEX = column;
    var firstRow = new Array();
    var newRows = new Array();
    //A�adimos funcionalidad, en vez de recoger la fila 0, recogemos la ultima fila del thead
    if (!table.tHead || !table.tHead.rows || 0 == table.tHead.rows.length)
    {
      for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
    } else {
      var tmpfR = table.tHead.rows[table.tHead.rows.length - 1];
      for (i=0;i<tmpfR.length;i++) { firstRow[i] = tmpfR[i]; }
    }
    //A�adimos funcionalidad, todas las filas a ordenar seran todas las del tBody en vez de todas las filas a partir de la fila 1
    if (!table.tHead || !table.tHead.rows || 0 == table.tHead.rows.length || !table.tBodies[0] || !table.tBodies[0].rows || 0 == table.tBodies[0].rows.length) 
    {
      for (j=1;j<table.rows.length;j++) { newRows[j-1] = table.rows[j]; }
    } else {
      for (j=0;j<table.tBodies[0].rows.length;j++) { newRows[j] = table.tBodies[0].rows[j]; }
    }

    newRows.sort(sortfn);

    if (span.getAttribute("sortdir") == 'down') {
        ARROW = '&nbsp;&nbsp;&uarr;';
        newRows.reverse();
        span.setAttribute('sortdir','up');
    } else {
        ARROW = '&nbsp;&nbsp;&darr;';
        span.setAttribute('sortdir','down');
    }
    
    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    // don't do sortbottom rows
    for (i=0;i<newRows.length;i++) { if (!newRows[i].className || (newRows[i].className && (newRows[i].className.indexOf('sortbottom') == -1))) table.tBodies[0].appendChild(newRows[i]);}
    // do sortbottom rows only
    for (i=0;i<newRows.length;i++) { if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)) table.tBodies[0].appendChild(newRows[i]);}
    
    // Delete any other arrows there may be showing
    var allspans = document.getElementsByTagName("span");
    for (var ci=0;ci<allspans.length;ci++) {
        if (allspans[ci].className == 'sortarrow') {
            if (getParent(allspans[ci],"table") == getParent(lnk,"table")) { // in the same table as us?
                allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
            }
        }
    }
        
    span.innerHTML = ARROW;
}

function getParent(el, pTagName) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())	// Gecko bug, supposed to be uppercase
		return el;
	else
		return getParent(el.parentNode, pTagName);
}
function ts_sort_date(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
    
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    
    if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
    }
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
    } else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
    }
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    
    return 1;
}
//Se a�ade una nueva funcion para que ordene correctamente en citaciones_plan por fecha y hora
function ts_sort_date_hhmm(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    
    if (aa.length == 11){
    	dt1 = aa.substr(7,2)+aa.substr(4,2)+aa.substr(1,2)+aa.substr(12,2)+aa.substr(15,2);
    	
    	dt2 = bb.substr(7,2)+bb.substr(4,2)+bb.substr(1,2)+bb.substr(12,2)+bb.substr(15,2);
    	
    	
    }else{
    	dt1 = aa.substr(7,4)+aa.substr(4,2)+aa.substr(1,2)+aa.substr(12,2)+aa.substr(15,2);
    	
    	dt2 = bb.substr(7,4)+bb.substr(4,2)+bb.substr(1,2)+bb.substr(12,2)+bb.substr(15,2);
    	
    }
    
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
}

function ts_sort_currency(a,b) { 
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    return parseFloat(aa) - parseFloat(bb);
}

function ts_sort_numeric(a,b) { 
    aa = parseFloat(ts_getInnerText(a.cells[SORT_COLUMN_INDEX]));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(ts_getInnerText(b.cells[SORT_COLUMN_INDEX])); 
    if (isNaN(bb)) bb = 0;
    return aa-bb;
}

function ts_sort_caseinsensitive(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}

function ts_sort_default(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}


function addEvent(elm, evType, fn, useCapture)
// addEvent and removeEvent
// cross-browser event handling for IE5+,  NS6 and Mozilla
// By Scott Andrew
{
  if (elm.addEventListener){
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent){
    var r = elm.attachEvent("on"+evType, fn);
    return r;
  } else {
    
  }
} 
