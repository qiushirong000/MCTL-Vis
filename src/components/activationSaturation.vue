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
export default {
    name: 'activationSaturation',
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
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            let option = {
                tooltip: {},
                grid: {
                    height: '70%',
                    top: '15%',
                    left: '15%',
                    width: '75%'
                },
                xAxis: {
                    type: 'category',
                    data: [{
                        value: '-1',
                        textStyle: {
                            fontSize: 15,
                            padding: [0, 25, 0, 0]
                        }
                    }, '', '', '', '', '', '', '', '',
                    {
                        value: '1',
                        textStyle: {
                            fontSize: 15,
                            padding: [0, 0, 0, 25]
                        }
                    }],
                    axisTick: {
                        alignWithLabel: false
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: false
                },
                series: [{
                    name: '概率密度',
                    type: 'bar',
                    data: [1.26, 0.63, 0.42, 0.23, 0.16, 0.34, 0.22, 0.63, 0.73, 1.26],
                    barCategoryGap: 1
                }]
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
