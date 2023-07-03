<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: small;">{{title}}</label></div>
            </el-col>
        </el-row>
        </el-header>
        <el-descriptions title="" :border="true" :column="1" :size="'medium'" style="margin-top:5px; margin-left: 5px; margin-right: 5px; " >
            <el-descriptions-item label="Model" labelStyle=" text-align: center;background-color: #F8F8FF; font-weight: bold; color: black; width:40%; font-size:xx-small;" contentStyle="padding-left: 2.5em">
                <button style="margin-top: -5%; height: 30px;">./SiLSTM.index</button>
            </el-descriptions-item>
            <el-descriptions-item label="Layer" labelStyle=" text-align: center;background-color: #F8F8FF; color: black; width:40%; font-size:xx-small;" contentStyle="padding-left: 2em">
                <label style="margin-top: -5%; height: 30px;font-weight: bold; padding-left: 1em;font-size:xx-small;">{{selectedlayer}}</label>
            </el-descriptions-item>
            <el-descriptions-item label="Neurons" labelStyle=" text-align: center;background-color: #F8F8FF; font-weight: bold; color: black; width:40%;font-size:xx-small;" contentStyle="padding-left: 2.8em; width:60%">
                <div class="data-container">
                    <label class="expend-label">{{ selectedNeurons }}</label>
                </div>
            </el-descriptions-item>
        </el-descriptions>
      <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
import {store} from '../assets/js/DataManager.js';
import { eventBus, EVENTS } from '../assets/js/MessageCenter.js';
export default {
    name: 'modelConfig',
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
            layersName: ['Input Layer', 'Attention Layer', 'Hidden Layer 1', 'Hidden Layer 2', 'Output Layer'],
            selectedlayer: 'Second Layer',
            selectedNeurons: '',
            LayerColor: ['LightGray', '#FFD700']
        };
    },
    created () {
        eventBus.$on(EVENTS.UPDATE_SELECTED_NEURON, function (data) {
            let neurons = Array.from(data);
            this.selectedNeurons = '';
            for (let i = 0; i < neurons.length; i++) {
                if (i === 0) {
                    this.selectedNeurons = neurons[i];
                } else {
                    this.selectedNeurons += ', ' + neurons[i];
                }
            }
        }.bind(this));
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 19) + 'vh' : this.height + 'vh';
        // 绘制视图
        this.drawView();
    },
    methods: {
        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            // 设置图表配置项
            let option = {
                series: [{
                    type: 'tree',
                    left: '10%',
                    right: '14%',
                    top: '8%',
                    roam: true,
                    edgeShape: 'polyline',
                    data: [{
                        name: 'Model',
                        symbolSize: [50, 20],
                        children: [{
                            name: 'Input Layer',
                            children: [{
                                name: 'X1'
                            }, {
                                name: 'X2'
                            }, {
                                name: 'X3'
                            }, {
                                name: 'X4'
                            }, {
                                name: 'X5'
                            }]
                        }, {
                            name: 'Attention Layer',
                            symbolSize: [90, 20]
                        }, {
                            name: 'LSTM Layer',
                            itemStyle: {
                                color: this.LayerColor[0]
                            },
                            children: [{
                                name: 'Input Gate'
                            }, {
                                name: 'Forget Gate'
                            }, {
                                name: 'Cell State'
                            }, {
                                name: 'Output Gate'
                            }]
                        }, {
                            name: 'LSTM Layer',
                            itemStyle: {
                                color: this.LayerColor[1]
                            },
                            children: [{
                                name: 'Input Gate'
                            }, {
                                name: 'Forget Gate'
                            }, {
                                name: 'Cell State'
                            }, {
                                name: 'Output Gate'
                            }]
                        }, {
                            name: 'Output Layer',
                            children: [{
                                name: 'Y1'
                            }]
                        }]
                    }],
                    orient: 'LR',
                    symbol: 'rect',
                    symbolSize: [70, 20],
                    label: {
                        position: 'inside',
                        color: '#000',
                        fontSize: 10,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        borderColor: '#000',
                        borderWidth: 1,
                        color: '#fff'
                    },
                    lineStyle: {
                        color: '#000',
                        width: 2,
                        type: 'solid',
                        curveness: 0.5
                    },
                    emphasis: {
                        label: {
                            show: true
                        },
                        lineStyle: {
                            color: '#ffd700',
                            width: 2
                        }
                    }
                }]
            };

            // 为每个节点添加点击事件
            this.myChart.on('click', function (params) {
                // 将被点击节点的颜色改为黄色
                params.event.target.style.fill = '#ffd700';
                // 输出被点击节点的名称
                // console.log(params.name);
                if (params.dataIndex === 9) {
                    this.selectedlayer = 'First Layer';
                    this.LayerColor[0] = 'yellow';
                    this.LayerColor[1] = 'LightGray';
                    store.updataSelectedLayer(1);
                    this.drawView();
                } else if (params.dataIndex === 14) {
                    this.selectedlayer = 'Second Layer';
                    this.LayerColor[0] = 'LightGray';
                    this.LayerColor[1] = 'yellow';
                    store.updataSelectedLayer(2);
                    this.drawView();
                }
            }.bind(this));
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
        border: 1px solid gainsboro;
        width: 100%;
        height: 27vh;
    }
    .data-container {
        width: 80%;  /* 设置容器的宽度 */
        height: 40px;  /* 设置容器的高度 */
        border: 1px solid rgb(0, 0, 0);
        overflow: auto;  /* 设置容器溢出时显示滚动条 */

    }
    .expend-label{
        margin-top: 3%;
        margin-bottom: 3%;
        height: auto;
        font-weight: bold;
        padding-left: 1em;
        display: block;
    }
    .data-container::-webkit-scrollbar {
        height: 10px;  /* 设置滚动条的宽度 */
        width: 10px;  /* 设置滚动条的宽度 */
    }

    .data-container::-webkit-scrollbar-thumb {
        background-color: #888;  /* 设置滚动条的颜色 */
    }

</style>
