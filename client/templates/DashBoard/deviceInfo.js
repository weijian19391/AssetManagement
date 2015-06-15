Template.deviceInfo.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('devices', Router.current().params._id);
  }.bind(this));
};

Template.deviceInfo.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.deviceInfo.helpers({
  device: function () {
    return Devices.findOne({_id: Router.current().params._id});
  },
  getData: function(){
    Meteor.call("checkdata", function(error, results) {
      Session.set('data', JSON.parse(results.content).d);
    });
    return (Session.get('data'));
  },
  topGenresChart: function() {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: Meteor.user() + "'s top genres"
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            },
            connectorColor: 'silver'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'genre',
        data: [
          ['Adventure',   45.0],
          ['Action',       26.8],
          ['Ecchi',   12.8],
          ['Comedy',    8.5],
          ['Yuri',     6.2]
        ]
      }]
    };
  }
});

Template.registerHelper('equals', function (a, b) {
      return a === b;
});
//device_viewers is an array of objects,each array consists of email property
Template.registerHelper('viewOnly', function (device_viewers) {
  var length = 0;
  if (device_viewers)
    size = device_viewers.length;
  else
    return false;
  for (var i = size - 1; i >= 0; i--) {
    if (device_viewers[i].email === Meteor.user().emails[0].address)
      return true;
  }
  return false;
});

