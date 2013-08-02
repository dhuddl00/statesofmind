//global var for upc list
var upcs;
var tagXML = "";
var tagStyle = "Dillards";

function init() {
    getTagXML("Dillards");
    getUPCs();
}

function handleFileSelect(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
        updateListWithCsv(e.target.result);
      }
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
}

function updateListWithCsv(csvData) {
    var xmlhttp = new XMLHttpRequest();
    var url = "orderListFromCsv";
    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("Content-type","application/csv");
    xmlhttp.send(csvData);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            var rows = JSON.parse(xmlhttp.responseText); 

            //Print UPCs table to screen
            printUPCTable(rows);
        }
          else
             alert("Error ->" + xmlhttp.responseText);
        }}; 
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

    var url = "upcList";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET',url,true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == 4) {
    if (xmlhttp.status == 200) {
            
        var rows = getRowsFromJson(xmlhttp.responseText); 

        //Print UPCs table to screen
        printUPCTable(rows);

        }
          else
             alert("Error ->" + xmlhttp.responseText);
    }
    };
     
}

function getRowsFromJson(jsonData) {
       //  var upcList = xmlhttp.responseText;
        var upcList = JSON.parse(jsonData);
        var rows = [];
        for(var i=0; i<upcList.length; i++) {
            var upc = upcList[i];

            //add entry in the rows list
            rows[i] = {"upc" : upc.upc, "qty" : upc.oounits};

            //remove oounits from the upc object
            delete upc.oounits;

            //add upc to the upc master list, overwritting any existing values
            upcs[upc.upc] = upc;
        }
        return rows;
}

function printUPCTable(rows) {

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

        for (var i = 0; i < rows.length; i++)
        {
            upc = upcs[rows[i].upc];            
            if (!upc) {
                alert("ERROR: UPC " + rows[i].upc + " does not exist on master UPC list in Google Docs"); 
                upc = getBlankUpc(rows[i]);
            }

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
            html += "<td><INPUT TYPE=text id=qty" + upc.upc + " VALUE= " + rows[i].qty + " size=2 style=text-align:right></td>";
            html += "<td><input type=button value=print onclick=printLabels(" + upc.upc + ")></td>";
            html += "<td><span id=printed" + upc.upc + "></span></td>";
            html += "</tr>";
        }

        html += "</table>";
        document.getElementById("results").innerHTML = html;
}

function getBlankUpc(row) {
    return {"dept":"0000","mic":"000","style":"undefined","styledesc":"undefined","color":"undefined",
                "size":"undefined","sku":"undefined","upc":row.upc,"unitretail":"$0.00","qty":row.qty};
}
      
function printLabels(upc) {
    document.getElementById("printed" + upc).innerHTML = "printing...";
    var qty = document.getElementById("qty" + upc).value

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
            throw "No DYMO printers are installed.";

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
