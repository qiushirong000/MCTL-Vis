<template>
    <div class="weightChange" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>
            </el-col>
        </el-row>
      </el-header>
      <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
export default {
    name: 'weightChange',
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
            myChart: null
        };
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 绘制视图
        this.drawView();
    },
    methods: {
        getSeriesData (maxData) {
            var scatterData1 = [];
            var scatterData2 = [];
            var coordData = [];
            var labels = [];
            for (let i = 0; i < maxData.length; i++) {
                scatterData1.push([maxData[i][1], maxData[i][0]]);
                scatterData2.push([maxData[i][2], maxData[i][0]]);
                labels.push(maxData[i][0]);
                coordData.push([{ coord: [maxData[i][1], maxData[i][0]] }, { coord: [maxData[i][2], maxData[i][0]] }]);
            }
            return [scatterData1, scatterData2, coordData, labels];
        },
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }

            // 准备数据
            const maxData = [
                ['93', 1.5379218, 2.4853485],
                ['17', 2.1223793, 2.964325],
                ['96', 1.7383702, 2.4921453],
                ['67', 1.6532782, 2.3965602],
                ['87', 1.666142, 2.357038]
                // ['0', 2.1286304, 2.813789],
                // ['6', 1.633922, 2.2751079],
                // ['44', 1.8253286, 2.461691],
                // ['63', 1.8171154, 2.4452593],
                // ['22', 1.1462953, 1.7584928]
                // 添加更多的点
            ];
            const minData = [
                ['14', 0.82379043, 0.83322823],
                ['65', 1.6593075, 1.6719923],
                ['34', 1.1340759, 1.1553513],
                ['76', 2.0435097, 2.0155337],
                ['41', 1.0692735, 1.0411838]
            ];

            const [scatterData1, scatterData2, coordData1, labels1] = this.getSeriesData(maxData);
            const [scatterData3, scatterData4, coordData2, labels2] = this.getSeriesData(minData);

            // 配置散点图选项
            const option = {
                grid: [
                    {
                        height: '65%',
                        top: '10%',
                        left: '10%',
                        width: '35%'
                    }, {
                        height: '65%',
                        top: '10%',
                        left: '60%',
                        width: '35%'
                    }],
                xAxis: [
                    {
                        type: 'value',
                        min: 0,
                        max: 4,
                        axisTick: {
                            show: false // 设置为false表示不显示刻度
                        },
                        gridIndex: 0
                    }, {
                        type: 'value',
                        min: 0,
                        max: 4,
                        axisTick: {
                            show: false // 设置为false表示不显示刻度
                        },
                        gridIndex: 1
                    }],
                tooltip: {
                    position: 'top'
                },
                yAxis: [
                    {
                        type: 'category',
                        data: labels1,
                        splitNumber: 1,
                        axisTick: {
                            show: true // 设置为false表示不显示刻度
                        },
                        axisLine: {
                            show: true // 设置为false表示不显示轴线
                        },
                        gridIndex: 0
                    }, {
                        type: 'category',
                        data: labels2,
                        splitNumber: 1,
                        position: 'left',
                        // offset: 0,
                        // nameGap: 0,
                        // nameTextStyle: {
                        //     // align: 'right',
                        //     padding: -100// 四个数字分别为上右下左与原位置距离
                        // },
                        axisTick: {
                            show: true // 设置为false表示不显示刻度
                        },
                        axisLine: {
                            show: true // 设置为false表示不显示轴线
                        },
                        gridIndex: 1
                    }],
                series: [
                    {
                        type: 'line',
                        markLine: {
                            symbol: ['none', 'none'],
                            lineStyle: {
                                type: 'solid',
                                color: 'rgb(213,213,213)',
                                width: 3
                            },
                            data: coordData1
                        },
                        zlevel: 1
                    }, {
                        type: 'scatter',
                        data: scatterData1,
                        itemStyle: {
                            color: '#56B8CF'
                        },
                        zlevel: 2
                    },
                    {
                        type: 'scatter',
                        data: scatterData2,
                        itemStyle: {
                            color: '#FF7858'
                        },
                        zlevel: 2
                    },
                    {
                        type: 'line',
                        markLine: {
                            symbol: ['none', 'none'],
                            lineStyle: {
                                type: 'solid',
                                color: 'rgb(213,213,213)',
                                width: 3
                            },
                            data: coordData2
                        },
                        zlevel: 1,
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    }, {
                        type: 'scatter',
                        data: scatterData3,
                        itemStyle: {
                            color: '#56B8CF'
                        },
                        zlevel: 2,
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    },
                    {
                        type: 'scatter',
                        data: scatterData4,
                        itemStyle: {
                            color: '#FF7858'
                        },
                        zlevel: 2,
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    }
                ]

            };
            option && this.myChart.setOption(option);
        }
    }
};
</script>
<style scoped>
    .weightChange {
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
