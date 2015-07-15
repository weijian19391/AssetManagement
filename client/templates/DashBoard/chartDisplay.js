
// var myChart = new ReactiveVar(new Chartist.Line());//setting myChart as a local reactive variable instead of a global session
Template.chartDisplay.onCreated(function() {
	this.myChart = new ReactiveVar(new Chartist.Line());
});
Template.chartDisplay.helpers({

	// getInfo: function(){
	// 	var time = [];
	// 	var now = moment().subtract(60,'minutes');
	// 	for (var i = 10 ; i >= 0; i--) {
	// 		time.push((now.add(5,'minutes')).format('hh:mm'));
	// 	}
	// 	var temp = [[1]];
	// 	Meteor.call("checkdata",[temp],function(error, results) {
	     
	//     	temp[0][0] = results.data[0].d.cputemp;
	//       	temp[0][1] = results.data[4].d.cputemp;
	//       		for (var i = 9 ; i <55; i+=5) {
	// 				temp[0].push(results.data[i].d.cputemp);
	// 			}
	// 		Session.set('temp', temp);
	//     });
	//     Session.set('time', time);

	// }
	setSensorType: function(sensorType){
		// console.log("my sensor type is " + sensorType);
		var timeObj; // time stamp from the db
		var numData;
		var interval;
		var dataObjArr;
		var timeArr = [];// the time array that will be used to plot the graph
		if (sensorType === "Ambient Temperature") {
			dataObjArr = Session.get('ambientTemp');
		}

		if (sensorType === "Humidity") {
			dataObjArr = Session.get('humidity');
		}
		// console.log(dataObjArr);
		Session.setPersistent(sensorType+'CurrData', dataObjArr.SensorData);
		console.log(Session.get(sensorType+'CurrData'));
		timeObj = new Date(dataObjArr.timestamp);
		numData = dataObjArr.numData;
		// console.log("number of data is " + numData);
		interval = dataObjArr.interval;
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
		Template.instance().myChart.get().update(data);
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
 		//  	console.log("t is " + t + this.data.sensorType);
	 	// console.log("s is " + s);
	var data = {
	  // A labels array that can contain any sort of values
	  labels: t,
	  // Our series array that contains series objects or in this case series data arrays
	  series: [
	    s
	  ]
	};
// 	var data = {
//   // A labels array that can contain any sort of values
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//   // Our series array that contains series objects or in this case series data arrays
//   series: [
//     [5, 2, 4, 2, 0]
//   ]
// };
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
	      return index % 5  === 0 ? value : null;
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
	// Create a new line chart object where as first parameter we pass in a selector
	// that is resolving to our chart container element. The Second parameter
	// is the actual data object.
	var currid = '#'+this.data.sensorType.replace(/\s+/g, '');
	// console.log(currid);
	// console.log(Template.instance().myChart);
	Template.instance().myChart.set(new Chartist.Line(currid, data, options));

});