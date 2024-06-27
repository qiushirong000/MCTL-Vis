<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>

            </el-col>
        </el-row>
      </el-header>
      <div class="minichart" ref="miniChart_1"></div>
      <div class="chart" ref="chart"></div>
      <div class="minichart" ref="miniChart_2"></div>
    </div>

</template>

<script>
import {store} from '../assets/js/DataManager.js';
import { eventBus, EVENTS } from '../assets/js/MessageCenter.js';

export default {
    name: 'conditionComparison',
    props: {
        title: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 500
        },
        showHeader: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data () {
        return {
            myChart: null,
            data1: [[0.1, 0.2], [0.5, 0.1], [0.5, 0.3], [0.6, 0.6], [0.8, 0.8], [0.5, 0.6], [0.5, 0.7], [0.5, 0.7], [0.5, 0.7], [1, 1]],
            data2: [[0.1, 0.2], [0.5, 0.1], [0.5, 0.3], [0.6, 0.6], [0.8, 0.8], [0.5, 0.6], [0.5, 0.7], [0.5, 0.7], [0.5, 0.7], [1, 1]],
            dataLabel: ['NOxCAL', 'AirVol', 'Ammonia-A', 'Ammonia-B', 'O2'], // Total furnace air volume\Ammonia gas mixture flow rate\
            linesDataS: [],
            linesDataT: [],
            fileData: null,
            condition_S: 7,
            condition_T: 9,
            clickedIndex: 3,
            miniChart_1: null,
            miniChart_2: null,
            miniData_1: {
                title: ['Source'],
                leftData: 600,
                rightData: 400
            },
            miniData_2: {
                title: ['Target'],
                leftData: 350,
                rightData: 650
            }
        };
    },
    created () {
        this.loadRawData();
        this.dataLabel = store.readLabels();
        eventBus.$on(EVENTS.UPDATE_SOURCE_CONDITION_ID, (condition) => {
            this.condition_S = condition;
            this.drawView();
        });
        eventBus.$on(EVENTS.UPDATE_TARGET_CONDITION_ID, (condition) => {
            this.condition_T = condition;
            this.drawView();
        });
    },
    watch: {
        fileData: function () {
            if (this.fileData !== undefined) {
                this.drawView();
            }
        }
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 6.5) + 'vh' : this.height + 'vh';
    },
    methods: {
        // 加载static/data/probabilityDensity.json文件，存储到fileData中
        loadRawData () {
            this.$http.get('static/data/probabilityDensity.json').then((response) => {
                this.fileData = response.data;
            });
        },
        createSeriesData (bins, gridIndex) {
            let seriesData = [];
            let color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
            for (let i = 0; i < bins.length; i++) {
                seriesData.push({
                    name: this.dataLabel[i],
                    data: bins[i],
                    type: 'line',
                    symbolSize: 4,
                    symbol: 'circle',

                    smooth: true,
                    lineStyle: {
                        width: 2,
                        color: color[i]
                    },
                    areaStyle: {
                        color: 'transparent'
                    },
                    yAxisIndex: gridIndex,
                    xAxisIndex: gridIndex
                });
            }
            return seriesData;
        },

        drawLineView (chart, dom, data) {
            if (dom === undefined) return;
            if (chart === null) { chart = this.$echarts.init(dom); }

            var option = {
                grid: {
                    bottom: '5%',
                    left: '3%',
                    right: '5%',
                    top: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value', // 坐标轴类型,   'value' 数值轴，适用于连续数据
                    axisTick: {
                        show: false // 是否显示坐标轴刻度 默认显示
                    },
                    axisLine: { // 是否显示坐标轴轴线 默认显示
                        show: false // 是否显示坐标轴轴线 默认显示
                    },
                    splitLine: {
                        show: false // 是否显示分隔线。默认数值轴显示
                    },
                    axisLabel: {
                        show: false // 是否显示刻度标签 默认显示
                    },
                    min: 0,
                    max: 1
                },
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            show: false // 是否显示坐标轴刻度 默认显示
                        },
                        axisLine: { // 是否显示坐标轴轴线 默认显示
                            show: false, // 是否显示坐标轴轴线 默认显示
                            lineStyle: { // 坐标轴线线的颜色
                                color: '#cdd3ee'
                            }
                        },
                        splitLine: {
                            show: false // 是否显示分隔线。默认数值轴显示
                        },
                        axisLabel: {
                            show: true, // 是否显示刻度标签 默认显示
                            fontSize: 12, // 文字的字体大小
                            color: 'black', // 刻度标签文字的颜色
                            formatter: '{value}'
                        },
                        data: data.title,
                        inverse: true
                    }
                ],
                series: [
                    {
                        type: 'bar', // 系列类型
                        name: '左侧样本总量', // 系列名称, 用于tooltip的显示, legend 的图例筛选
                        stack: '总量',
                        barMaxWidth: 15, // 柱条的最大宽度，不设时自适应
                        label: {
                            show: true,
                            position: 'inside',
                            formatter: function (params) {
                                if (params.value > 0) {
                                    var res = this.miniData_1.leftData.toFixed(2);
                                    return res;
                                } else {
                                    return '';
                                }
                            }.bind(this),
                            textStyle: {
                                fontSize: 13,
                                fontWeight: 'bolder',
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            color: '#56B8CF'
                        },
                        data: [(data.leftData / (data.rightData + data.leftData)).toFixed(2)] // 系列中的数据内容数组
                    },
                    {
                        type: 'bar', // 系列类型
                        name: '右侧样本总量', // 系列名称, 用于tooltip的显示, legend 的图例筛选
                        stack: '总量',
                        barMaxWidth: 15, // 柱条的最大宽度，不设时自适应
                        label: {
                            show: true,
                            position: 'inside',
                            formatter: function (params) {
                                if (params.value > 0) {
                                    var res = this.miniData_1.rightData.toFixed(2);
                                    return res;
                                } else {
                                    return '';
                                }
                            }.bind(this),
                            textStyle: {
                                fontSize: 13,
                                fontWeight: 'bolder',
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            color: '#FFA18A'
                        },
                        data: [(data.rightData / (data.rightData + data.leftData)).toFixed(2)] // 系列中的数据内容数组
                    }
                ]

            };
            chart.setOption(option);
        },

        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }

            if (this.fileData != null) {
                this.linesDataS = this.fileData['seg' + this.condition_S + '_distribution'];
                // this.linesDataS = this.linesDataS.slice(2, 7);
                while (this.linesDataS.length > 5) {
                    this.linesDataS.pop();
                }
                this.linesDataT = this.fileData['seg' + this.condition_T + '_distribution'];
                // this.linesDataT = this.linesDataT.slice(2, 7);
                while (this.linesDataT.length > 5) {
                    this.linesDataT.pop();
                }
            }
            let seriesDataS = this.createSeriesData(this.linesDataS, 0);
            let seriesDataT = this.createSeriesData(this.linesDataT, 1);
            let option = {
                title: {
                    text: ''
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['0', '', '', '', '', '', '', '', '', '1'],
                        axisTick: {
                            show: true,
                            inside: true
                        },
                        axisLabel: {
                            show: true,
                            margin: 6
                        },
                        gridIndex: 0
                    },
                    {
                        type: 'category',
                        data: ['0', '', '', '', '', '', '', '', '', '1'],
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            show: false,
                            inside: true
                        },
                        gridIndex: 1

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        gridIndex: 0
                    },
                    {
                        type: 'value',
                        inverse: true,
                        show: true,
                        position: 'left',
                        gridIndex: 1
                    }
                ],
                legend: {
                    data: this.dataLabel,
                    icon: 'circle',
                    itemWidth: 10,
                    top: '0%'
                },
                grid: [
                    {
                        left: '5%',
                        right: '5%',
                        height: '45%',
                        top: '10%',
                        containLabel: true
                    },
                    {
                        left: '5%',
                        top: '55%',
                        right: '5%',
                        height: '43%',
                        containLabel: true
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                series: [...seriesDataS, ...seriesDataT]
            };
            this.myChart.setOption(option);

            this.drawLineView(this.miniChart_1, this.$refs.miniChart_1, this.miniData_1);
            this.drawLineView(this.miniChart_2, this.$refs.miniChart_2, this.miniData_2);

            // 监听折线图的点击事件
            this.myChart.on('click', function (params) {
                // 获取点击节点的索引
                let dataIndex = params.dataIndex;
                let seriesIndex = params.seriesIndex;
                seriesIndex = seriesIndex % 5;
                console.log('params: ', params);
                console.log('seriesDataS: ', seriesDataS);
                // 设置渐变色
                let mycolor = new this.$echarts.graphic.LinearGradient(
                    0, 0, 1, 0,
                    [
                        {
                            offset: 0,
                            color: '#56B8CF'
                        },
                        {
                            offset: dataIndex * 1.0 / 9,
                            color: '#56B8CF'
                        },
                        {
                            offset: dataIndex * 1.0 / 9,
                            color: '#FF7858'
                        },
                        {
                            offset: 1,
                            color: '#FF7858'
                        }
                    ],
                    false
                );
                // 修改选中的折线的颜色
                for (let i = 0; i < 5; i++) {
                    if (i === seriesIndex) {
                        option.series[seriesIndex].areaStyle.color = mycolor;
                        option.series[seriesIndex + 5].areaStyle.color = mycolor;
                    } else {
                        option.series[i].areaStyle.color = 'transparent';
                        option.series[i + 5].areaStyle.color = 'transparent';
                    }
                }
                // 获取左右区间的样本总量
                this.miniData_1.leftData = 0;
                this.miniData_1.rightData = 0;
                this.miniData_2.leftData = 0;
                this.miniData_2.rightData = 0;
                for (let i = 0; i < this.linesDataS[seriesIndex].length; i++) {
                    if (i === dataIndex) {
                        this.miniData_1.leftData += this.linesDataS[seriesIndex][i] / 2;
                        this.miniData_2.leftData += this.linesDataT[seriesIndex][i] / 2;
                        this.miniData_1.rightData += this.linesDataS[seriesIndex][i] / 2;
                        this.miniData_2.rightData += this.linesDataT[seriesIndex][i] / 2;
                    } else if (i < dataIndex) {
                        this.miniData_1.leftData += this.linesDataS[seriesIndex][i];
                        this.miniData_2.leftData += this.linesDataT[seriesIndex][i];
                    } else {
                        this.miniData_1.rightData += this.linesDataS[seriesIndex][i];
                        this.miniData_2.rightData += this.linesDataT[seriesIndex][i];
                    }
                }
                // 重新渲染柱形图
                this.drawLineView(this.miniChart_1, this.$refs.miniChart_1, this.miniData_1);
                this.drawLineView(this.miniChart_2, this.$refs.miniChart_2, this.miniData_2);

                // 重新渲染图表
                this.myChart.setOption(option);
            }.bind(this));
        }
    }
};
</script>
<style scoped>
    .instance {
        border: 1px solid rgba(197, 197, 197, 0.336);
        width: 100%;
        height: 30vh;
    }
    .chart {
        /* border: 1px solid gainsboro; */
        width: 100%;
        height: 22vh;
    }
    .minichart {
        /* border: 1px solid gainsboro; */
        width: 100%;
        height: 2vh;
    }
</style>
