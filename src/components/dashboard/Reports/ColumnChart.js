import React, { Component } from "react";
import Highcharts from "highcharts/highstock";

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    let data = this.props.data;
    Highcharts.chart("columnChartContainer", {
      chart: {
        type: "column",
        height: 202
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: data
      },
      yAxis: {
        // min: 0,
        title: {
          text: "Time (In hours)"
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color:
              // theme
              (Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color) ||
              "gray"
          }
        }
      },
      legend: {
        showInLegend: false,
        align: "right",
        x: -30,
        verticalAlign: "top",
        y: 25,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || "white",
        borderColor: "#CCC",
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false
          },
          showInLegend: false
        },
        series: {
          pointWidth: "14",
          pointHeight: "201"
        }
      },
      series: [
        {
          name: "Worked",
          data: [5, 3, 4, 7, 2, 5, 6]
        },
        {
          name: "Scheduled",
          data: [2, 2, 3, 2, 1, 2, 4]
        },
        {
          name: "Capacity",
          data: [3, 4, 4, 2, 5, 6, 3]
        }
      ]
    });
  };
  render() {
    return <div id="columnChartContainer"></div>;
  }
}

export default ColumnChart;
