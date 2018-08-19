const optionBar = {
  color: ["#66a7f9"],
  title: {
    text: "收入金额明细（元）",
    x: "center"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "bar"
    }
  ]
};
const optionPie = {
  color: ["#f19242", "#8b42c7", "#3497da", "#1dc4aa", "#3ea248", "#c5c00c"],
  title: {
    text: "收入来源统计",
    x: "center"
  },
  legend: {
    type: "scroll",
    orient: "vertical",
    right: 10,
    top: 20,
    bottom: 20,
    data: ["rose1", "rose2", "rose3", "rose4", "rose5", "rose6", "rose7", "rose8"]
  },
  calculable: false,
  series: [
    {
      label: {
        normal: {
          show: true,
          formatter: "{b}({d}%)"
        },
        emphasis: {
          show: true
        }
      },
      lableLine: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
      type: "pie",
      radius: [30, 110],
      center: ["50%", "50%"],
      roseType: "area",
      data: [
        { value: 10, name: "rose1" },
        { value: 5, name: "rose2" },
        { value: 15, name: "rose3" },
        { value: 25, name: "rose4" },
        { value: 20, name: "rose5" },
        { value: 35, name: "rose6" },
        { value: 30, name: "rose7" },
        { value: 40, name: "rose8" }
      ]
    }
  ]
};
const optionLineArea = {
  color: ["#cfae7b"],
  title: {
    text: "客次客数统计",
    x: "center"
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line",
      areaStyle: {}
    }
  ]
};
const optionLine = {
  color: ["#329c40", "#4c47fc"],
  title: {
    text: "历史订单数",
    x: "center"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
};

export { optionBar, optionLine, optionLineArea, optionPie };
