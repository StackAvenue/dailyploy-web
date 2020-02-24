import React, { Component } from "react";
import Highcharts, { Color } from "highcharts/highstock";
import moment from "moment";
import { CHART_COLOR } from "./../../../utils/Constants";

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidMount = () => {
  //   let data = this.props.data;
  //   let barWidth = this.props.barWidth;
  //   let activeBar = this.props.activeBar;
  //   let seriesData = this.getXData();
  //   Highcharts.chart("columnChartContainer", {
  //     chart: {
  //       type: "column",
  //       height: 202
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: ""
  //     },
  //     xAxis: {
  //       categories: data,
  //       labels: {
  //         formatter() {
  //           if (this.value.activeBar === activeBar) {
  //             return `<b style="font-weight: bold; color: ${CHART_COLOR.active_color}">${this.value.name}</b>`;
  //           } else {
  //             return `<span>${this.value.name}</span>`;
  //           }
  //         }
  //       }
  //     },
  //     yAxis: {
  //       max: 24,
  //       title: {
  //         text: "Time (In hours)"
  //       },
  //       labels: {
  //         enabled: false
  //       }
  //     },
  //     legend: {
  //       showInLegend: false,
  //       align: "right",
  //       x: -30,
  //       verticalAlign: "top",
  //       y: 25,
  //       floating: true,
  //       backgroundColor:
  //         Highcharts.defaultOptions.legend.backgroundColor || "white",
  //       borderColor: "#CCC",
  //       borderWidth: 1,
  //       shadow: false
  //     },
  //     tooltip: {
  //       headerFormat: "",
  //       pointFormat:
  //         "{series.name}: {point.y} hours<br/>Total: {point.stackTotal} hours"
  //     },
  //     plotOptions: {
  //       column: {
  //         stacking: "normal",
  //         showInLegend: false
  //       },
  //       series: {
  //         pointWidth: barWidth,
  //         pointHeight: "201",
  //         color: {
  //           linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
  //           stops: [
  //             [0, CHART_COLOR.worked_0],
  //             [1, CHART_COLOR.worked_1]
  //           ]
  //         }
  //       }
  //     },
  //     series: seriesData
  //   });
  // };

  sortData = () => {
    return this.props.columnChartData.sort((a, b) => (a.id > b.id ? 1 : -1));
  };

  getScheduledDataLabel = (y, time, total) => {
    if (y != 0) {
      return {
        y: y,
        time: time,
        totalTime: total,
        dataLabels: {
          formatter: function() {
            return "<b>" + time + " hours</b>";
          },
          enabled: true,
          style: {
            fontSize: 10,
            borderWidth: 1,
            color: "#0075d9"
          }
        }
      };
    }
    return null;
  };

  getWorkedDataLabel = (y, time, total) => {
    return {
      y: y,
      time: time,
      totalTime: total,
      dataLabels: {
        formatter: function() {
          return "<b>" + time + " hours</b>";
        },
        enabled: true,
        style: {
          borderRadius: 5,
          fontSize: 10,
          color: "#0075d9"
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

  getExtremeWorkedDataLabel = (y, time, total) => {
    return {
      y: y,
      time: time,
      totalTime: total,
      dataLabels: {
        formatter: function() {
          return "<b>" + time + " hours</b>";
        },
        enabled: false,
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
          [0, CHART_COLOR.ext_worked_0],
          [1, CHART_COLOR.ext_worked_1]
        ]
      }
    };
  };

  getCurrExtremeWorkedDataLabel = (y, time, total) => {
    return {
      y: y,
      time: time,
      totalTime: total,
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
          [0, CHART_COLOR.curr_ext_worked_0],
          [1, CHART_COLOR.curr_ext_worked_1]
        ]
      }
    };
  };

  secondsToHours = seconds => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return (
      ("0" + h).slice(`${h}`.length > 2 ? -3 : -2) + ":" + ("0" + m).slice(-2)
    );
  };

  getPercentageData = (totalTime, trackedTime) => {
    return (((trackedTime / totalTime) * 100) / 100) * 30;
  };

  getXData = () => {
    var newSortedData = this.sortData();
    if (this.props.state.daily) {
      var dailyScheduled = [];
      var dailyWorked = [];
      newSortedData.map(option => {
        if (option.totalEstimateTime != null && option.trackedTime >= 0) {
          var total = this.secondsToHours(option.totalEstimateTime);
          if (option.totalEstimateTime >= option.trackedTime) {
            var scheduleDiff = option.totalEstimateTime - option.trackedTime;
            var work = this.getPercentageData(
              option.totalEstimateTime,
              option.trackedTime
            );
            var schedule = this.getPercentageData(
              option.totalEstimateTime,
              scheduleDiff
            );
            if (option.activeBar == this.props.activeBar) {
              dailyScheduled.push(
                this.getScheduledDataLabel(
                  schedule,
                  this.secondsToHours(scheduleDiff),
                  total
                )
              );
              dailyWorked.push(
                this.getWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            } else {
              dailyScheduled.push({
                y: schedule,
                time: this.secondsToHours(scheduleDiff),
                totalTime: total
              });
              dailyWorked.push({
                y: work,
                time: this.secondsToHours(option.trackedTime),
                totalTime: total
              });
            }
          } else {
            var schedule = null;
            var work = 30;
            var scheduleDiff = null;
            if (option.activeBar == this.props.activeBar) {
              dailyScheduled.push(null);
              dailyWorked.push(
                this.getCurrExtremeWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            } else {
              dailyScheduled.push({
                y: schedule,
                time: this.secondsToHours(scheduleDiff),
                totalTime: total
              });
              dailyWorked.push(
                this.getExtremeWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            }
          }
        } else {
          dailyScheduled.push(null);
          dailyWorked.push(null);
        }
      });
      return [
        {
          name: "Remaining Capacity",
          data: dailyScheduled,
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: dailyWorked,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.worked_0],
              [1, CHART_COLOR.worked_1]
            ]
          }
        }
      ];
    } else if (this.props.state.weekly) {
      var weeklyScheduled = [];
      var weeklyWorked = [];
      newSortedData.map(option => {
        if (option.totalEstimateTime && option.trackedTime >= 0) {
          var total = this.secondsToHours(option.totalEstimateTime);
          if (option.totalEstimateTime >= option.trackedTime) {
            var scheduleDiff = option.totalEstimateTime - option.trackedTime;
            var work = this.getPercentageData(
              option.totalEstimateTime,
              option.trackedTime
            );
            var schedule = this.getPercentageData(
              option.totalEstimateTime,
              scheduleDiff
            );
            if (option.activeBar == this.props.activeBar) {
              weeklyScheduled.push(
                this.getScheduledDataLabel(
                  schedule,
                  this.secondsToHours(scheduleDiff),
                  total
                )
              );
              weeklyWorked.push(
                this.getWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            } else {
              weeklyScheduled.push({
                y: schedule,
                time: this.secondsToHours(scheduleDiff),
                totalTime: total
              });
              weeklyWorked.push({
                y: work,
                time: this.secondsToHours(option.trackedTime),
                totalTime: total
              });
            }
          } else {
            var schedule = null;
            var work = 30;
            var scheduleDiff = null;
            if (option.activeBar == this.props.activeBar) {
              weeklyScheduled.push(
                this.getScheduledDataLabel(
                  schedule,
                  this.secondsToHours(scheduleDiff),
                  total
                )
              );
              weeklyWorked.push(
                this.getCurrExtremeWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            } else {
              weeklyScheduled.push({
                y: schedule,
                time: this.secondsToHours(scheduleDiff),
                totalTime: total
              });
              weeklyWorked.push(
                this.getExtremeWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            }
          }
        } else {
          weeklyScheduled.push(null);
          weeklyWorked.push(null);
        }
      });
      return [
        {
          name: "Remaining Capacity",
          data: weeklyScheduled,
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: weeklyWorked,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.worked_0],
              [1, CHART_COLOR.worked_1]
            ]
          }
        }
      ];
    } else if (this.props.state.monthly) {
      var monthlyScheduled = [];
      var monthlyWorked = [];
      newSortedData.map(option => {
        if (option.totalEstimateTime && option.trackedTime >= 0) {
          var total = this.secondsToHours(option.totalEstimateTime);
          if (option.totalEstimateTime >= option.trackedTime) {
            var scheduleDiff = option.totalEstimateTime - option.trackedTime;
            var work = this.getPercentageData(
              option.totalEstimateTime,
              option.trackedTime
            );
            var schedule = this.getPercentageData(
              option.totalEstimateTime,
              scheduleDiff
            );
            if (option.activeBar == this.props.activeBar) {
              monthlyScheduled.push(
                this.getScheduledDataLabel(
                  schedule,
                  this.secondsToHours(scheduleDiff),
                  total
                )
              );
              monthlyWorked.push(
                this.getWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            } else {
              monthlyScheduled.push({
                y: schedule,
                time: this.secondsToHours(scheduleDiff),
                totalTime: total
              });
              monthlyWorked.push({
                y: work,
                time: this.secondsToHours(option.trackedTime),
                totalTime: total
              });
            }
          } else {
            var schedule = null;
            var work = 30;
            var scheduleDiff = null;
            if (option.activeBar == this.props.activeBar) {
              monthlyScheduled.push(
                this.getScheduledDataLabel(
                  schedule,
                  this.secondsToHours(scheduleDiff),
                  total
                )
              );
              monthlyWorked.push(
                this.getCurrExtremeWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            } else {
              monthlyScheduled.push({
                y: schedule,
                time: this.secondsToHours(scheduleDiff),
                totalTime: total
              });
              monthlyWorked.push(
                this.getExtremeWorkedDataLabel(
                  work,
                  this.secondsToHours(option.trackedTime),
                  total
                )
              );
            }
          }
        } else {
          monthlyScheduled.push(null);
          monthlyWorked.push(null);
        }
      });
      return [
        {
          name: "Remaining Capacity",
          data: monthlyScheduled,
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: monthlyWorked,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.worked_0],
              [1, CHART_COLOR.worked_1]
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
          text: "",
          align: "center",
          verticalAlign: "middle"
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
          labels: {
            enabled: false
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
            "{series.name}: {point.time} hours<br/>Total: {point.totalTime} hours"
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: false,
              distance: -10
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
            },
            dataLabels: {
              enabled: true,
              borderRadius: 5,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              height: "10",
              borderColor: "#AAA",
              y: -6
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
