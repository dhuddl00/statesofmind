//global var for upc list
var upcs;
var tagXML = "";
var tagStyle = "Dillards";

function init() {
    getTagXML("Dillards");
    getUPCs();
}

function pad(num, size) {
     var s = num+"";
     while (s.length < size) s = "0" + s;
     return s;
}

function getTagXML(newTagStyle) {
    var xmlhttp = new XMLHttpRequest();
    var url;
    var button;
    tagStyle = newTagStyle;
    if ( tagStyle === 'Dillards' ) {
        url = "dillardsTagXML";
        button = '<input type=button value=Dillards onclick=getTagXML("Boutique")>';
    } else {
        url = "boutiqueTagXML";
        button = '<input type=button value=Boutique onclick=getTagXML("Dillards")>';
    }

    xmlhttp.open('GET',url,true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            tagXML = xmlhttp.responseText;
            document.getElementById("tag").innerHTML = "Tag Style: " + button;
        }}}; 
}

function getUPCs() {

    //initialize upcs object
    upcs = new Object();

    var url = "https://spreadsheets.google.com/feeds/list/0ApQT17osW5EmdDdaVjBQb2dOZlBWZ1VSSzhKaXZFUnc/od6/public/basic?alt=json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET',url,true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == 4) {
    if (xmlhttp.status == 200) {
            
        var keyList = [];

        var det = eval( "(" +  xmlhttp.responseText + ")");
                    
        var entryList = det.feed.entry; 
        for (var r = 0; r < entryList.length; r++)
        {
            var upcString = entryList[r].content.$t; 
            var upcFields = upcString.split(',');
              
            var upc = new Object();
            for (var i = 0; i < upcFields.length; i++)
            {
                var keyval = upcFields[i].split(':');
                eval("upc." + keyval[0] + ' = "' + keyval[1].replace(/^\s+|\s+$/g,'') + '"');
            }
  
            upc.dept = pad(upc.dept,4);
            upc.mic = pad(upc.mic,3);   
            upc.unitretail = formatDollar(upc.unitretail);
            if(! upc.hasOwnProperty("sku")) 
                upc.sku = "n/a";


            //default on order to 0 if not defined
            if (! upc.hasOwnProperty("oounits")) 
                upc.oounits = 0;
            
            //add upc to the hash
            keyList[r] = upc.upc;
            upcs[upc.upc] = upc;

        }
    
        //Go get Print Quantities

        //Print UPCs table to screen
        printUPCTable(keyList);
        }
          else
             alert("Error ->" + xmlhttp.responseText);
    }
    };
     
}

function printUPCTable(keyList) {

        var html = "<table id='upcs'>";
    
        //Print header row
        html += "<tr>";
        html += "<th>Row</th>";
        html += "<th>Dept</th>";
        html += "<th>MIC</th>";
        html += "<th>Style</th>";
        html += "<th>Style Desc</th>";
        html += "<th>Color</th>";
        html += "<th>Size</th>";
        html += "<th>SKU</th>";
        html += "<th>UPC</th>";
        html += "<th>Retail</th>";
        html += "<th>Qty</th>";
        html += "<th></th>";
        html += "<th>Status</th>";
        html += "</tr>";
    
        var upc;

        for (var i = 0; i < keyList.length; i++)
        {
            upc = upcs[keyList[i]];            
            html += "<tr>";
            html += "<td>" + (i+1) + "</td>";
            html += "<td>" + upc.dept + "</td>";
            html += "<td>" + upc.mic + "</td>";
            html += "<td>" + upc.style + "</td>";
            html += "<td>" + upc.styledesc + "</td>";
            html += "<td>" + upc.color + "</td>";
            html += "<td>" + upc.size + "</td>";
            html += "<td>" + upc.sku + "</td>";
            html += "<td>" + upc.upc + "</td>";
            html += "<td>" + upc.unitretail + "</td>";
            html += "<td><INPUT TYPE=text id=oo" + upc.upc + " VALUE= " + upc.oounits + " size=2 style=text-align:right></td>";
            html += "<td><input type=button value=print onclick=printLabels(" + upc.upc + ")></td>";
            html += "<td><span id=printed" + upc.upc + "></span></td>";
            html += "</tr>";
        }

        html += "</table>";
        document.getElementById("results").innerHTML = html;
        
    
}
      
function printLabels(upc) {
    document.getElementById("printed" + upc).innerHTML = "printing...";
    var qty = document.getElementById("oo" + upc).value
    //alert("Printing " + qty + " labels for UPC " + upc + " style_desc " + upcs[upc].styledesc);
                    
    try
    {
        // open label
        var label = dymo.label.framework.openLabelXml(tagXML);

        // set label text
        if (tagStyle === "Dillards") {
            label.setObjectText('DEPT', upcs[upc].dept);
            label.setObjectText('MIC', upcs[upc].mic);
        } else {
            label.setObjectText('SKU', upcs[upc].sku);
        }

        label.setObjectText('STYLE', upcs[upc].style);
        label.setObjectText('COLOR', upcs[upc].color);
        label.setObjectText('SIZE', upcs[upc].size);
        
        label.setObjectText('RETAIL', upcs[upc].unitretail);
        label.setObjectText('BARCODE', upcs[upc].upc.substring(0,11));
        
        // select printer to print on
        // for simplicity sake just use the first LabelWriter printer
        var printers = dymo.label.framework.getPrinters();
        if (printers.length == 0)
            throw "No DYMO printers are installed. Install DYMO printers.";

        var printerName = "";
        for (var i = 0; i < printers.length; ++i)
        {
            var printer = printers[i];
            if (printer.printerType == "LabelWriterPrinter")
            {
                printerName = printer.name;
                break;
            }
        }
        
        if (printerName == "")
            throw "No LabelWriter printers found. Install LabelWriter printer";

        // finally print the label
        for( i=0; i<qty; i++)
            label.print(printerName);
        
    }
    catch(e)
    {
        alert(e.message || e);
    }
    
    document.getElementById("printed" + upc).innerHTML = "done";
}
    
function formatDollar(strNum) {
    var num = Number(strNum.replace(/\$/g, ''));
    var formatted = "$"  + num.toFixed(2).toString(); 
    return formatted;   
}
