<template>
    <div class="modelPerformance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="4" style="margin-top: 5px; margin-left: -20px; margin-right: -20px;">
            <el-col :span="12">
                <activation-saturation :height="12" :show-header="false" :title="'Activation Saturation'"></activation-saturation>
            </el-col>
            <el-col :span="12">
                <activation-distribution :height="12" :show-header="false" :title="'Activation Distribution'"></activation-distribution>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="3" style="margin-top: 3px; margin-left: -17px; margin-right: -20px;">
            <model-evaluation :height="14" :title="'Loss value curve'" :show-header="false"></model-evaluation>
        </el-row>
      </el-header>
      <!-- <div class="chart" ref="chart"></div> -->
    </div>

</template>

<script>
import activationDistribution from './activationDistribution.vue';
import activationSaturation from './activationSaturation.vue';
import modelEvaluation from './modelEvaluation.vue';
export default {
    components: {
        activationDistribution,
        activationSaturation,
        modelEvaluation
    },
    name: 'modelPerformance',
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
        // this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 绘制视图
        // this.drawView();
    },
    methods: {
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            let option = {
                xAxis: {
                    data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
                },
                yAxis: {},
                series: [
                    {
                        type: 'candlestick',
                        data: [
                            [20, 34, 10, 38],
                            [40, 35, 30, 50],
                            [31, 38, 33, 44],
                            [38, 15, 5, 42]
                        ]
                    }
                ]
            };

            option && this.myChart.setOption(option);
        }
    }
};
</script>
<style scoped>
    .modelPerformance {
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
