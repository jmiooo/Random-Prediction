/** @jsx React.DOM */
/* jshint ignore:start */

var formatTime = function (oldTime) {
  var time = new Date(oldTime);
  var timeHalf = (time.getHours() > 11 ? ' PM' : ' AM');
  var timeString = (((time.getHours() + 11) % 12) + 1
                    + time.toTimeString().substring(2, 8)
                    + timeHalf);

  return timeString;
}

/*
 * ====================================================================
 * CONTEST TABLES
 * ====================================================================
 */

var Board = React.createClass({
  loadContestsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.loadContestsFromServer();
    setInterval(this.loadContestsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <table id='right' style={{width: '100%'}}>
        <thead>
          <tr>
            <th>Recently Played Stocks</th>
          </tr>
        </thead>

        <ContestRows data={this.state.data} />

      </table>
    );
  }
});

/* jshint ignore:end */