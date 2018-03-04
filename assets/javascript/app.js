$(function(){
//initialize firebase
var config = {
	apiKey: "AIzaSyBJHm31MuAR_du8U2vMzVCdNb0jqMCVBu4",
	authDomain: "train-scheduler-ku.firebaseapp.com",
	databaseURL: "https://train-scheduler-ku.firebaseio.com",
	projectId: "train-scheduler-ku",
	storageBucket: "train-scheduler-ku.appspot.com",
	messagingSenderId: "401502931969"
};
firebase.initializeApp(config);

var database = firebase.database();




//retrieves info from the form
$("#addTrainBtn").on("click", function () {
	event.preventDefault();

	var name = $("#trainNameInput").val().trim();
	var destination = $("#destinationInput").val().trim();
	var firstTrain = $("#timeInput").val().trim();
	var frequency = $("#frequencyInput").val().trim();

	//makes sure that each input has a value
	if (name == "") {
		alert("Enter a train name.");
		return false;
	}
	if (destination == "") {
		alert("Enter a destination.");
		return false;
	}
	if (firstTrain == "") {
		alert("Enter a train departure time.");
		return false;
	}
	if (frequency == "") {
		alert("Enter a frequency");
		return false;
	}

	database.ref().push({
		name: name,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	});

	
});

	database.ref().on("child_added", function (snapshot) {

		var name = snapshot.val().name;
		var destination = snapshot.val().destination;
		var firstTrain = snapshot.val().firstTrain;
		var frequency = snapshot.val().frequency;
		var minUntilTrain = snapshot.val().minUntilTrain;
		var nextArrival = snapshot.val().nextArrival;
		var tr = $("<tr>");
		$("tbody").append(tr);
		tr.append("<td>" + name + "</td>");
		tr.append("<td>" + destination + "</td>");
		tr.append("<td>" + frequency + "</td>");

	
	// Here is the math for the scheduler
	//subtracts the first train time back a year to ensure it's before current time.
	var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
	var currentTime = moment();
	// the time difference between current time and the first train
	var difference = moment().diff(moment(firstTrainConverted), "minutes");
	var remainder = difference % frequency;
	var minUntilTrain = frequency - remainder;
	moment(minUntilTrain).minutes();
	var nextArrival = moment().add(minUntilTrain, "minutes").format("hh:mm a");
	tr.append("<td>" + nextArrival + "</td>");
	tr.append("<td>" + minUntilTrain + "</td>");



	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#timeInput").val("");
	$("#frequencyInput").val("");

	return false;
});


 });