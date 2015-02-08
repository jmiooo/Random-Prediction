var currentData = {};
var started = false;
var currentTimeout = null;

var position = 0;
var pureMoney = 10000;
var price = 0;

//real time updates query database every few seconds

function updateStep(series, fieldData) {
  var index = series.data.length;
  var x = (new Date(fieldData[index].date)).getTime();
  var y = fieldData[index].OPEN;
  series.addPoint([x, y], true, false);

  $('#money').html('Portfolio: $' + (Math.floor((pureMoney + position * y) * 100) / 100).toString());
  $('#price').html('Share Price: $' + y.toString());
  price = y;
}

function showStock() {
  var startDate = new Date(currentData.fieldData[0].date).toDateString();
  var endDate = new Date(currentData.fieldData[currentData.fieldData.length - 1].date).toDateString();
  $('#stock-info').html('Stock is '
                      + currentData.security
                      + ', shown from '
                      + startDate
                      + ' to '
                      + endDate
                      + '.');
}

//real time updates
function update() {
  var chart = $("#container").highcharts();
  var series = chart.series[0];
  var fieldData = currentData.fieldData;

  return function (callback) {
    if (series.data.length < fieldData.length) {
      if (started) {
        updateStep(series, fieldData);
      }

      callback(null);
    }
    else {
      showStock();
    }
  }
}

//initialize series
function loadData(initdata) {
  var series = [];
  var x;
  var y;
  //do stuff with initialization
  var time = (new Date()).getTime();
  for (var i = 0; i !== initdata.length; ++i) {
    x = (new Date(initdata[i].date)).getTime();
    y = initdata[i].OPEN;
    series.push([x, y]);
  }
  price = y;
  return series;
}

var zoom = [
{
  count: 3,
  type: 'month',
  text: '3m'
}, {
  count: 6,
  type: 'month',
  text: '6m'
}, {
  count: 1,
  type: 'year',
  text: '1y'
}, {
  type: 'all',
  text: 'All'
}];

var chartFormatter = {
  style: {
    fontFamily: "'Unica One', sans-serif"
  },
  plotBorderColor: '#FFFFF',
  events : {
    load : function () {}
  }
};

function setRepeat(func, interval) {
  var callback = function (err) {
    if (err) {
      console.log(err);
    }
    setRepeat(func, interval);
  }

  currentTimeout = setTimeout(function () {
    func(callback);
  }, interval);
}

function createGraph(initdata) {
  // Create the chart
  // 
  chartFormatter.events.load = function () {
    var scopedUpdate = update();
    setRepeat(scopedUpdate, 200);
  }

  $('#container').highcharts('StockChart', {

    chart : chartFormatter,

    credits: {
      enabled: false
    },

    rangeSelector: {
      buttons: zoom,
      inputEnabled: true,
      selected: 0
    },

    title : {
      text : 'Stock value over time'
    },

    plotOptions: {
      series: {
        animation: false
      }
    },

    exporting: {
      enabled: false
    },

    series : [{
      name : 'Stock Value',
      color: '#000000',
      data : loadData(initdata)
    }]
  });
}

Highcharts.createElement('link', {
   href: '//fonts.googleapis.com/css?family=Signika:400,700',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
   proceed.call(this);
   this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
});


Highcharts.theme = {
   colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: null,
      style: {
         fontFamily: "Signika, serif"
      }
   },
   title: {
      style: {
         color: 'black',
         fontSize: '16px',
         fontWeight: 'bold'
      }
   },
   subtitle: {
      style: {
         color: 'black'
      }
   },
   tooltip: {
      borderWidth: 0
   },
   legend: {
      itemStyle: {
         fontWeight: 'bold',
         fontSize: '13px'
      }
   },
   xAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   yAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   plotOptions: {
      series: {
         shadow: true
      },
      candlestick: {
         lineColor: '#404048'
      },
      map: {
         shadow: false
      }
   },

   // Highstock specific
   navigator: {
      xAxis: {
         gridLineColor: '#D0D0D8'
      }
   },
   rangeSelector: {
      buttonTheme: {
         fill: 'white',
         stroke: '#C0C0C8',
         'stroke-width': 1,
         states: {
            select: {
               fill: '#D0D0D8'
            }
         }
      }
   },
   scrollbar: {
      trackBorderColor: '#C0C0C8'
   },

   // General
   background2: '#E0E0E8'
   
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

$(function() {
  //high charts below
  Highcharts.setOptions({
    global : {
      useUTC : false
    }
  });

  getInfo();
});