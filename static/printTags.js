var upcs;
var rows;
var tagXML = "";
var tagStyle = "Dillards";

function init() {
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
            rows = JSON.parse(xmlhttp.responseText); 

            //Print UPCs table to screen
            printUPCTable();
        }
          else
             alert("Error ->" + xmlhttp.responseText);
        }}; 
}

function setTagStyle(newTagStyle) {
    var xmlhttp = new XMLHttpRequest();
    var url;
    var buttonHtml;
    tagStyle = newTagStyle;
    if ( tagStyle === 'Dillards' ) {
        url = "dillardsTagXML";
        buttonHtml = '<input type=button value=Dillards onclick=setTagStyle("Boutique")>';
    } else {
        url = "boutiqueTagXML";
        buttonHtml = '<input type=button value=Boutique onclick=setTagStyle("Dillards")>';
    }

    xmlhttp.open('GET',url,true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            tagXML = xmlhttp.responseText;
            document.getElementById("tag").innerHTML = buttonHtml;
            printUPCTable();
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
            
        setUPCsFromJson(xmlhttp.responseText); 
        setRowsFromJson(xmlhttp.responseText); 

        //Sets tag style and prints table
        setTagStyle("Dillards");

        }
          else
             alert("Error ->" + xmlhttp.responseText);
    }
    };
     
}

function setRowsFromJson(jsonData) {
        rows = [];
        var list = JSON.parse(jsonData);
        for(var i=0; i<list.length; i++) {
            var upc = list[i];
        
            //add entry in the rows list
            rows[i] = {"upc" : upc.upc, "qty" : upc.oounits};
            
            //if dept is available in the input then store it in the row field so
            //that it can be used for validation later
            if(upc.dept)
                rows[i].dept = upc.dept;
        }
}

function setUPCsFromJson(jsonData) {
        var list = JSON.parse(jsonData);
        for(var i=0; i<list.length; i++) {
            var upc = list[i];
        
            //add upc to the upc master list, overwritting any existing values
            upcs[upc.upc] = upc;
        }
}

function printUPCTable() {

        var html = "<table id='upcs'>";
    
        //Print header row
        html += "<tr>";
        html += "<th>Row</th>";
        if ( tagStyle === 'Dillards' ) {
            html += "<th>Dept</th>";
            html += "<th>MIC</th>";
        }
        html += "<th>Style</th>";
        html += "<th>Style Desc</th>";
        html += "<th>Color</th>";
        html += "<th>Size</th>";
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
            
            //**Check for various Errors**//
            var messages = [];
            if (!upc) {
                messages.push("ERROR: UPC not found"); 
                upc = getBlankUpc(rows[i]);
            }
            if (upc.dept)
                if (rows[i].dept)
                    if (upc.dept != rows[i].dept) {
                       messages.push("ERROR: Department Mis-match");
                    }
            var msg = "";
            if(messages.length == 1)
                msg = messages[0];
            if(messages.length == 2)
                msg = messages[0] + "<br>" + messages[1];


            //**Build Table HTML**//
            html += "<tr>";
            html += "<td>" + (i+1) + "</td>";
            if ( tagStyle === 'Dillards' ) {
                html += "<td>" + upc.dept + "</td>";
                html += "<td>" + upc.mic + "</td>";
            }
            html += "<td>" + upc.style + "</td>";
            html += "<td>" + upc.styledesc + "</td>";
            html += "<td>" + upc.color + "</td>";
            html += "<td>" + upc.size + "</td>";
            html += "<td>" + upc.upc + "</td>";
            html += "<td>" + upc.unitretail + "</td>";
            html += "<td><input type=text id=qty" + upc.upc + " value= " + rows[i].qty + " size=2 style=text-align:right></td>";
            html += "<td><input type=button value=print onclick=printLabels(" + upc.upc + ")></td>";
            html += "<td><span id=printed" + upc.upc + "></span>" + msg + "</td>";
            html += "</tr>";

        }

        html += "</table>";
        document.getElementById("results").innerHTML = html;
}

function getBlankUpc(row) {
    return {"dept":"0000","mic":"000","style":"undefined","styledesc":"undefined","color":"undefined",
                "size":"undefined","upc":row.upc,"unitretail":"$0.00","qty":row.qty};
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
