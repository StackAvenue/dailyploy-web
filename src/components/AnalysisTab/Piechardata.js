import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";

const Piechardata = (props) => {
  useEffect(() => {
    if (props.financialHealth) {
      loadPieChart();
    }

  })

  const loadPieChart = () => {
    Highcharts.chart('analysisPieChart', {
      chart: {
        type: 'pie',
        height: 330,
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false
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
            color: "#AAA",
            y: -6
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> Financial Health:{point.y}</b><br/>'
      },
      series: [{
        minPointSize: 10,
        innerSize: 120,
        size: 172,
        zMin: 0,
        name: 'countries',
        data: [{
          name: "props.projectName",
          color: props.pieChartColor,
          y: props.financialHealth
        }]
      }],
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
    });
  }

  return (
    <>
      <div id="analysisPieChart"></div>
    </>
  )
}

export default Piechardata;
