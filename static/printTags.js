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

            html += "<td><INPUT TYPE=text id=oo" + upc.upc + " VALUE= " + upc.oounits + " size=2 style=text-align:right></td>";
            html += "<td><input type=button value=print onclick=printLabels(" + upc.upc + ")></td>";
            html += "<td><span id=printed" + upc.upc + "></span></td>";
            html += "</tr>";
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
    //alert("Printing " + qty + " labels for UPC " + upc + " style_desc " + upcs[upc].styledesc);
                    
    try
    {
        // open label
        //var labelXml = loadXMLDoc(document.getElementById("xml").innerHTML);
        var label = dymo.label.framework.openLabelXml(getDillardsTagXML());

        // set label text
        label.setObjectText('DEPT', upcs[upc].dept);
        label.setObjectText('MIC', upcs[upc].mic);
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

function getDillardsTagXML() {
        return '<?xml version="1.0" encoding="utf-8"?> \
<DieCutLabel Version="8.0" Units="twips"> \
  <PaperOrientation>Landscape</PaperOrientation> \
  <Id>Small30334</Id> \
  <PaperName>30334 2-1/4 in x 1-1/4 in</PaperName> \
  <DrawCommands> \
    <RoundRectangle X="0" Y="0" Width="3240" Height="1800" Rx="270" Ry="270"/> \
  </DrawCommands> \
  <ObjectInfo> \
    <BarcodeObject> \
      <Name>BARCODE</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="255" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation90</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <Text>84988600506</Text> \
      <Type>UpcA</Type> \
      <Size>Small</Size> \
      <TextPosition>Bottom</TextPosition> \
      <TextFont Family="Lucida Grande" Size="10" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
      <CheckSumFont Family="Lucida Grande" Size="10" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
      <TextEmbedding>None</TextEmbedding> \
      <ECLevel>0</ECLevel> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <QuietZonesPadding Left="0" Right="0" Top="0" Bottom="0"/> \
    </BarcodeObject> \
    <Bounds X="150.7965" Y="1039.339" Width="1525.06" Height="1826.031"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>SIZE</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>None</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>M</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="636.1512" Y="946.1892" Width="679.3409" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>STYLE</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>ShrinkToFit</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>AR02359323</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="630.9739" Y="494.5828" Width="1082.626" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>DEPT</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>None</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>0351</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="636.1512" Y="57.6001" Width="1077.449" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>RETAIL</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <HorizontalAlignment>Center</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>None</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>$32.00</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="11" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="86.40005" Y="2874.395" Width="1627.2" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>COLOR</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>None</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>RED</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="636.1512" Y="724.9169" Width="1077.449" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>TEXT</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>False</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>ShrinkToFit</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>Dept:</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="86.39999" Y="57.6001" Width="582.8901" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>TEXT_1</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>False</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>ShrinkToFit</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>MIC:</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="86.39999" Y="283.9626" Width="582.8901" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>MIC</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>True</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>None</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>766</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="636.1512" Y="283.9626" Width="1077.449" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>TEXT_1_1</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>False</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>ShrinkToFit</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>Size:</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="86.39999" Y="946.1892" Width="545.4985" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>TEXT_1_1_1</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>False</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>ShrinkToFit</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>Color:</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="86.39999" Y="724.9169" Width="565.0572" Height="248.9143"/> \
  </ObjectInfo> \
  <ObjectInfo> \
    <TextObject> \
      <Name>TEXT_1_1_1_1</Name> \
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/> \
      <LinkedObjectName></LinkedObjectName> \
      <Rotation>Rotation0</Rotation> \
      <IsMirrored>False</IsMirrored> \
      <IsVariable>False</IsVariable> \
      <HorizontalAlignment>Left</HorizontalAlignment> \
      <VerticalAlignment>Middle</VerticalAlignment> \
      <TextFitMode>ShrinkToFit</TextFitMode> \
      <UseFullFontHeight>True</UseFullFontHeight> \
      <Verticalized>False</Verticalized> \
      <StyledText> \
        <Element> \
          <String>Style:</String> \
          <Attributes> \
            <Font Family="Lucida Grande" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/> \
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/> \
          </Attributes> \
        </Element> \
      </StyledText> \
    </TextObject> \
    <Bounds X="86.39999" Y="494.5828" Width="565.0572" Height="248.9143"/> \
  </ObjectInfo> \
</DieCutLabel> \
';
}
