//global var for upc list
var upcs;
function init() {
    // put more code here in case you are concerned about browsers that do not provide XMLHttpRequest object directly
    xmlhttp = new XMLHttpRequest();
    getDetails();
}

function pad(num, size) {
     var s = num+"";
     while (s.length < size) s = "0" + s;
     return s;
}


function getDetails() {
    ////initialize upcs hash
    upcs = new Object();

     var empno = document.getElementById("empno");
     var url = "https://spreadsheets.google.com/feeds/list/0ApQT17osW5EmdDdaVjBQb2dOZlBWZ1VSSzhKaXZFUnc/od6/public/basic?alt=json";
     xmlhttp.open('GET',url,true);
     xmlhttp.send(null);
     xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState == 4) {
               if ( xmlhttp.status == 200) {
            
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
    html += "<th>UPC</th>";
    html += "<th>Retail</th>";
    html += "<th>Qty</th>";
    html += "<th></th>";
    html += "<th>Status</th>";
    html += "</tr>";
      
        var det = eval( "(" +  xmlhttp.responseText + ")");
                    
        var entryList = det.feed.entry; 
        for (var r = 0; r < entryList.length; r++)
        {
                
            html += "<tr>";
      html += "<td>" + (r+1) + "</td>";
            var upcString = entryList[r].content.$t; 
            var upcFields = upcString.split(',');
            
            var upc = {};
            for (var i = 0; i < upcFields.length; i++)
            {
                var keyval = upcFields[i].split(':');
                eval("upc." + keyval[0] + ' = "' + keyval[1].replace(/^\s+|\s+$/g,'') + '"');
            }
    
            upc.dept = pad(upc.dept,4);
            upc.mic = pad(upc.mic,3);   
            upc.unitretail = formatDollar(upc.unitretail);
            upcs[upc.upc] = upc;

            html += "<td>" + upc.dept + "</td>";
            html += "<td>" + upc.mic + "</td>";
            html += "<td>" + upc.style + "</td>";
            html += "<td>" + upc.styledesc + "</td>";
            html += "<td>" + upc.color + "</td>";
            html += "<td>" + upc.size + "</td>";
            html += "<td>" + upc.upc + "</td>";
            html += "<td>" + upc.unitretail + "</td>";

            //default on order to 0 if not defined
            if (typeof upc.oounits === "undefined") 
                upc.oounits = 0;
            html += "<td><INPUT TYPE=text id=oo" + upc.upc 
                + " VALUE= " + upc.oounits + " size=2 style=text-align:right></td>";
            html += "<td><input type=button value=print onclick=printLabels(" + upc.upc + ")></td>"
    ;       html += "<td><span id=printed" + upc.upc + "></span></td>"
    ;       html += "</tr>";
        }

        html += "</table>";
        document.getElementById("results").innerHTML = html;
        

              }
              else
                    alert("Error ->" + xmlhttp.responseText);
           }
     };
     
     }

     function printLabels(upc) {
            document.getElementById("printed" + upc).innerHTML = "printing...";
            var qty = document.getElementById("oo" + upc).value
     ;            ("Printing " + qty + " labels for UPC " + upc + " style_desc " + upcs[upc].styledesc);
                    
         try
         {
             // open label
             var labelXml = '<?xml versi'etObjectText('STYLE', upcs[upc].style);
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
     =                   printerName = printer.name;
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
            
         =   document.getElementById("printed" + upc).innerHTML = "done";
        
     
    }
    
    function formatDollar(strNum) {
        var num = Number(strNum.replace(/\$/g, ''));
        var formatted = "$"  + num.toFixed(2).toString(); 
        return formatted;   
        
    }
