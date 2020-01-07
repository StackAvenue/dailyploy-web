import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import moment from "moment";

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    let data = this.props.data;
    let barWidth = this.props.barWidth;
    let seriesData = this.getXData();
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
        max: 24,
        title: {
          text: "Time (In hours)"
        },
        stackLabels: {
          enabled: false,
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
            enabled: true
          },
          showInLegend: false
        },
        series: {
          pointWidth: barWidth,
          pointHeight: "201"
        }
      },
      series: seriesData
    });
  };

  getXData = () => {
    if (this.props.state.daily) {
      return [
        {
          name: "Capacity",
          data: [3, 4, 4, 15, 3, 4, 5],
          color: "#e5e5e5"
        },
        {
          name: "Scheduled",
          data: [2, 2, 3, 3, 2, 2, 3],
          color: "#9b9b9b"
        },
        {
          name: "Worked",
          data: [3, 6, 4, 7, 2, 2, 3],
          color: "#04505e"
        }
      ];
    } else if (this.props.state.weekly) {
      return [
        {
          name: "Capacity",
          data: [3, 4, 4, 15],
          color: "#e5e5e5"
        },
        {
          name: "Scheduled",
          data: [2, 2, 3, 3],
          color: "#9b9b9b"
        },
        {
          name: "Worked",
          data: [3, 6, 4, 7],
          color: "#04505e"
        }
      ];
    } else if (this.props.state.monthly) {
      return [
        {
          name: "Capacity",
          data: [3, 4, 4, 15, 3, 4, 4, 10, 3, 4, 4, 15],
          color: "#e5e5e5"
        },
        {
          name: "Scheduled",
          data: [2, 2, 3, 3, 3, 4, 4, 10, 3, 4, 4, 15],
          color: "#9b9b9b"
        },
        {
          name: "Worked",
          data: [3, 6, 4, 7, 3, 4, 4, 10, 3, 4, 4, 15],
          color: "#04505e"
        }
      ];
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.data != this.props.data) {
      let data = this.props.data;
      let barWidth = this.props.barWidth;

      let seriesData = this.getXData();

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
          max: 24,
          visible: true,
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
              enabled: true
            },
            showInLegend: false
          },
          series: {
            pointWidth: barWidth,
            pointHeight: "201"
          }
        },
        series: seriesData
      });
    }
  };

  render() {
    return <div id="columnChartContainer"></div>;
  }
}

export default ColumnChart;
