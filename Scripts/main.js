// here is a live demo of this code: http://www.ellipsetours.com/Demos/storage/

$(document).ready(function(){
	//this fires on load or when a button is pressed

    //determin if an increment or decrement button was pushed
    //increm as 0-30, decrems are 100-130 and spans (where the value is stored) are 200-230
    $('.IncremBtn').click(function(event){
    	var MyID = 200 + parseInt(event.target.id);
    	adjustValue(1,MyID);
    });
    $('.DecremBtn').click(function(event){
    	var MyID = 100 + parseInt(event.target.id); //need to be in the 200s
    	adjustValue(-1,MyID);
    });
    
    if (!Modernizr.localstorage) {
      alert("This browser does not support local storage.");
      return;
    }
  
    if (!window.JSON) {
      alert("This browser does not support JSON.");
      return;
    }
     $("#newSite")
      .button()
      .click(function() {
        createNewSite();
      });
     $("#Stop")
      .button()
      .click(function() {
        stopData();
      });
     $("#editSite")
      .button()
      .click(function() {
        editSite();
      });
     $("#removeSite")
      .button()
      .click(function() {
        removeSite();
      });
     $("#Upload")
      .button()
      .click(function() {
        Upload();
      });
      $("#startData")
      .button()
      .click(function() {
        startData();
      });
      $("#mycomments") //autosave as the user types
      .keyup(function() {
      	saveSite($("#mycomments").val());
      });
      $("#mylocation") //autosave as the user types
      .keyup(function() {
      	saveSite($("#mylocation").val());
      });
	loadSites();
	 
});

function adjustValue(Adjust,id){
	    //var snd = new Audio("audio/button-3.wav"); // buffers automatically when created
		var MyValue = parseInt($('#' + id).html());
	    var MyValues = Array();
		
		if (MyValue < 1 && Adjust ==-1) 
		{
			//don't make negative
			return false;
		}
		
		//var clickedID = this.id();
    	//alert('#' + id.toString);
    	//get current value and add one
        $('#' + parseInt(id)).html(MyValue+Adjust);
        //store data to local application cache
	 
	    MyValues = getCounts();
	  
	    localStorage[getID()] = JSON.stringify(MyValues);
	    
	    //snd.play();
 		changecolors();
 
	    //var storedNames = JSON.parse(localStorage[getID()]);
	    //alert(storedNames);
	    
	    //localStorage[$box.attr("id")] = JSON.stringify(getCounts);
}

function Upload(){

	//check for data
	if ($('#previousData > option').length < 1)
	{
		alert("No data collected.  Go collect some data!");
		return false;
	}
	
	//write to a backup file (timestamp)
	exportToCSV();
	
	//check internet
	
	//loop through local storage and add to string
	var emailBody = '"TTwS","TTwoS","Other","uTTwS","uTTwoS","uOther","SiteID","Name","Location","Comments","Date","Ver"';
	var localstro = "";
	for (var i = 0; i < localStorage.length; i++){
		localstor = localStorage.getItem(localStorage.key(i));
		emailBody = emailBody + "\n" + localstor;
		//csvData.push(str.substring(1,str.length - 3)); //strip off first and last chars [ ]
		}
	
	//send email
	//window.open("mailto:eric.green@uky.edu?subject=BeltProxUpload&body="); // + emailBody);
	window.location.href = "mailto:eric.green@uky.edu?subject=TruckProxUpload&body=" + emailBody;

	//verify email
	
	//ask user if they are sure
	if (confirm('Was the email sent and would you like to delete the local data?')) {
		//remove all data from local storage and listbox
	    localStorage.clear();
		loadSites(); //this will verfify that the localstorage was cleared and clear the dropbown accordingly
		
	} else {
	    // Do nothing!
	}
	
	//console.log("here!");
	//copy all data to clipboard

}

function loadSites(){
	  //load any previous data into listbox for review and edit

	var opt = "";
	
	$("#previousData > option").remove();
		
    for (var i = 0; i < localStorage.length; i++){
		// Create an Option object
		
		// Assign text and value to Option object
		opt = localStorage.key(i);
		//alert(opt);
		//opt.value = Value;
		// Add an Option object to Drop Down/List Box
		$('#previousData')
			.append($("<option></option>")
			.text(opt));
		//alert(localStorage.getItem(localStorage.key(i)));
	 	}
	 	
}

function saveSite(myVal){
//this function saves the site in the event the user changes main form values

		//check for commas
		if(myVal.indexOf(",") > -1)
		{
			alert("Please remove any commas from comments and location!");
			return false;
		}

	    var MyValues = Array();
	    MyValues = getCounts();
	    localStorage[getID()] = JSON.stringify(MyValues);    
	    //alert(MyValues);
	   	//var storedNames = JSON.parse(localStorage[getID()]);
	    //alert(storedNames);
    	//location.reload(); A reload will clear backup!!
    	loadSites();
}

function editSite(){
//this function saves the site in the event the user changes main form values

      	//load previous session and show table
      	var strKey = $('#previousData option:selected').val();
        var strValue = localStorage.getItem(strKey);
        var storedData = JSON.parse(strValue);
	    
	    //populate count data
	 	for (var i = 200; i < 206; i++) {
			//alert(document.getElementById(i.toString()).innerHTML);
			$('#' + i).html(storedData[i]); //not innerHTML?
    	}
	    
	    //populate site data
	    document.forms["Site"]["mysiteID"].value = storedData[6];
    	document.forms["Site"]["myname"].value = storedData[7];
	    document.forms["Site"]["mylocation"].value = storedData[8];
	    document.forms["Site"]["mycomments"].value = storedData[9];
	    document.forms["Site"]["mydate"].value = storedData[10];
	     
}

