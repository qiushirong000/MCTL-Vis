<template>
    <div class="instance" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="24">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold;">{{title}}</label></div>

                </el-col>
            </el-row>
        </el-header>
        <el-row style="border: 0px solid #73ad21; height:30px; width: 100%; ">
            <el-col :span="18">
                <div style="margin-top:7px"></div>
            </el-col>
            <el-col :span="4" style="margin-top: 5px;">
                <el-select v-model="metricValue" placeholder="RMSE" size="mini">
                    <el-option
                    v-for="item in metricOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
      <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
export default {
    name: 'modelEvaluation',
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
            metricOptions: [{
                value: '选项1',
                label: 'RMSE'
            }, {
                value: '选项2',
                label: 'MSE'
            }, {
                value: '选项3',
                label: 'MAE'
            }],
            metricValue: '',
            loss_data: [0.000559658, 0.000462189, 0.000383154, 0.000355514, 0.00042927, 0.000369741, 0.000799258, 0.000388272, 0.000320224, 0.000505685, 0.000264274, 0.000224991, 0.00024769, 0.000255003, 0.000256082, 0.00026289, 0.000217568, 0.000524743, 0.000281544, 0.000301619, 0.000243574, 0.000215558, 0.000379385, 0.000358053, 0.000415624, 0.000267315, 0.000365729, 0.0003149, 0.000305853, 0.000364189, 0.000258196, 0.000398429, 0.000358676, 0.000332635, 0.000236722, 0.000305553, 0.000250649, 0.000309203, 0.00023299, 0.000390952, 0.000227389, 0.000332752, 0.000203532, 0.000301097, 0.000306164, 0.000251769, 0.000265595, 0.00023098, 0.000278979, 0.00022975, 0.000209579, 0.000284754, 0.000214058, 0.000164795, 0.000123903, 0.000201713, 0.000192873, 0.000196366, 0.000278811, 0.000159023, 0.000206587, 0.000251198, 0.000187441, 0.00021466, 0.000262531, 0.000268078, 0.000213872, 0.000258242, 0.000186081, 0.000196369, 1.00E-04, 0.000412538, 0.000171848, 0.000166004, 0.000171214, 0.000319351, 0.000279812, 0.000282398, 0.000316975, 0.000232825, 0.00033211, 0.000247633, 0.000236438, 0.000273144, 0.000153141, 0.000225873, 0.000150418, 0.000118491, 9.99E-05, 8.62E-05, 0.000130826, 0.000148683, 0.000261716, 0.000271922, 9.24E-05, 0.000109506, 9.02E-05, 9.35E-05, 0.000102073, 0.000130387]
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
        createxAxis () {
            let x = [];
            for (let i = 0; i < 100; i++) {
                x.push(i + '');
            }
            return x;
        },
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            let xLabels = this.createxAxis();

            let option = {
                grid: {
                    height: '63%',
                    top: '8%',
                    left: '10%',
                    right: '5%',
                    width: '90%'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        realtime: true,
                        start: 30,
                        end: 70,
                        top: '80%',
                        height: '6%'
                    }
                ],
                xAxis: {
                    type: 'category',
                    data: xLabels,
                    gridIndex: 0
                },
                yAxis: {
                    type: 'value',
                    gridIndex: 0,
                    splitLine: false
                },
                series: {
                    data: this.loss_data.map((value, index) => ({
                        value: [index, value], // 数组第一个元素表示 x 坐标，第二个元素表示 y 坐标
                        itemStyle: {
                            color: 'blue'
                        },
                        emphasis: {
                            itemStyle: {
                                color: 'red',
                                shadowBlur: 20, // 设置阴影模糊度
                                shadowColor: 'rgba(255, 0, 0, 0.5)' // 设置阴影颜色
                            },
                            symbolSize: 100 // 设置高亮状态下的数据点大小
                        }
                    })),
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    xAxisIndex: 0
                }
            };

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
