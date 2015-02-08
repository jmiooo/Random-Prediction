function getInfo() {
  $.ajax({
    url: '/getInfo',
    type: 'GET',
    success: function (data) {
      clearTimeout(currentTimeout);
      currentTimeout = null;
      currentData = data.data[0].securityData;
      createGraph(currentData.fieldData.slice(0, 100));

      position = 0;
      pureMoney = 10000;
      console.log(1010);

      $('#buy-exit-short').html('Buy').css('color', 'black');
      $('#short-sell') .html('Short').css('color', 'black');

      $('#position').html('Shares: ' + (Math.floor(position * 100) / 100).toString());
      $('#money').html('Portfolio: $' + (Math.floor((pureMoney + position * price) * 100) / 100).toString());
      $('#price').html('Share Price: $' + price.toString());

      $('#transactions-body').html('');
      $('#stock-info').html('');
    }
  });
}

$('#buy-exit-short').click(function (event) {
  if (position <= 0) {
    if (position < 0) {
      pureMoney += position * price;
      position = 0;

      $('#buy-exit-short').html('Buy');
      $('#short-sell').css('color', 'black');
      updateTransactions('exited short');
    }
    else {
      position = pureMoney / price;
      pureMoney = 0;

      $('#buy-exit-short').css('color', 'gray');
      $('#short-sell').html('Sell');
      updateTransactions('bought');
    }

    $('#position').html('Shares: ' + (Math.floor(position * 100) / 100).toString());
    $('#money').html('Portfolio: $' + (Math.floor((pureMoney + position * price) * 100) / 100).toString());
  }
});

$('#short-sell').click(function (event) {
  if (position >= 0) {
    if (position === 0) {
      position = -(pureMoney / price);
      pureMoney = 2 * pureMoney;

      $('#buy-exit-short').html('Exit Short');
      $('#short-sell').css('color', 'gray');
      updateTransactions('shorted');
    }
    else {
      pureMoney += position * price
      position = 0

      $('#buy-exit-short').css('color', 'black');
      $('#short-sell').html('Short');
      updateTransactions('sold');
    }

    $('#position').html('Shares: ' + (Math.floor(position * 100) / 100).toString());
    $('#money').html('Portfolio: $' + (Math.floor((pureMoney + position * price) * 100) / 100).toString());
  }
});

$('#start-stop').click(function (event) {
  if (started) {
    started = false;
    $('#start-stop').html('Start');
  }
  else {
    started = true;
    $('#start-stop').html('Stop');
  }
});

$('#submit').click(function (event) {
  var chart = $("#container").highcharts();
  var series = chart.series[0];

  var name = $('#name').val();
  var fullMoney = pureMoney + position * price;
  var startDate = new Date(currentData.fieldData[0].date).toDateString();
  var endDate = new Date(currentData.fieldData[series.data.length - 1].date).toDateString();
  var result = (name
             + ' made '
             + (Math.floor(fullMoney - 10000) / 100).toString()
             + '% profit by trading in '
             + currentData.security
             + ' from '
             + startDate
             + ' to '
             + endDate
             + '.');
  $.ajax({
    url: '/submit',
    type: 'POST',
    data: { score: result },
    success: function (data) {
      started = false;
      $('#start-stop').html('Start');
      getInfo();
    }
  });
});

$('#load').click(function (event) {
  started = false;
  $('#start-stop').html('Start');
  getInfo();
});

$('#time-lapse').click(function (event) {
  if (!started) {
    var chart = $("#container").highcharts();
    var series = chart.series[0];
    var fieldData = currentData.fieldData;
    var index, x, y;

    if (series.data.length < fieldData.length) {
      updateStep(series, fieldData);
    }
    else {
      showStock();
    }
  }
});

function setRepeat2(func, interval) {
  var callback = function (err) {
    if (err) {
      console.log(err);
    }
    setRepeat2(func, interval);
  }

  setTimeout(function () {
    func(callback);
  }, interval);
}

function updateBoard(callback) {
  $.ajax({
    url: '/getBoard',
    type: 'GET',
    success: function (data) {
      /*clearTimeout(currentTimeout);
      currentTimeout = null;
      currentData = data.data[0].securityData;
      createGraph(currentData.fieldData.slice(0, 30));

      var position = 0;
      var pureMoney = 10000;

      $('#buy-exit-short').html('Buy').css('color', 'black');
      $('#short-sell').html('Short').css('color', 'black');

      $('#position').html('Shares: ' + position.toString());
      $('#money').html('Portfolio: $' + (pureMoney + position * price).toString());
      $('#price').html('Share Price: $' + price.toString());*/
      var rowNum = Math.min(10, data.scores.length);
      var rows = '';
      var color = '';

      for (var i = 0; i < rowNum; i++) {
        if (data.scores[i].indexOf('-') >= 0) {
          color = 'red';
        }
        else {
          color = 'black';
        }
        if (i % 2 === 0) {
          rows += ('<tr><td style="color:' + color + '">' + data.scores[i] + '</td></tr>');
        }
        else {
          rows += ('<tr class="alt"><td style="color:' + color + '">' + data.scores[i] + '</td></tr>');
        }
      }
      $('#board-body').html(rows);
      callback(null);
    }
  });
}

setRepeat2(updateBoard, 2000);

function updateTransactions(action) {
  var chart = $("#container").highcharts();
  var series = chart.series[0];
  var date = new Date(currentData.fieldData[series.data.length - 1].date).toDateString();
  var priceString = (Math.floor(price * 100) / 100).toString()
  var current = '<tr><td>On ' + date + ', ' + action + ' at $' + priceString + '.</td></tr>'
  var previous = $('#transactions-body').html();
  $('#transactions-body').html(current + previous);
}