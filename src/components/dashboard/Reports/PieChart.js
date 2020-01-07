import React, { Component } from "react";
import Highcharts from "highcharts/highstock";

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  generateChartData = () => {
    let data = this.props.data.map((item, idx) => {
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
    if (this.props.type === "Projects") {
      data.push({
        name: "Other",
        y: 7.61,
        color: "#e5e5e5",
        dataLabels: {
          enabled: true,
          formatter: function() {
            // return "<b>" + this.point.name + ":</b> " + this.y + "%";
            return "<span class='hour-popup'>" + this.y + "</span> ";
          }
        }
      });
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
    if (this.props.type === "Categories") {
      var data = this.generateCategoryChartData();
    } else {
      var data = this.generateChartData();
    }
    let id = this.props.id;
    let chartType = this.props.type;
    Highcharts.chart(id, {
      chart: {
        type: "pie",
        height: 182,
        styledMode: true
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
        valueSuffix: "%"
      },
      series: [
        {
          name: "Name",
          data: data,
          size: 182,
          innerSize: "60%",
          // dataLabels: {
          //   formatter: function() {
          //     // return "<b>" + this.point.name + ":</b> " + this.y + "%";
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
    if (this.props.type === "Categories") {
      var data = this.generateCategoryChartData();
    } else {
      var data = this.generateChartData();
    }
    let id = this.props.id;
    let chartType = this.props.type;
    Highcharts.chart(id, {
      chart: {
        type: "pie",
        height: 182
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
        valueSuffix: "%"
      },
      series: [
        {
          name: "Name",
          data: data,
          size: "172",
          innerSize: "60%",
          // dataLabels: {
          //   formatter: function() {
          //     // return "<b>" + this.point.name + ":</b> " + this.y + "%";
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
