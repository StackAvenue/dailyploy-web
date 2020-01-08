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

  getXData = () => {
    if (this.props.state.daily) {
      return [
        {
          name: "Capacity",
          data: [
            8,
            4,
            5,
            {
              y: 5,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            },
            9,
            6,
            4
          ],
          color: CHART_COLOR.capacity
        },
        {
          name: "Scheduled",
          data: [
            7,
            4,
            5,
            {
              y: 7,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            },
            9,
            4,
            4
          ],
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: [
            15,
            22,
            20,
            {
              y: 20,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
                },
                enabled: true,
                // borderRadius: 5,
                // backgroundColor: "rgba(252, 255, 255, 0.7)",
                // borderWidth: 1,
                // color: "#0075d9",
                // borderColor: "#d6d6d6",
                // fontSize: 8,
                style: {
                  backgroundColor: "rgba(252, 255, 255, 0.7)",
                  borderWidth: 1,
                  color: "#0075d9",
                  borderColor: "rgba(252, 255, 255, 0.7)",
                  borderRadius: 5
                }
              },
              color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                  [0, CHART_COLOR.curr_worked_0],
                  [1, CHART_COLOR.curr_worked_1]
                ]
              }
            },
            18,
            20,
            22
          ]
        }
      ];
    } else if (this.props.state.weekly) {
      return [
        {
          name: "Capacity",
          data: [
            5,
            4,
            3,
            {
              y: 3,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            }
          ],
          color: CHART_COLOR.capacity
        },
        {
          name: "Scheduled",
          data: [
            3,
            3,
            4,
            {
              y: 5,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            }
          ],
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: [
            22,
            23,
            23,
            {
              y: 22,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            }
          ]
        }
      ];
    } else if (this.props.state.monthly) {
      return [
        {
          name: "Capacity",
          data: [
            {
              y: 5,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            },
            4,
            3,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            4,
            1
          ],
          color: CHART_COLOR.capacity
        },
        {
          name: "Scheduled",
          data: [
            {
              y: 2,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            },
            2,
            4,
            6,
            7,
            4,
            8,
            5,
            0,
            4,
            6,
            15
          ],
          color: CHART_COLOR.scheduled
        },
        {
          name: "Worked",
          data: [
            {
              y: 23,
              dataLabels: {
                formatter: function() {
                  return "<b>" + this.y + " hours</b>";
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
            },
            24,
            23,
            22,
            20,
            24,
            20,
            20,
            30,
            24,
            21,
            23
          ]
        }
      ];
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.data != this.props.data) {
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
