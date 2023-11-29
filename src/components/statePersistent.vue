<template>
    <div class="instance" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="24">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>

                </el-col>
            </el-row>
        </el-header>
        <el-row style="border: 0px solid #73ad21; height:40%">
            <el-col :span="12">
                <table style=" border: 1px solid black; width: 80%; margin-top: 4%; margin-left: 10%; font-size: 15px; text-align: center;">
                        <tr>
                            <td colspan="2"  style="border: 1px solid black; padding: 8px; text-align: center; " >
                            <label style="margin-left: 8%; margin-top: 5%; font-weight: bold; text-align: center">
                                Source Model
                            </label>
                        </td>
                        </tr>
                        <tr style="height: 25px;"><td>nodes</td>
                            <td>20</td>
                        </tr>
                        <tr style="height: 25px;"><td>edges</td>
                            <td>13</td>
                        </tr>
                        <tr style="height: 25px;"><td>density</td>
                            <td>0.0684</td>
                        </tr>
                </table>
            </el-col>
            <el-col :span="12">
                <table style=" border: 1px solid black; width: 80%; margin-top: 3%; margin-left: 0%; font-size: 15px; text-align: center;">
                        <tr>
                            <td colspan="2"  style="border: 1px solid black; padding: 8px; text-align: center; " >
                            <label style="margin-left: 8%; margin-top: 5%; font-weight: bold; text-align: center">
                                Target Model
                            </label>
                        </td>
                        <!-- Fig1 20  13  0.53 -->
                        <!-- Fig4 39  24  0.53 -->

                        </tr>
                        <tr style="height: 25px; text-align: center;"><td>nodes</td>
                            <td>19</td>
                        </tr>
                        <tr style="height: 25px; text-align: center;" ><td>edges</td>
                            <td>10</td>
                        </tr>
                        <tr style="height: 25px;"><td>density</td>
                            <td>0.0585</td>
                        </tr>
                </table>
            </el-col>
            <!-- <el-col :span="24">
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
            <el-col :span="0">
                <div class="chart" ref="chart"></div>
            </el-col> -->
        </el-row>
        <el-row style="border: 0px solid #73ad21; height:10%;  font-size: 15px;">
            <p style="margin-top: 3%; font-weight: bold;"> The weight state distance based on  <el-select v-model="method" placeholder="SW" size="mini" style="width:15%; margin-top: -50%;">
                <el-option label="SW" value="SW"></el-option>
                <el-option label="EU" value="EU"></el-option>
            </el-select> algorithm : 0.13 </p>
        </el-row>
        <el-row style="border: 0px solid #73ad21; height:40%">
            <el-col :span="2">
                <p style="margin-top: 70%; margin-left: 40%;font-size:15px; font-weight: bold;">Min</p>
                <p style="margin-top: 70%; margin-left: 40%;font-size:15px; font-weight: bold;">Max</p>
            </el-col>
            <el-col :span="22">
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
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) * 0.4 + 'vh' : this.height + 'vh';
        // 绘制视图
        this.drawView3();
    },
    methods: {
        drawView3 () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }

            // 设置节点数据
            var nodes = [
                // 11 33 97 | 24 27 73 83 | 94 38 80
                // 12 29 67 | 18 | 51 | 1 11 27 31 | 3
                { name: '12', row: 0, col: 0 },
                { name: '29', row: 0, col: 1 },
                { name: '67', row: 0, col: 2 },
                { name: '18', row: 0, col: 3 },
                { name: '51', row: 0, col: 4 },
                { name: '1', row: 0, col: 5 },
                { name: '11', row: 0, col: 6 },
                { name: '27', row: 0, col: 7 },
                { name: '31', row: 0, col: 8 },
                { name: '3', row: 0, col: 9 },

                // 44 61| 21 | 55 95 | 89 | 15 39 | 2 | 28
                // 34 | 5 14 17 | 97 | 99 | 35 42 | 28 | 93
                { name: '34', row: 1, col: 0 },
                { name: '5', row: 1, col: 1 },
                { name: '14', row: 1, col: 3 },
                { name: '17', row: 1, col: 4 },
                { name: '97', row: 1, col: 5 },
                { name: '99', row: 1, col: 6 },
                { name: '35', row: 1, col: 7 },
                { name: '42', row: 1, col: 8 },
                { name: '28', row: 1, col: 2 },
                { name: '93', row: 1, col: 9 }
            ];

            // 设置连线数据
            var links = [
                { source: '12', target: '29' },
                { source: '29', target: '67' },
                { source: '1', target: '11' },
                { source: '11', target: '27' },
                { source: '27', target: '31' },
                { source: '5', target: '14' },
                { source: '14', target: '17' },
                { source: '35', target: '42' }
                // { source: '44', target: '61' },
                // { source: '55', target: '95' },
                // { source: '15', target: '39' }
            ];

            // 设置节点的数值数据
            var valueData = [0.74, 0.72, 0.45, 0.55, 0.58, 0.75, 0.85, 0.53, 0.65, 0.39, 3.82, 3.77, 4.56, 4.75, 3.62, 4.27, 4.39, 3.72, 3.95, 4.84];

            // 设置颜色映射范围
            var colorRange = ['steelblue', '#BEA6A0', '#AB0606']; // 设置为红绿渐变色

            // 设置节点连接图的配置项
            var options = {
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',
                        layout: 'none',
                        symbol: 'rect', // 设置节点为矩形
                        symbolSize: 30,
                        roam: true,
                        label: {
                            show: true,
                            itemStyle: {
                                color: 'white'
                            }
                        },
                        edgeSymbol: ['', ''],
                        edgeSymbolSize: [4, 20],
                        edgeLabel: {
                            fontSize: 12
                        },
                        data: nodes.map(function (node, index) {
                            return {
                                name: node.name,
                                x: node.col * 100,
                                y: node.row * 100,
                                value: valueData[index], // 设置节点的数值
                                itemStyle: {
                                    color: null // 颜色将通过 visualMap 组件映射
                                }

                            };
                        }),
                        edges: links.map(function (link) {
                            return {
                                source: link.source,
                                target: link.target
                            };
                        }),
                        lineStyle: {
                            opacity: 0.9,
                            width: 4,
                            curveness: 0,
                            color: 'steelblue'
                        }
                    }
                ],
                visualMap: {
                    type: 'continuous',
                    min: Math.min(...valueData),
                    max: Math.max(...valueData) + 1.5,
                    inRange: {
                        color: colorRange // 设置颜色映射范围
                    },
                    orient: 'horizontal',
                    left: 'center',
                    padding: -25,
                    bottom: '-10%'
                }
            };
            options && this.myChart.setOption(options);
        },
        drawView2 () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }

            let data = [
                [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1], [5, 0, 1], [6, 0, 1], [7, 0, 1], [8, 0, 1], [9, 0, 1],
                [0, 1, 2], [1, 1, 1], [2, 1, 1], [3, 1, 1], [4, 1, 1], [5, 1, 1], [6, 1, 1], [7, 1, 1], [8, 1, 1], [9, 1, 1]
            ];
            // 设置行标签
            let rowLabels = ['Max', 'Min'];
            // 设置列标签
            let colLabels = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7', 'Column 8', 'Column 9', 'Column 10'];
            let option = {
                tooltip: {
                    position: 'top'
                },
                animation: false,
                grid: {
                    height: '50%',
                    y: '10%'
                },
                xAxis: {
                    type: 'category',
                    data: colLabels
                },
                yAxis: {
                    type: 'category',
                    data: rowLabels
                },
                visualMap: {
                    min: 0,
                    max: 100,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '-15%',
                    show: true,
                    textStyle: {
                        color: 'white',
                        fontSize: 0
                    }
                },
                series: [{
                    name: 'Heatmap',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: true
                    },
                    itemStyle: {
                        borderColor: 'white',
                        borderWidth: 3
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            option && this.myChart.setOption(option);
        },
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
