
Template.chartDisplay.onCreated(function() {
	this.myChart = new ReactiveVar(new Chartist.Line());

	query = {"recordDate": Session.get("todayDate")};
	myUUID = this.data.deviceUUID;
	console.log(myUUID);
	Meteor.call('publishCollection',myUUID, function(error, result){
	});
	
	// this.subscribe(this.data.deviceUUID);
	//using package to check if collection exist
	if(!Mongo.Collection.get(this.data.deviceUUID)){
		SensorDatabase = new Meteor.Collection(this.data.deviceUUID);
	}else{
		SensorDatabase = Mongo.Collection.get(this.data.deviceUUID);
	}
	Meteor.subscribe(this.data.deviceUUID, query);
	console.log(SensorDatabase.find().fetch());
	// Session.set("tempReady", 0);
	//init the graph
	// Session.setPersistent(this.data.sensorType+'time', [0,0,0,0,0]);
 // 	Session.setPersistent(this.data.sensorType+'CurrData',[0,0,0,0,0]);
 // 	console.log(Session.get(this.data.sensorType+'time'));
 // 	console.log(Session.get(this.data.sensorType+'CurrData'));
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
		var timeCheck = new Date();
		var curr_date = timeCheck.getDate();
		var curr_month = timeCheck.getMonth() + 1;
		var curr_year = timeCheck.getFullYear();
		var dayMonthYear = curr_date + '-' +
		                   curr_month + '-' +
		                   curr_year;
		Session.set("todayDate", dayMonthYear);
	},
	setSensorType: function(sensorType){
		// console.log("my sensor type is " + sensorType);
		var timeObj; // time stamp from the db
		var numData;
		var interval;
		var dataArr;
		var timeArr = [];// the time array that will be used to plot the graph
		if (sensorType === "Ambient Temperature") {
			ambTempDoc = SensorDatabase.find({"SensorType":"ambTemp"}).fetch();//if i don't put .fetch, it returns me the full collection.0
			console.log(ambTempDoc);
			if(ambTempDoc.length !== 0) {
				Session.set("tempReady", 1);
				console.log(ambTempDoc.length);
				interval = ambTempDoc[0].interval;
				timeObj = new Date(ambTempDoc[0].timestamp);
				dataArr = ambTempDoc[0].SensorData;
				numData = ambTempDoc[0].numData;
				Session.set("RTData"+sensorType, dataArr[dataArr.length-1]);
			}
		}

		if (sensorType === "Humidity") {
			humidityDoc = SensorDatabase.find({"SensorType":"HDCHumidity"}).fetch();//if i don't put .fetch, it returns me the full collection.0
			console.log(humidityDoc);
			if(humidityDoc.length !== 0) {
				console.log(humidityDoc.length);
				interval = humidityDoc[0].interval;
				timeObj = new Date(humidityDoc[0].timestamp);
				dataArr = humidityDoc[0].SensorData;
				numData = humidityDoc[0].numData;
				Session.set("RTData"+sensorType, dataArr[dataArr.length-1]);
			}
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
			console.log("inside s undefined");

		}else{
			Template.instance().myChart.get().update(data);			
		}

		// console.log(myChart.get());
	},
	//this function is needed because somehow the chartist doesn't play well with spaces in id.
	removeSpace: function(string) {
		return string.replace(/\s+/g, '');
	}
});


Template.chartDisplay.onRendered(function(){
	var t = Session.get(this.data.sensorType+'time');
 	var s = Session.get(this.data.sensorType+'CurrData');
 // 	console.log("t is " + t + this.data.sensorType);
	// console.log("s is " + s);
	// if (!s) {
	// 	console.log("inside not t");
	// 	t = [0,1,2,3,4];
	// 	s = [0,0,0,0,0];
	// }
	//  	console.log("t is " + t + this.data.sensorType);
	// console.log("s is " + s);

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
	  showPoint: true,
	  // Disable line smoothing
	  lineSmooth: false,
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
	
	// console.log(currid);
	// console.log(Template.instance().myChart);
	Template.instance().myChart.set(new Chartist.Line(currid, data, options));

});