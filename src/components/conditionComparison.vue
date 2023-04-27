<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold;">{{title}}</label></div>

            </el-col>
        </el-row>
      </el-header>
      <div class="chart" ref="chart"></div>
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
            dataLabel: ['NOxCAL', 'AirVol', 'Ammonia-A', 'Ammonia-B', '02'], // Total furnace air volume\Ammonia gas mixture flow rate\
            linesDataS: [],
            linesDataT: [],
            fileData: null,
            condition_S: 7,
            condition_T: 9
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
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 绘制视图
        // this.drawView();
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
            for (let i = 0; i < bins.length; i++) {
                seriesData.push({
                    name: this.dataLabel[i],
                    data: bins[i],
                    type: 'line',
                    smooth: true,
                    yAxisIndex: gridIndex,
                    xAxisIndex: gridIndex
                });
            }
            return seriesData;
        },
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            if (this.fileData != null) {
                this.linesDataS = this.fileData['seg' + this.condition_S + '_distribution'];
                while (this.linesDataS.length > 5) {
                    this.linesDataS.pop();
                }
                this.linesDataT = this.fileData['seg' + this.condition_T + '_distribution'];
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
                            margin: 0
                        }
                    },
                    {
                        type: 'category',
                        data: ['0', '', '', '', '', '', '', '', '', '1'],
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            show: false,
                            inside: true,
                            margin: 85
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
                    itemWidth: 10
                },
                grid: [
                    {
                        left: '5%',
                        right: '5%',
                        height: '40%',
                        top: '15%',
                        containLabel: true
                    },
                    {
                        left: '5%',
                        top: '55%',
                        right: '5%',
                        height: '35%',
                        containLabel: true
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                series: [...seriesDataS, ...seriesDataT]
            };
            this.myChart.setOption(option);
        }
    }
};
</script>
<style scoped>
    .instance {
        border: 1px solid rgb(0, 0, 0);
        width: 100%;
        height: 30vh;
    }
    .chart {
        /* border: 1px solid gainsboro; */
        width: 100%;
        height: 27vh;
    }
</style>
