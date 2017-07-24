// Initialize Firebase
  var index = 0;

  var config = {
    apiKey: "AIzaSyANx2eNT575hmMOsw5CVY1w0zpYscay-qU",
    authDomain: "trainproject-8d2fb.firebaseapp.com",
    databaseURL: "https://trainproject-8d2fb.firebaseio.com",
    projectId: "trainproject-8d2fb",
    storageBucket: "",
    messagingSenderId: "533164757715"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#formID").on("submit", function (event) {
  		event.preventDefault();

  		var name = $("#trainName").val().trim();
  		var destination = $("#trainDestination").val().trim();
  		var firstTime = $("#firstTrainTime").val().trim();
  		var frequency = $("#frequency").val().trim();

  		database.ref().push({
  			name: name,
  			destination: destination,
  			firstTime: firstTime,
  			frequency: frequency
  		});

  		return false;
  	});

  database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

  	var updateButton = $("<button>").text("UPDATE").addClass("updateButton").attr("data-index", index);
  	var removeButton = $("<button>").text("REMOVE").addClass("removeButton").attr("data-index", index).attr("data-key", childSnapshot.key);

    var firstTime = childSnapshot.val().firstTime;
    var timeFormat = "HH:mm";
    var convertedTime = moment(firstTime, timeFormat);
    var diffTime = moment().diff(moment().unix(convertedTime), "minutes");
    var timeRemainder = diffTime%childSnapshot.val().frequency;
    var minutes = childSnapshot.val().frequency - timeRemainder;
    var nextArrival = moment().add(minutes, "m").format("hh:mm A");

    if ((moment() - moment(convertedTime)) < 0) {
      nextArrival = childSnapshot.val().firstTime;
    }
    else if ((moment() - moment(convertedTime)) < childSnapshot.val().firstTime) {
      nextArrival = childSnapshot.val().firstTime;
    }
    else {
      nextArrival = moment().add(minutes, "m").format("hh:mm A");
    }

  	var newRow = $("<tr>");
    newRow.addClass("row-" + index);
  	var cell1 = $("<td>").append(updateButton);
  	var cell2 = $("<td>").text(childSnapshot.val().name);
  	var cell3 = $("<td>").text(childSnapshot.val().destination);
  	var cell4 = $("<td>").text(childSnapshot.val().frequency);
  	var cell5 = $("<td>").text(nextArrival);
  	var cell6 = $("<td>").text(minutes);
  	var cell7 = $("<td>").append(removeButton);

  	newRow
	  	.append(cell1)
	  	.append(cell2)
	  	.append(cell3)
	  	.append(cell4)
	  	.append(cell5)
	  	.append(cell6)
	  	.append(cell7);

	 $("#tableContent").append(newRow);

   index++;
  	
  }, function (error) {

  	alert(error.code);

  });

  function removeRow () {
    $(".row-" + $(this).attr("data-index")).remove();
    database.ref().child($(this).attr("data-key")).remove();
  };

  $(document).on("click", ".removeButton", removeRow);