import React, { Component } from "react";
import Highcharts, { Color } from "highcharts/highstock";
import moment from "moment";
import { CHART_COLOR } from "./../../../utils/Constants";

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    let data = this.props.data;
    let barWidth = this.props.barWidth;
    let activeBar = this.props.activeBar;
    let seriesData = this.getXData();
    Highcharts.chart("columnChartContainer", {
      chart: {
        type: "column",
        height: 202
      },
      credits: {
        enabled: false
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: data,
        labels: {
          formatter() {
            if (this.value.activeBar === activeBar) {
              return `<b style="font-weight: bold; color: ${CHART_COLOR.active_color}">${this.value.name}</b>`;
            } else {
              return `<span>${this.value.name}</span>`;
            }
          }
        }
      },
      yAxis: {
        max: 24,
        title: {
          text: "Time (In hours)"
        },
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: "bold"
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
        headerFormat: "",
        pointFormat:
          "{series.name}: {point.y} hours<br/>Total: {point.stackTotal} hours"
      },
      plotOptions: {
        column: {
          stacking: "normal",
          showInLegend: false
        },
        series: {
          pointWidth: barWidth,
          pointHeight: "201",
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.worked_0],
              [1, CHART_COLOR.worked_1]
            ]
          }
        }
      },
      series: seriesData
    });
  };

  sortData = () => {
    return this.props.columnChartData.sort((a, b) => (a.id > b.id ? 1 : -1));
  };

  getScheduledDataLabel = (y, time) => {
    return {
      y: y,
      dataLabels: {
        formatter: function() {
          return "<b>" + time + " hours</b>";
        },
        enabled: true,
        style: {
          borderRadius: 5,
          fontSize: 10,
          backgroundColor: "rgba(252, 255, 255, 0.7)",
          borderWidth: 1,
          color: "#0075d9",
          borderColor: "rgba(252, 255, 255, 0.7)"
        }
      }
    };
  };

  getWorkedDataLabel = (y, time) => {
    return {
      y: y,
      dataLabels: {
        formatter: function() {
          return "<b>" + time + " hours</b>";
        },
        enabled: true,
        style: {
          borderRadius: 5,
          fontSize: 10,
          backgroundColor: "rgba(252, 255, 255, 0.7)",
          borderWidth: 1,
          color: "#0075d9",
          borderColor: "rgba(252, 255, 255, 0.7)"
        }
      },
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, CHART_COLOR.curr_worked_0],
          [1, CHART_COLOR.curr_worked_1]
        ]
      }
    };
  };

  secondsToHours = seconds => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2);
  };

  getXData = () => {
    var newSortedData = this.sortData();
    if (this.props.state.daily) {
      var dailyScheduled = [];
      var dailyWorked = [];
      newSortedData.map(option => {
        if (option.totalEstimateTime && option.trackedTime != 0) {
          let sched = option.totalEstimateTime - option.trackedTime;
          if (option.activeBar == this.props.activeBar) {
            dailyScheduled.push(
              this.getScheduledDataLabel(sched, this.secondsToHours(sched))
            );
            dailyWorked.push(
              this.getWorkedDataLabel(
                option.trackedTime,
                this.secondsToHours(option.trackedTime)
              )
            );
          } else {
            dailyWorked.push(sched);
            dailyWorked.push(option.trackedTime);
          }
        } else {
          dailyScheduled.push(0);
          dailyWorked.push(0);
        }
      });
      return [
        {
          name: "Scheduled",
          data: dailyScheduled,
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: dailyWorked,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.curr_worked_0],
              [1, CHART_COLOR.curr_worked_1]
            ]
          }
        }
      ];
    } else if (this.props.state.weekly) {
      var weeklyScheduled = [];
      var weeklyWorked = [];
      newSortedData.map(option => {
        if (option.totalEstimateTime && option.trackedTime != 0) {
          let sched = option.totalEstimateTime - option.trackedTime;
          if (option.activeBar == this.props.activeBar) {
            weeklyScheduled.push(
              this.getScheduledDataLabel(sched, this.secondsToHours(sched))
            );
            weeklyWorked.push(
              this.getWorkedDataLabel(
                option.trackedTime,
                this.secondsToHours(option.trackedTime)
              )
            );
          } else {
            weeklyScheduled.push(sched);
            weeklyWorked.push(option.trackedTime);
          }
        } else {
          weeklyScheduled.push(0);
          weeklyWorked.push(0);
        }
      });
      return [
        {
          name: "Scheduled",
          data: weeklyScheduled,
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: weeklyWorked,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.curr_worked_0],
              [1, CHART_COLOR.curr_worked_1]
            ]
          }
        }
      ];
    } else if (this.props.state.monthly) {
      var monthlyScheduled = [];
      var monthlyWorked = [];
      newSortedData.map(option => {
        if (option.totalEstimateTime && option.trackedTime != 0) {
          let sched = option.totalEstimateTime - option.trackedTime;
          if (option.activeBar == this.props.activeBar) {
            monthlyScheduled.push(
              this.getScheduledDataLabel(sched, this.secondsToHours(sched))
            );
            monthlyWorked.push(
              this.getWorkedDataLabel(
                option.trackedTime,
                this.secondsToHours(option.trackedTime)
              )
            );
          } else {
            monthlyScheduled.push(sched);
            monthlyWorked.push(option.trackedTime);
          }
        } else {
          monthlyScheduled.push(0);
          monthlyWorked.push(0);
        }
      });
      return [
        {
          name: "Scheduled",
          data: monthlyScheduled,
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: monthlyWorked,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.curr_worked_0],
              [1, CHART_COLOR.curr_worked_1]
            ]
          }
        }
      ];
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.data != this.props.data ||
      prevProps.columnChartData != this.props.columnChartData
    ) {
      let data = this.props.data;
      let barWidth = this.props.barWidth;
      let activeBar = this.props.activeBar;
      let seriesData = this.getXData();

      Highcharts.chart("columnChartContainer", {
        chart: {
          type: "column",
          height: 202
        },
        credits: {
          enabled: false
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: data,
          labels: {
            formatter() {
              if (this.value.activeBar === activeBar) {
                return `<b style="font-weight: bold; color: ${CHART_COLOR.active_color}">${this.value.name}</b>`;
              } else {
                return `<span>${this.value.name}</span>`;
              }
            }
          }
        },
        yAxis: {
          max: 24,
          visible: true,
          title: {
            text: "Time (In hours)"
          },
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: "bold"
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
          headerFormat: "",
          pointFormat:
            "{series.name}: {point.y} hours<br/>Total: {point.stackTotal} hours"
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: false,
              distance: -10,
              style: {
                fontWeight: "bold",
                color: "white"
              }
            },
            showInLegend: false
          },
          series: {
            pointWidth: barWidth,
            pointHeight: "201",
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, CHART_COLOR.worked_0],
                [1, CHART_COLOR.worked_1]
              ]
            }
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
