<template>
    <div class="instance" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="24">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>

                </el-col>
            </el-row>
        </el-header>
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="18">
                <div class="chart" ref="chart"></div>
            </el-col>
            <el-col :span="6">
                <div class="chart" ref="miniChart1" style="border: 0px solid gainsboro; height: 12vh; margin-top: 0%;"></div>
                <div class="chart" ref="miniChart2" style="border: 0px solid gainsboro; height: 12vh;"></div>
            </el-col>
        </el-row>

    </div>

</template>

<script>
import { eventBus, EVENTS } from '../assets/js/MessageCenter.js';

export default {
    name: 'featureImportance',
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
            sourceWeightData: null,
            targetWeightData: null,
            sourceBarData: [10, 20, 30, 40, 50],
            targetBarData: [5, 10, 15, 20, 25],
            xAxisLabel: ['NOxCAL', 'AirVol', 'Ammonia-A', 'Ammonia-B', '02'],
            myChart: null,
            selectData: null,
            innerTD: [0, 0, 0, 0, 0],
            innerSD: [0, 0, 0, 0, 0],
            miniChart1: null,
            miniChart2: null
        };
    },
    created () {
        eventBus.$on(EVENTS.UPDATE_WEIGHT_GRAPH_S, function (data) {
            this.getSourceWeightData(data);
        }.bind(this));
        eventBus.$on(EVENTS.UPDATE_WEIGHT_GRAPH_T, function (data) {
            this.getTargetWeightData(data);
        }.bind(this));
        eventBus.$on(EVENTS.UPDATE_SELECTED_NEURON, function (data) {
            this.selectData = data;
            this.getInnerDT();
            this.getInnerST();
            this.drawView();
        }.bind(this));
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 绘制视图
        this.drawView();
    },
    methods: {
        getSourceWeightData (data) {
            this.sourceWeightData = JSON.parse(data['input_gate']);
            this.sourceBarData = [0, 0, 0, 0, 0];
            for (let i = 0; i < this.sourceWeightData.length; i++) {
                for (let j = 0; j < this.sourceWeightData[i].length; j++) {
                    this.sourceBarData[i] += Math.abs(this.sourceWeightData[i][j]);
                }
            }
            // 计算被选择神经元占据的权重大小
            this.innerSD = [0, 0, 0, 0, 0];
            if (this.selectData != null && this.selectData.size > 0) {
                // 初始化
                this.selectData.forEach((item) => {
                    for (let i = 0; i < this.xAxisLabel.length; i++) {
                        this.innerSD[i] += Math.abs(this.sourceWeightData[i][item]);
                    }
                });
            } else {
                this.innerSD = this.sourceBarData;
            }
        },
        getTargetWeightData (data) {
            this.targetWeightData = JSON.parse(data['input_gate']);
            this.targetBarData = [0, 0, 0, 0, 0];
            for (let i = 0; i < this.targetWeightData.length; i++) {
                for (let j = 0; j < this.targetWeightData[i].length; j++) {
                    this.targetBarData[i] += Math.abs(this.targetWeightData[i][j]);
                }
            }
            // 计算被选择神经元占据的权重大小
            this.innerTD = [0, 0, 0, 0, 0];
            if (this.selectData != null && this.selectData.size > 0) {
                // 初始化
                this.selectData.forEach((item) => {
                    for (let i = 0; i < this.xAxisLabel.length; i++) {
                        this.innerTD[i] += Math.abs(this.targetWeightData[i][item]);
                    }
                });
            } else {
                this.innerTD = this.targetBarData;
            }
            this.drawView();
        },
        getInnerST () {
            this.sourceBarData = [0, 0, 0, 0, 0];
            for (let i = 0; i < this.sourceWeightData.length; i++) {
                for (let j = 0; j < this.sourceWeightData[i].length; j++) {
                    this.sourceBarData[i] += Math.abs(this.sourceWeightData[i][j]);
                }
            }
            // 计算被选择神经元占据的权重大小
            this.innerSD = [0, 0, 0, 0, 0];
            if (this.selectData != null && this.selectData.size > 0) {
                // 初始化
                this.selectData.forEach((item) => {
                    for (let i = 0; i < this.xAxisLabel.length; i++) {
                        this.innerSD[i] += Math.abs(this.sourceWeightData[i][item]);
                    }
                });
            }
        },
        getInnerDT () {
            this.targetBarData = [0, 0, 0, 0, 0];
            for (let i = 0; i < this.targetWeightData.length; i++) {
                for (let j = 0; j < this.targetWeightData[i].length; j++) {
                    this.targetBarData[i] += Math.abs(this.targetWeightData[i][j]);
                }
            }
            // 计算被选择神经元占据的权重大小
            this.innerTD = [0, 0, 0, 0, 0];
            if (this.selectData != null && this.selectData.size > 0) {
                // 初始化
                this.selectData.forEach((item) => {
                    for (let i = 0; i < this.xAxisLabel.length; i++) {
                        this.innerTD[i] += Math.abs(this.targetWeightData[i][item]);
                    }
                });
            }
        },
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            // 设置颜色
            let colorsS = [];
            let colorsT = [];
            // this.sourceBarData = [33.4, 23.4, 25.8, 33.0, 16];
            // this.targetBarData = [35, 24, 26, 34.5, 16.3];
            // this.innerSD = [33.4, 23.4, 25.8, 33.0, 16];
            // this.innerTD = [35, 24, 26, 34.5, 16.3];
            for (let i = 0; i < this.xAxisLabel.length; i++) {
                colorsS.push({
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(211,211,211,0.7)' // 0% 处的颜色
                        },
                        {
                            offset: 1 - this.innerSD[i] / this.sourceBarData[i],
                            color: 'rgba(211,211,211,0.7)'
                        },
                        {
                            offset: 1 - this.innerSD[i] / this.sourceBarData[i],
                            color: '#56B8CF'
                        },
                        {
                            offset: 1,
                            color: '#56B8CF' // 100% 处的颜色
                        }
                    ]
                });
                colorsT.push({
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(211,211,211,0.7)' // 0% 处的颜色
                        },
                        {
                            offset: 1 - this.innerTD[i] / this.targetBarData[i],
                            color: 'rgba(211,211,211,0.7)'
                        },
                        {
                            offset: 1 - this.innerTD[i] / this.targetBarData[i],
                            color: '#FF7858'
                        },
                        {
                            offset: 1,
                            color: '#FF7858' // 100% 处的颜色
                        }
                    ]
                });
            }

            let option = {
                xAxis: {
                    type: 'category',
                    data: this.xAxisLabel,
                    axisLabel: {
                        interval: 0,
                        show: true
                    }
                },
                yAxis: {
                    type: 'value',
                    show: true
                },
                grid: {
                    top: '20%',
                    bottom: '15%',
                    width: '85%',
                    left: '15%'
                },
                legend: {
                    data: [{
                        name: 'source model',
                        itemStyle: {
                            color: '#56B8CF'
                        }
                    }, {
                        name: 'target model',
                        itemStyle: {
                            color: '#FF7858'
                        }
                    }],
                    top: '5%'
                },
                series: [
                    {
                        name: 'source model',
                        type: 'bar',
                        barWidth: 20,
                        data: this.sourceBarData,
                        itemStyle: {
                            //   barBorderRadius: 10,
                            color: function (params) {
                                return colorsS[params.dataIndex];
                            },
                            borderColor: '#56B8CF',
                            borderWidth: 3
                        }
                    },
                    {
                        name: 'target model',
                        type: 'bar',
                        barWidth: 20,
                        data: this.targetBarData,
                        itemStyle: {
                            //   barBorderRadius: 10,
                            color: function (params) {
                                return colorsT[params.dataIndex];
                            },
                            borderColor: '#FF7858',
                            borderWidth: 3
                        }
                    }
                ]
            };

            option && this.myChart.setOption(option);

            this.drawPieChart1();
            this.drawPieChart2();
        },

        drawPieChart1 () {
            if (this.$refs.chart === undefined) return;
            if (this.miniChart1 === null) { this.miniChart1 = this.$echarts.init(this.$refs.miniChart1); }

            let option = {
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: this.innerSD[0], name: 'X1' },
                            { value: this.innerSD[1], name: 'X2' },
                            { value: this.innerSD[2], name: 'X3' },
                            { value: this.innerSD[3], name: 'X4' },
                            { value: this.innerSD[4], name: 'X5' }
                        ],
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            option && this.miniChart1.setOption(option);
        },
        drawPieChart2 () {
            if (this.$refs.chart === undefined) return;
            if (this.miniChart2 === null) { this.miniChart2 = this.$echarts.init(this.$refs.miniChart2); }

            let option = {
                grid: {
                    top: '20%',
                    bottom: '20%',
                    width: '85%',
                    left: '10%'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: this.innerTD[0], name: 'X1' },
                            { value: this.innerTD[1], name: 'X2' },
                            { value: this.innerTD[2], name: 'X3' },
                            { value: this.innerTD[3], name: 'X4' },
                            { value: this.innerTD[4], name: 'X5' }
                        ],
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            option && this.miniChart2.setOption(option);
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
        height: 27vh;
    }
</style>
