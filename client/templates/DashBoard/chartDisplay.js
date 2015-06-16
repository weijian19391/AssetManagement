Template.chartDisplay.helpers({
	getInfo: function(){
		var time = [];
		var now = moment().subtract(60,'minutes');
		for (var i = 10 ; i >= 0; i--) {
			time.push((now.add(5,'minutes')).format('hh:mm'));
		}
		var temp = [[1]];
		Meteor.call("checkdata",[temp],function(error, results) {
	     
	    	temp[0][0] = results.data[0].d.cputemp;
	      	temp[0][1] = results.data[4].d.cputemp;
	      		for (var i = 9 ; i <55; i+=5) {
					temp[0].push(results.data[i].d.cputemp);
				}
			Session.set('temp', temp);
	    });
	    Session.set('time', time);

	}
});
Template.chartDisplay.rendered = function(){
    var t = Session.get('time');
    var s = Session.get('temp');
var data = {
  // A labels array that can contain any sort of values
  labels:t,
  // Our series array that contains series objects or in this case series data arrays
  series: s
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
    showLabel: true
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
var myChart = new Chartist.Line('.ct-chart', data, options);

};