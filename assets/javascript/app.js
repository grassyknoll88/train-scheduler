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
var currentTime = moment();

database.ref().on("child_added", function(childSnap) {

    var name = childSnap.val().name;
    var destination = childSnap.val().destination;
    var firstTrain = childSnap.val().firstTrain;
    var frequency = childSnap.val().frequency;
    var min = childSnap.val().min;
    var next = childSnap.val().next;

    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

database.ref().on("value", function(snapshot) {
   

});

//retrieves info from the form
$("#addTrainBtn").on("click", function() {

    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#timeInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    //makes sure that each input has a value
    if (trainName == "") {
        alert("Enter a train name.");
        return false;
    }
    if (destination == "") {
        alert("Enter a destination.");
        return false;
    }
    if (firstTrain == "") {
        alert("Enter a train time.");
        return false;
    }
    if (frequency == "") {
        alert("Enter a frequency");
        return false;
    }

    // Here is the math for the scheduler
    //subtracts the first train time back a year to ensure it's before current time.
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    // the time difference between current time and the first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");

    return false;
});