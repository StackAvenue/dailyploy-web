import React, { Component } from "react";
import Highcharts from "highcharts/highstock";

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
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2);
  };

  generateChartData = () => {
    if (this.props.type === "Categories") {
      return this.generateCategoryChartData();
    } else if (this.props.type === "Projects") {
      return this.generateProjectData();
    } else {
      return this.props.data.map((item, idx) => {
        return {
          name: item.name,
          color: item.color_code,
          y: idx + 1 * 5,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold"
            },
            formatter: function() {
              return "<b class='hour-popup'>" + this.y + "</b> ";
            }
          }
        };
      });
    }
  };

  generateProjectData = () => {
    var data = [];
    if (this.props.estimateTime && this.props.data) {
      var estimateTime = this.props.estimateTime;
      var totalTime = this.props.data
        .map(item => item.tracked_time)
        .reduce((a, b) => a + b, 0);
      data = this.props.data.map((item, idx) => {
        var time = this.secondsToHours(item.tracked_time);
        return {
          name: item.name,
          color: item.color_code,
          time: time,
          y: item.tracked_time,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold"
            },
            formatter: function() {
              return "<b class='hour-popup'>" + time + "</b> ";
            }
          }
        };
      });
      if (totalTime < estimateTime) {
        let diff = estimateTime - totalTime;
        let time = this.secondsToHours(diff);
        data.push({
          name: "Remaining Scheduled Time",
          y: diff,
          time: time,
          color: "#ececec",
          dataLabels: {
            enabled: true,
            formatter: function() {
              // return "<b>" + this.point.name + ":</b> " + this.y + "%";
              return "<span class='hour-popup'>" + time + "</span> ";
            }
          }
        });
      }
    }
    return data;
  };

  generateCategoryChartData = () => {
    var data = this.props.data.map((item, idx) => {
      return {
        name: item.name,
        y: idx + 1 * 5,
        dataLabels: {
          enabled: true,
          formatter: function() {
            return "<b>" + this.y + "</b>";
          }
        }
      };
    });
    data.push({
      name: "Other",
      y: 7.61,
      color: "#e5e5e5",
      dataLabels: {
        enabled: true,
        formatter: function() {
          return "<b>" + this.y + "</b>";
        }
      }
    });
    return data;
  };

  componentDidMount = () => {
    var data = this.generateChartData();
    let id = this.props.id;
    let chartType = this.props.type;
    Highcharts.chart(id, {
      chart: {
        type: "pie",
        height: 182,
        styledMode: true
      },
      credits: {
        enabled: false
      },
      title: {
        text: chartType,
        align: "center",
        verticalAlign: "middle",
        y: 15
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -10,
            style: {
              fontWeight: "bold",
              color: "white"
            }
          },
          center: ["50%", "50%"],
          size: "110%",
          shadow: false,
          size: 80
        }
      },
      tooltip: {
        formatter: function() {
          return (
            "<b>" +
            this.point.name +
            "</b> <br><span>" +
            this.point.time +
            "</span>"
          );
        }
      },
      series: [
        {
          name: "Name",
          data: data,
          size: 182,
          innerSize: "60%",
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
                    enabled: true
                  }
                }
              ]
            }
          }
        ]
      }
    });
  };

  componentDidUpdate = () => {
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
        text: chartType,
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
        }
      },
      tooltip: {
        formatter: function() {
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
      }
    });
  };

  render() {
    return <div id={this.props.id}></div>;
  }
}

export default PieChart;
