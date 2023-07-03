<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; ">{{title}}</label></div>

            </el-col>
        </el-row>
      </el-header>
      <el-row style="border: 0px solid #73ad21; height:100%">
            <el-col :span="6">
                <el-form ref="form" label-width="80px" size="mini" style="margin-top: 10px;">
                    <br>
                    <br>
                    <label style="font-weight: bold;">Algorithm</label>
                    <br>
                    <el-select v-model="method" placeholder="WS" style="width:100px;height: 0px;margin-top: 5px;">
                        <el-option label="WS" value="WS"></el-option>
                        <el-option label="EU" value="EU"></el-option>
                    </el-select>
                    <br><br>
                    <div style="margin-top: 5px;">
                        <label style="font-weight: bold; ">Similarity</label>
                    </div>
                    <div style="margin-top: 8px;">
                        <label style="font-weight: bold;">0.76</label>
                    </div>
                </el-form>
            </el-col>
            <el-col :span="18">
                <div class="chart" ref="chart"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'statePersistent',
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
            method: ''
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
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }

            // 配置生命周期轴和重要性轴
            let option = {
                title: [{
                    text: 'Source Model',
                    left: '17%',
                    top: '2%',
                    textStyle: {
                        color: '#000000',
                        fontSize: 12,
                        fontWeight: 'normal'
                    },
                    gridIndex: 0
                },
                {
                    text: 'Target Model',
                    left: '66%',
                    top: '3%',
                    textStyle: {
                        color: '#000000',
                        fontSize: 12,
                        fontWeight: 'normal'
                    },
                    gridIndex: 1
                }],
                grid: [
                    {
                        left: '3%',
                        right: '55%',
                        bottom: '8%',
                        top: '15%',
                        containLabel: true
                    }, {
                        left: '52%',
                        right: '6%',
                        bottom: '8%',
                        top: '15%',
                        containLabel: true
                    }
                ],
                xAxis: [
                    {
                        type: 'value',
                        name: 'Birth',
                        gridIndex: 0,
                        nameLocation: 'middle',
                        nameGap: 20,
                        axisLine: {
                            onZero: false
                        },
                        min: -0.05 // 设置x轴刻度在0开始前还有一小段间隙
                    },
                    {
                        type: 'value',
                        name: 'Birth',
                        gridIndex: 1,
                        nameLocation: 'middle',
                        nameGap: 20,
                        axisLine: {
                            onZero: false
                        },
                        min: -0.05 // 设置x轴刻度在0开始前还有一小段间隙
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Death',
                        gridIndex: 0,
                        nameLocation: 'middle',
                        nameGap: 25,
                        min: -0.05,
                        axisLine: {
                            onZero: false // 设置y轴刻度线不垂直于0刻度值处
                        }
                    },
                    {
                        type: 'value',
                        name: 'Death',
                        gridIndex: 1,
                        nameLocation: 'middle',
                        nameGap: 25,
                        min: -0.05,
                        axisLine: {
                            onZero: false // 设置y轴刻度线不垂直于0刻度值处
                        }
                    }
                ],
                series: []
            };

            // 生成数据
            let data = [
                [
                    [0, 0.1],
                    [0, 0.2],
                    [0, 0.3],
                    [0, 0.4],
                    [0, 0.33]
                ],
                [
                    [0.1, 0.2],
                    [0.1, 0.4],
                    [0.3, 0.5],
                    [0.3, 0.6],
                    [0.4, 0.7]
                ]
            ];
            let data2 = [
                [
                    [0, 0.1],
                    [0, 0.2],
                    [0, 0.35],
                    [0, 0.42],
                    [0, 0.3]
                ],
                [
                    [0.1, 0.2],
                    [0.2, 0.4],
                    [0.3, 0.5],
                    [0.3, 0.6],
                    [0.4, 0.7]
                ]
            ];

            // 添加scatter系列
            option.series.push({
                type: 'scatter',
                data: data[1],
                symbolSize: 6,
                itemStyle: {
                    color: 'orange'
                },
                xAxisIndex: 0,
                yAxisIndex: 0
            });
            option.series.push({
                type: 'scatter',
                data: data[0],
                symbolSize: 6,
                itemStyle: {
                    color: '#007aff'
                },
                xAxisIndex: 0,
                yAxisIndex: 0
            });

            // 添加line系列
            option.series.push({
                type: 'line',
                data: [
                    [-0.05, -0.05],
                    [0.1, 0.1],
                    [0.2, 0.2],
                    [0.3, 0.3],
                    [0.4, 0.4],
                    [0.5, 0.5],
                    [0.6, 0.6]
                ],
                symbol: 'none',
                lineStyle: {
                    color: '#5470C6',
                    width: 2,
                    type: 'dashed'
                },
                xAxisIndex: 0,
                yAxisIndex: 0

            });

            // 添加scatter系列
            option.series.push({
                type: 'scatter',
                data: data2[1],
                symbolSize: 6,
                itemStyle: {
                    color: 'orange'
                },
                xAxisIndex: 1,
                yAxisIndex: 1
            });
            option.series.push({
                type: 'scatter',
                data: data2[0],
                symbolSize: 6,
                itemStyle: {
                    color: '#007aff'
                },
                xAxisIndex: 1,
                yAxisIndex: 1
            });

            // 添加line系列
            option.series.push({
                type: 'line',
                data: [
                    [-0.05, -0.05],
                    [0.1, 0.1],
                    [0.2, 0.2],
                    [0.3, 0.3],
                    [0.4, 0.4],
                    [0.5, 0.5],
                    [0.6, 0.6]
                ],
                symbol: 'none',
                lineStyle: {
                    color: '#5470C6',
                    width: 2,
                    type: 'dashed'
                },
                xAxisIndex: 1,
                yAxisIndex: 1

            });

            option && this.myChart.setOption(option);
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
