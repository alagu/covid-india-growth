$(document).ready(function(){
  let rate = []
  let total = 0;
  $.get("https://api.covid19india.org/data.json", function(response){
    let history = response.cases_time_series;
    console.log(history);
    history.forEach(function(data, index) {
      if (index == 0) { 
        total = total + parseInt(data['dailyconfirmed'])
        rate.push({
          rate: 1,
          current: 0,
          past: 0,
          date: data.date
        }); 
        return;
      }
      
      var rate_calc = (100*parseInt(data['dailyconfirmed'])/total).toFixed(2);
      total = parseInt(total) + parseInt(data['dailyconfirmed'])
      
      rate.push({
          rate: rate_calc,
          current: total,
          past: (total - data['dailyconfirmed']),
          date: data.date
        }
      )
      
    })
    
    let last = rate.length - 1;
    rate[last]['current'] = parseInt(response['statewise'][0]['confirmed']);
    rate[last]['past'] = rate[last-1]['current']
    rate[last]['rate'] = (100*(rate[last]['current'] - rate[last]['past'])/(rate[last]['past'])).toFixed(2);
    
    console.log(rate);
    
    $("#today-growth").html(rate[last]['rate'])
    $("#today-cases").html(rate[last]['current'])
    $("#yesterday-growth").html(rate[last-1]['rate'])
    $("#yesterday-cases").html(rate[last-1]['current'])
    
    var rate_7_day_sum = 0.0;
    for (var i = rate.length - 2; i >= rate.length - 8; i--) {
      rate_7_day_sum = rate_7_day_sum + parseFloat(rate[i]['rate']);
      console.log("i=" + i)
      console.log("rate = " + rate[i]['rate']);
      console.log("sum = " + rate_7_day_sum)
    }
    
    let rate_7_day_avg = (rate_7_day_sum/7)
    
    $("#7-day-avg").html(rate_7_day_avg.toFixed(2));
    
    var ctx = $('#growth-trends');
    var labels = rate.map(function(x) { return x['date']}).slice(last - 20, last+1);
    var graph_rate_data = rate.map(function(x) { return x['rate']}).slice(last - 20, last+1);
    
    
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      backgroundColor: "#3e95cd",
      datasets: [{
          label: "% growth",
          data: graph_rate_data
      }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

    // let today = response.data[response.data.length - 1];
    // console.log(today);
  });
})
