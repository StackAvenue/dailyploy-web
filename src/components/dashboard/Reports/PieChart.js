import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import { PRIORITIES, CHART_COLOR } from "../../../utils/Constants";
import { textTitlize } from "../../../utils/function";
import PropTypes from 'prop-types';


window.Highcharts = Highcharts;


class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  secondsToHours = seconds => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return (
      ("0" + h).slice(`${h}`.length > 2 ? -3 : -2) + ":" + ("0" + m).slice(-2)
    );
  };

  generateChartData = () => {
    if (this.props.type === "Categories") {
      return this.generateCategoryChartData();
    } else if (this.props.type === "Projects") {
      return this.generateProjectData();
    } else {
      return this.generatePriorityData();
    }
  };

  generateProjectData = () => {
    var data = [];
    if (this.props.estimateTime && this.props.data) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      var data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: textTitlize(item.name),
          color: item.color_code,
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold"
            },
            formatter: function () {
              return "<b class='hour-popup'>" + time + "</b> ";
            }
          }
        };
      });
      if (totalTime < estimateTime) {
        let diff = estimateTime - totalTime;
        let time = this.secondsToHours(diff);
        data.push({
          name: "Remaining Capacity",
          y: diff,
          time: time,
          color: "#ececec",
          dataLabels: {
            enabled: true,
            formatter: function () {
              // return "<b>" + this.point.name + ":</b> " + this.y + "%";
              return "<span class='hour-popup'>" + time + "</span> ";
            }
          }
        });
      }
    } else if (this.props.estimateTime == 0 && this.props.data.length > 0) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      var data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: textTitlize(item.name),
          color: item.color_code,
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold"
            },
            formatter: function () {
              return "<b class='hour-popup'>" + time + "</b> ";
            }
          }
        };
      });
    }
    return data;
  };

  generateCategoryChartData = () => {
    var data = [];
    if (this.props.estimateTime && this.props.data) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      var data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: textTitlize(item.name),
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return "<b>" + time + "</b>";
            }
          }
        };
      });
      if (totalTime < estimateTime) {
        let diff = estimateTime - totalTime;
        let time = this.secondsToHours(diff);
        data.push({
          name: "Remaining Capacity",
          y: diff,
          time: time,
          color: "#e5e5e5",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return "<span class='hour-popup'>" + time + "</span> ";
            }
          }
        });
      }
    } else if (this.props.estimateTime == 0 && this.props.data.length > 0) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      var data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: textTitlize(item.name),
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return "<b>" + time + "</b>";
            }
          }
        };
      });
    }
    return data;
  };

  selectColorCode = name => {
    let priority = PRIORITIES.find(p => p.name == name);
    return priority ? priority.color_code : null;
  };

  generatePriorityData = () => {
    var data = [];
    if (this.props.estimateTime && this.props.data) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: textTitlize(item.priority),
          color: this.selectColorCode(item.priority),
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold"
            },
            formatter: function () {
              return "<b class='hour-popup'>" + time + "</b> ";
            }
          }
        };
      });
      if (totalTime < estimateTime) {
        let diff = estimateTime - totalTime;
        let time = this.secondsToHours(diff);
        data.push({
          name: "Remaining Capacity",
          y: diff,
          time: time,
          color: "#e5e5e5",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return "<span class='hour-popup'>" + time + "</span> ";
            }
          }
        });
      }
    } else if (this.props.estimateTime == 0 && this.props.data.length > 0) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: textTitlize(item.priority),
          color: this.selectColorCode(item.priority),
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold"
            },
            formatter: function () {
              return "<b class='hour-popup'>" + time + "</b> ";
            }
          }
        };
      });
    }
    return data;
  };

  // componentDidMount = () => {
  //   var data = this.generateChartData();
  //   let id = this.props.id;
  //   let chartType = this.props.type;
  //   Highcharts.chart(id, {
  //     chart: {
  //       type: "pie",
  //       height: 182,
  //       styledMode: true
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: chartType,
  //       align: "center",
  //       verticalAlign: "middle",
  //       y: 15
  //     },
  //     plotOptions: {
  //       pie: {
  //         dataLabels: {
  //           enabled: true,
  //           distance: -10,
  //           style: {
  //             fontWeight: "bold",
  //             color: "white"
  //           }
  //         },
  //         center: ["50%", "50%"],
  //         size: "110%",
  //         shadow: false,
  //         size: 80
  //       },
  //       series: {
  //         dataLabels: {
  //           enabled: true,
  //           borderRadius: 5,
  //           maxWidth: "100",
  //           backgroundColor: "#ffffff",
  //           borderWidth: 1,
  //           borderColor: "#AAA",
  //           color: CHART_COLOR.active_color,
  //           y: -6
  //         }
  //       }
  //     },
  //     tooltip: {
  //       formatter: function() {
  //         return (
  //           "<b>" +
  //           this.point.name +
  //           "</b> <br><span>" +
  //           this.point.time +
  //           "</span>"
  //         );
  //       }
  //     },
  //     series: [
  //       {
  //         name: "Name",
  //         data: data,
  //         size: 182,
  //         innerSize: "60%",
  //         id: "name"
  //       }
  //     ],
  //     responsive: {
  //       rules: [
  //         {
  //           condition: {
  //             maxWidth: 200
  //           },
  //           chartOptions: {
  //             series: [
  //               {},
  //               {
  //                 id: "versions",
  //                 dataLabels: {
  //                   enabled: true
  //                 }
  //               }
  //             ]
  //           }
  //         }
  //       ]
  //     }
  //   });
  // };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.data != this.props.data) {
      var data = this.generateChartData();
      let id = this.props.id;
      let chartType = this.props.type;
      Highcharts.chart(id, {
        chart: {
          type: "pie",
          height: 195
        },
        credits: {
          enabled: false
        },
        title: {
          text: data.length > 0 ? chartType : "No data Found",
          align: "center",
          verticalAlign: "middle",
          y: 15
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
              distance: -10,
              style: {
                fontWeight: "bold",
                border: "solid 1px"
              }
            },
            center: ["50%", "50%"],
            size: "110%",
            shadow: false,
            size: 80
          },
          series: {
            dataLabels: {
              enabled: true,
              borderRadius: 5,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#AAA",
              color: CHART_COLOR.active_color,
              y: -6
            }
          }
        },
        tooltip: {
          formatter: function () {
            return (
              "<b>" +
              this.point.name +
              "</b><br><span>" +
              this.point.time +
              " hours</span>"
            );
          }
        },
        series: [
          {
            name: "Name",
            data: data,
            size: 172,
            innerSize: 100,
            // dataLabels: {
            //   formatter: function() {
            //     return "<b>" + this.point.name + ":</b> " + this.y + "%";
            //   }
            // },
            id: "name"
          }
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 200
              },
              chartOptions: {
                series: [
                  {},
                  {
                    id: "versions",
                    dataLabels: {
                      enabled: false
                    }
                  }
                ]
              }
            }
          ]
        },
        lang: {
          noData: "no data!" //the text to be displayed
        },
        noData: {
          position: {
            x: 0,
            y: 0,
            align: "center",
            verticalAlign: "middle"
          }
        }
      });
    }
  };

  render() {
    return <div id={this.props.id}></div>;
  }
}

PieChart.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.array,
  estimateTime: PropTypes.array
}



export default PieChart;
