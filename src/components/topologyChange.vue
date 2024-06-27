<template>
    <div class="topologyChange" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="22">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px; ">{{title}}</label></div>
            </el-col>
            <el-col :span="2">
                <div style="margin-top:7px"><el-button type="text" style="margin-top:-20px;color:steelblue" @click="swichChart"><u>switch</u></el-button></div>
            </el-col>
        </el-row>
      </el-header>
      <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
export default {
    name: 'topologyChange',
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
        swichChart () {

        },
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            let option = {
                // tooltip: {
                //     trigger: 'item',
                //     triggerOn: 'mousemove'
                // },
                animation: false,
                series: [
                    {
                        type: 'sankey',
                        bottom: '10%',
                        emphasis: {
                            focus: 'adjacency'
                        },
                        data: [
                            { name: 'subGS 0' },
                            { name: 'subGS 1' },
                            { name: 'subGS 2' },
                            { name: 'subGS 3' },
                            { name: 'subGS 4' },
                            { name: 'subGS 5' },
                            { name: 'subGM 0' },
                            { name: 'subGM 1' },
                            { name: 'subGM 2' },
                            { name: 'subGM 3' },
                            { name: 'subGM 4' },
                            { name: 'subGM 5' },
                            { name: 'subGT 0' },
                            { name: 'subGT 1' },
                            { name: 'subGT 2' },
                            { name: 'subGT 3' },
                            { name: 'subGT 4' },
                            { name: 'subGT 5' },
                            { name: 'subGT 6' }
                        ],
                        links: [
                            { source: 'subGS 0', target: 'subGM 0', value: 3 },
                            { source: 'subGS 1', target: 'subGM 1', value: 23 },
                            { source: 'subGS 2', target: 'subGM 2', value: 20 },
                            { source: 'subGS 2', target: 'subGM 3', value: 3 },
                            { source: 'subGS 3', target: 'subGM 3', value: 17 },
                            { source: 'subGS 4', target: 'subGM 1', value: 5 },
                            { source: 'subGS 4', target: 'subGM 4', value: 28 },
                            { source: 'subGS 5', target: 'subGM 5', value: 2 },

                            { source: 'subGM 0', target: 'subGT 0', value: 2 },
                            { source: 'subGM 0', target: 'subGT 1', value: 1 },
                            { source: 'subGM 1', target: 'subGT 1', value: 22 },
                            { source: 'subGM 1', target: 'subGT 5', value: 5 },
                            { source: 'subGM 2', target: 'subGT 2', value: 20 },
                            { source: 'subGM 3', target: 'subGT 3', value: 15 },
                            { source: 'subGM 3', target: 'subGT 4', value: 5 },
                            { source: 'subGM 4', target: 'subGT 4', value: 23 },
                            { source: 'subGM 4', target: 'subGT 5', value: 5 },
                            { source: 'subGM 5', target: 'subGT 6', value: 2 }

                        ],
                        orient: 'vertical',
                        label: {
                            position: 'top'
                        },
                        lineStyle: {
                            // color: 'source',
                            curveness: 0.5
                        },
                        left: '10%', // 左边距百分比或像素值
                        right: '10%', // 右边距百分比或像素值
                        top: '10%',
                        levels: [
                            {
                                depth: 0,
                                itemStyle: {
                                    color: '#56B8CF'
                                },
                                lineStyle: {
                                    color: 'LightGray',
                                    opacity: 0.6
                                }
                            },
                            {
                                depth: 1,
                                itemStyle: {
                                    color: 'steelblue'
                                },
                                lineStyle: {
                                    color: 'LightGray',
                                    // color: 'source',
                                    opacity: 0.6
                                }
                            },
                            {
                                depth: 2,
                                itemStyle: {
                                    color: 'orange'
                                },
                                lineStyle: {
                                    color: 'source',
                                    opacity: 0.6
                                }
                            }]
                    }
                ]
            };

            option && this.myChart.setOption(option);
        }
    }
};
</script>
<style scoped>
    .topologyChange {
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
