import React, { Component } from "react";
import Highcharts from "highcharts/highstock";

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  generateChartData = () => {
    let data = this.props.data.map((item, idx) => {
      const container = {};
      container["name"] = item.name;
      container["color"] = item.color_code;
      container["y"] = idx + 1 * 5;
      return container;
    });
    if (this.props.type === "Projects") {
      data.push({
        name: "Other",
        y: 7.61,
        color: "#e5e5e5",
        dataLabels: {
          enabled: false
        }
      });
    }
    return data;
  };

  generateCategoryChartData = () => {
    return this.props.data.map((item, idx) => {
      const container = {};
      container["name"] = item.name;
      // container["color"] = item.color_code;
      container["y"] = idx + 1 * 5;
      return container;
    });
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
          //   data: [
          //     ["Chrome", 58.9, "#ffa700"],
          //     ["Firefox", 13.29],
          //     ["Internet Explorer", 13],
          //     ["Edge", 3.78],
          //     ["Safari", 3.42],
          //     {
          //       name: "Other",
          //       y: 7.61,
          //       dataLabels: {
          //         enabled: false
          //       }
          //     }
          //   ],
          size: "172",
          innerSize: "60%",
          dataLabels: {
            formatter: function() {
              // display only if larger than 1
              // return this.y > 1
              //   ? "<b>" + this.point.name + ":</b> " + this.y + "%"
              //   : null;
              return "<b>" + this.name + ":</b> " + this.y + "%";
            }
          },
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
          //   data: [
          //     ["Chrome", 58.9, "#ffa700"],
          //     ["Firefox", 13.29],
          //     ["Internet Explorer", 13],
          //     ["Edge", 3.78],
          //     ["Safari", 3.42],
          //     {
          //       name: "Other",
          //       y: 7.61,
          //       dataLabels: {
          //         enabled: false
          //       }
          //     }
          //   ],
          size: "172",
          innerSize: "60%",
          dataLabels: {
            formatter: function() {
              // display only if larger than 1
              // return this.y > 1
              //   ? "<b>" + this.point.name + ":</b> " + this.y + "%"
              //   : null;
              return "<b>" + this.name + ":</b> " + this.y + "%";
            }
          },
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