function removeSite(){
//this function saves the site in the event the user changes main form values

      	//load previous session and show table
      	var strKey = $('#previousData option:selected').val();
        var strValue = localStorage.removeItem(strKey);
        
        //location.reload(); a reload will clear backup!!
        loadSites();
}
function getCounts() {
	//this will store all data into an array
	var MyValues = new Array();
	var myID = "0"; 
	//loop through each button and get count
	
    for (var i = 200; i < 206; i++) {
		//alert(document.getElementById(i.toString()).innerHTML);
		myID = '#' + i;
		MyValues[i] = $(myID).html(); //document.getElementById(i.toString()).innerHTML;
    }
    //add site info too
    MyValues[6] = document.getElementsByName("mysiteID")[0].value; // this doesnt seem to work $("#mysiteID").val();
    MyValues[7] = document.getElementsByName("myname")[0].value; // $('#myname').val();
    MyValues[8] = document.getElementsByName("mylocation")[0].value; // $('#mylocation').val();
    MyValues[9] = document.getElementsByName("mycomments")[0].value; // $('#mycomments').val();
    MyValues[10] = document.getElementsByName("mydate")[0].value; // $('#mydate').val();
    MyValues[11] = "ver 1.0";
    return MyValues;
}

function getID() {
	//generate a unique ID to use as a key
	var a = document.getElementsByName("mysiteID")[0].value; // $('#mysiteID').val();
	var b = document.getElementsByName("myname")[0].value; // $('#myname').val();
	var c = document.getElementsByName("mydate")[0].value; // $('#mydate').val();
	//alert(a);
	return a + '_' + b + '_' + c;
}

function createNewSite() {
  
   	//clear all data
    for (var i = 200; i < 206; i++) {
		//alert(document.getElementById(i.toString()).innerHTML);
		document.getElementById(i.toString()).innerHTML=0;
		//$('#' + i.toString).html(0); //doesnt work???
    }

    document.getElementsByName("mysiteID")[0].value = ""; // this doesnt seem to work $("#mysiteID").val();
    document.getElementsByName("myname")[0].value = ""; // $('#myname').val();
    document.getElementsByName("mylocation")[0].value = ""; // $('#mylocation').val();
    document.getElementsByName("mycomments")[0].value = ""; // $('#mycomments').val();
    document.getElementsByName("mydate")[0].value = ""; // $('#mydate').val();

    document.getElementsByName("mysiteID")[0].disabled = false;
    document.getElementsByName("myname")[0].disabled = false;
  }
  
function startData() {

	//check user's form data
	var x=document.forms["Site"]["mysiteID"].value;
	if (x==null || x=="")
  	{
		alert("Site ID must be filled out!");
  		return false;
  	}
   x=document.forms["Site"]["myname"].value;
	if (x==null || x=="")
  	{
  		alert("Name must be filled out!");
  		return false;
  	}
	  	
  	//set date and time to now if blank
  	//if not blank then that means the user is editing and changing this will change the key
  	if (document.getElementsByName("mydate")[0].value=="")
  	{
  		var today = new Date();
  		document.getElementsByName("mydate")[0].value = today; // $('#mydate').val() = today;
  	}
  	
   //unhide table
   document.querySelector('#datatable').style.display = 'table';
   document.querySelector('#Site').style.display = 'none';
   
   saveSite("ok");
   
    document.getElementsByName("mysiteID")[0].disabled = true;
    document.getElementsByName("myname")[0].disabled = true;
}

function stopData() {
   //this will stop data collection and show main form again
   
   //write end time to uneditable form
   //document.forms["Site"]["mytime"].value;
	
	//rehide table
   document.querySelector('#datatable').style.display = 'none';
   document.querySelector('#Site').style.display = 'block';
   
  }

function exportToCSV() {

	//var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
	//saveAs(blob, "hello world.txt");
	
	// prepare CSV data
	var csvData = new Array();
	csvData.push('"TTwS","TTwoS","Other","uTTwS","uTTwoS","uOther","SiteID","Name","Location","Comments","Date","Ver"');
	
	for (var i = 0; i < localStorage.length; i++){
	var str = localStorage.getItem(localStorage.key(i));
	csvData.push(str.substring(1,str.length - 3)); //strip off first and last chars [ ]
	}
	
	// download stuff
	var buffer = csvData.join("\n");
	var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
	var today = new Date();
	var fileName = today + ".csv";
	
	$(this).attr("href", uri).attr("download", fileName);
	
	var link = document.createElement("a");
	var myBreak = document.createElement("br");
	//if(link.download !== undefined) { // feature detection
	  // Browsers that support HTML5 download attribute
	link.setAttribute("href", uri);
	  //link.setAttribute("download", fileName);
	//}
	//else {
	  // it needs to implement server side export
	  //link.setAttribute("href", "http://www.example.com/export");
	//}
	link.innerHTML = "Backup " + today;
	
	//add link and break
	document.getElementById('Backup').appendChild(link);
	document.getElementById('Backup').appendChild(myBreak);
	
	//document.body.appendChild(link);
	
	//window.open(uri);
	
	//$(this).attr('href', link);
	// link.download();
	
	/*
		var csv = "Abc, DEF, GHI, JKLM";
		alert("tes");
		csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
		
		$(this)
		
		.attr({
		
		'href': csvData,
		
		'target': '_blank'
		
		});
	*/
}

function changecolors() {
    document.body.style.background = "red";
    setInterval(changeBack, 200);
    }

function changeBack() {
	document.body.style.background = "white";
}

