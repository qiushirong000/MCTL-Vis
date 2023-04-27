<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold;">{{title}}</label></div>

            </el-col>
        </el-row>
      </el-header>
        <el-row style="border: 0px solid #73ad21; height:100%">
            <el-col :span="8">
                <el-form ref="form" label-width="80px" size="mini" style="margin-top: 10px;">
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
            <el-col :span="16">
                <div class="chart" ref="chart"></div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
export default {
    name: 'stateComparison',
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
            // 配置图表参数
            var option = {
                // 设置图表的标题
                grid: {
                    top: '20%',
                    height: '80%'
                },
                // 设置图表的工具栏
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                // 设置图表的提示框
                tooltip: {},
                // 设置图表的图例
                legend: {
                    data: ['source model', 'target model']
                },
                // 设置 X 轴的数据
                xAxis: {
                    data: ['A', 'B', 'C', 'D', 'E'],
                    position: 'bottom',
                    axisLabel: {
                        show: false,
                        margin: -1
                    }
                },
                // 设置 Y 轴的数据
                yAxis: [
                    {
                        // 设置 Y 轴的最小值
                        min: -50,
                        // 设置 Y 轴的最大值
                        max: 50,
                        axisLabel: {
                            show: false
                        },
                        splitLine: false
                    },
                    {
                        // 设置 Y 轴的最小值
                        min: -50,
                        // 设置 Y 轴的最大值
                        max: 50,
                        inverse: true,
                        axisLabel: {
                            show: false
                        },
                        splitLine: false
                    }
                ],
                // 设置数据系列
                series: [
                    {
                        // 设置数据系列的名称
                        name: 'source model',
                        // 设置数据系列的类型
                        type: 'bar',
                        // 设置数据系列的数据
                        // data: [13, 13, 10, 18, 13],
                        // data: [13, 13, 10, 18, 13],
                        data: [13, 15, 15, 13, 20],
                        // 设置柱形的样式
                        itemStyle: {
                            color: '#00DED7'
                        },
                        label: {
                            show: true,
                            verticalAlign: 'bottom',
                            offset: [0, -15]
                        }
                    },
                    {
                        // 设置数据系列的名称
                        name: 'target model',
                        // 设置数据系列的类型
                        type: 'bar',
                        // 设置数据系列的数据
                        data: [18, 16, 17, 12, 19],
                        // 设置柱形的样式
                        itemStyle: {
                            color: '#FF6666'
                        },
                        barGap: '-100%',
                        yAxisIndex: 1,
                        label: {
                            show: true,
                            verticalAlign: 'top',
                            offset: [0, 20]
                        }
                    }
                ]
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
