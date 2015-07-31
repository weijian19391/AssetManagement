
Template.chartDisplay.onCreated(function() {
	this.myChart = new ReactiveVar(new Chartist.Line()); // setting mychart as a variable of the template, so that i can reference it to update it later.

	query = {"recordDate": Session.get("todayDate")};
	myUUID = this.data.deviceUUID;
	Session.setPersistent(myUUID+"query", query);
	// console.log(myUUID);
	Meteor.call('publishCollection',myUUID, function(error, result){
	});
	//using package to check if collection exist
	if(!Mongo.Collection.get(this.data.deviceUUID)){
		SensorDatabase = new Meteor.Collection(myUUID);
	}else{
		SensorDatabase = Mongo.Collection.get(myUUID);
	}
	Tracker.autorun(function () {
	  Meteor.subscribe(myUUID, Session.get(myUUID+"query"));
	});
	
	// console.log(SensorDatabase.find().fetch());
});

Template.chartDisplay.helpers({

	getDb: function(){
		// console.log(Images.find());
		console.log(SensorDatabase.find().fetch());
		return SensorDatabase.find();
	},
	getCurrent: function(sensorType){
		return Session.get("RTData" + sensorType);
	},
	setDate: function(){
		var timeCheck = new Date("2015-07-29T10:06:55.531Z");
		var curr_date = timeCheck.getDate();
		var curr_month = timeCheck.getMonth() + 1;
		var curr_year = timeCheck.getFullYear();
		var yearMonthDay = curr_year + '-' +
		                   curr_month + '-' +
		                   curr_date;
		Session.set("todayDate", yearMonthDay);
	},
	setSensorType: function(sensorType){
		// console.log("my sensor type is " + sensorType);
		var timeObj; // time stamp from the db
		var numData;
		var interval;
		var dataArr;
		var timeArr = [];// the time array that will be used to plot the graph
		var currentDoc;
		if(sensorType === "Ambient Temperature") {
			currentDoc = SensorDatabase.find({"SensorType":"ambTemp"}).fetch();//if i don't put .fetch, it returns me the full collection.0
		}else if(sensorType === "Humidity") {
			currentDoc = SensorDatabase.find({"SensorType":"HDCHumidity"}).fetch();//if i don't put .fetch, it returns me the full collection.0
		}else if(sensorType === "Light") {
			currentDoc = SensorDatabase.find({"SensorType":"lux"}).fetch();
		}else if(sensorType === "Battery Temperature") {
			currentDoc = SensorDatabase.find({"SensorType":"battTemp"}).fetch();
		}else if(sensorType === "Air pressure") {
			currentDoc = SensorDatabase.find({"SensorType":"airPressure"}).fetch();
		}else if(sensorType === "Battery Voltage") {
			currentDoc = SensorDatabase.find({"SensorType":"battLvl"}).fetch();
		}else if(sensorType === "gyroX") {
			currentDoc = SensorDatabase.find({"SensorType":"gyroX"}).fetch();
		}else if(sensorType === "gyroY") {
			currentDoc = SensorDatabase.find({"SensorType":"gyroY"}).fetch();
		}else if(sensorType === "gyroZ") {
			currentDoc = SensorDatabase.find({"SensorType":"gyroZ"}).fetch();
		}else if(sensorType === "accX") {
			currentDoc = SensorDatabase.find({"SensorType":"accX"}).fetch();
		}else if(sensorType === "accY") {
			currentDoc = SensorDatabase.find({"SensorType":"accY"}).fetch();
		}else if(sensorType === "accZ") {
			currentDoc = SensorDatabase.find({"SensorType":"accZ"}).fetch();
		}
		// console.log(currentDoc);
		// console.log(sensorType);
		if(currentDoc.length !== 0) {
			// console.log(currentDoc.length);
			interval = currentDoc[0].interval;
			timeObj = new Date(currentDoc[0].timestamp);
			dataArr = currentDoc[0].SensorData;
			numData = currentDoc[0].numData;
			Session.setPersistent("RTData"+sensorType, dataArr[dataArr.length-1]);
			Session.setPersistent("Unit"+sensorType, currentDoc[0].unit);
		}
		// console.log(dataObjArr);
		Session.setPersistent(sensorType+'CurrData', dataArr);
		//console.log(Session.get(sensorType+'CurrData'));
		// console.log("number of data is " + numData);
		// console.log(timeObj.getHours() + ":" + timeObj.getMinutes());
		for (var i=0; i<numData; i++){
			timeObj.setSeconds(timeObj.getSeconds() + interval);
			timeArr.push(timeObj.getHours() + ":" + timeObj.getMinutes());
		}
		Session.setPersistent(sensorType+'time', timeArr);
		// console.log("time in seSetnsorType" + Session.get('time'));
	},
	updateChart: function(sensorType) {
		var t = Session.get(sensorType+'time');
	 	var s = Session.get(sensorType+'CurrData');
	 	// console.log("t is " + t);
	 	// console.log("s is " + s);
		var data = {
		  // A labels array that can contain any sort of values
		  labels: t,
		  // Our series array that contains series objects or in this case series data arrays
		  series: [
		    s
		  ]
		};
		if(s === undefined) {
			console.log("still fetching data from collection");

		}else{
			Template.instance().myChart.get().update(data);			
		}

	},
	//this function is needed because somehow the chartist doesn't play well with spaces in id.
	removeSpace: function(string) {
		return string.replace(/\s+/g, '');
	},
	getUnit: function(sensorType){
		return Session.get("Unit"+sensorType);
	}
});


Template.chartDisplay.onRendered(function(){
	var t = Session.get(this.data.sensorType+'time');
 	var s = Session.get(this.data.sensorType+'CurrData');
	var data = {
	  // A labels array that can contain any sort of values
	  labels: [0,1,2,3,4],
	  // Our series array that contains series objects or in this case series data arrays
	  series: [
	    [0, 0, 0, 0, 0]
	  ]
	};
	var options = {
	  // Don't draw the line chart points
	  showPoint: false,
	  // Disable line smoothing
	  lineSmooth: true,
	  // X-Axis specific configuration
	  updateOnData : true,
	  axisX: {
	    // We can disable the grid for this axis
	    showGrid: true,
	    // and also don't show the label
	    showLabel: true,
	    //this function below allows us to skip labels for the x axis such that we do not display every domination and cluster the x-axis
	    labelInterpolationFnc: function skipLabels(value, index) {
	      return index % 60  === 0 ? value : null;
	    }
	  },
	  // Y-Axis specific configuration
	  axisY: {
	    // Lets offset the chart a bit from the labels
	    offset: 60,
	    // The label interpolation function enables you to modify the values
	    // used for the labels on each axis. Here we are converting the
	    // values into million pound.
	    labelInterpolationFnc: function(value) {
	      return value;
	    }
	  }
	};
	var currid = '#'+this.data.sensorType.replace(/\s+/g, '');
	Template.instance().myChart.set(new Chartist.Line(currid, data, options));

});