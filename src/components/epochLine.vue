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

export default {
    name: 'epochLine',
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
            epochLabel: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
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
        createTestEpochLable (len) {
            this.epochLabel = [];
            for (let i = 0; i < len + 1; i++) {
                this.epochLabel.push('' + i);
            }
        },
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            this.createTestEpochLable(store.readEpochNum());
            let option = {
                timeline: {
                    axisType: 'category',
                    left: '0%',
                    right: '0%',
                    autoPlay: false,
                    loop: true,
                    playInterval: 1000,
                    data: this.epochLabel
                }
            };
            option && this.myChart.setOption(option);
            this.myChart.on('timelinechanged', function (params) {
                store.updateSelectedEpoch(params.currentIndex);
            });
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
