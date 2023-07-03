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
import { eventBus, EVENTS } from '../assets/js/MessageCenter.js';
import {store} from '../assets/js/DataManager.js';

export default {
    name: 'nodeGraphSingle',
    props: {
        title: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 500
        },
        weightIndex: {
            type: Number,
            default: 0
        },
        showHeader: {
            type: Boolean,
            required: true,
            default: false
        },
        modelState: {
            type: Boolean,
            default: false // false: S, true: T
        }
    },
    data () {
        return {
            myChart: null,
            edges: [],
            node_labels: [],
            selected_nodes: [],
            rawData: [],
            weightLabel: ['all_gates_topoloy', 'input_gate_topoloy', 'output_gate_topoloy', 'forget_gate_topoloy', 'cell_state_topoloy'],
            nodeBaseSize: 12,
            nodeStepSize: 0.4,
            edgeGravity: 0.15
        };
    },
    watch: {
        rawData: function () {
            if (this.rawData !== undefined) { this.drawView(); }
        }
    },
    created () {
        // 监听事件
        if (this.modelState) {
            eventBus.$on(EVENTS.UPDATE_WEIGHT_GRAPH_T, function (data) {
                this.rawData = data[this.weightLabel[this.weightIndex]];
            }.bind(this));
        } else {
            eventBus.$on(EVENTS.UPDATE_WEIGHT_GRAPH_S, function (data) {
                this.rawData = data[this.weightLabel[this.weightIndex]];
            }.bind(this));
        }
        eventBus.$on(EVENTS.SWITCH_MAPPER_VIEW, function () {
            console.log('SWITCH_MAPPER_VIEW');
        });
        eventBus.$on(EVENTS.UPDATE_SELECTED_NEURON, function (data) {
            this.drawView();
        }.bind(this));
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 读取数据,若数据存在则绘图
        if (this.modelState) {
            if (store.readWeightGraphT() !== null) {
                this.rawData = store.readWeightGraphT()[this.weightLabel[this.weightIndex]];
            }
        } else {
            if (store.readWeightGraphS() !== null) {
                this.rawData = store.readWeightGraphS()[this.weightLabel[this.weightIndex]];
            }
        }
        if (this.rawData !== undefined) {
            this.drawView();
            // 确保绑定了一次事件监听器
            this.myChart.on('click', function (param) {
                if (param.dataType === 'node') {
                    console.log('点击了节点', param.data.name);
                    this.selectNodeEvent(param.dataIndex);
                } else {
                    console.log('点击了边', param);
                }
            }.bind(this));
        }
    },
    methods: {
        createEdges () {
            this.edges = [];
            for (let key in this.rawData['links']) {
                for (let innerKey in this.rawData['links'][key]) {
                    this.edges.push({
                        source: key,
                        target: this.rawData['links'][key][innerKey]
                    });
                }
            }
        },
        createNodes () {
            this.node_labels = [];
            for (let key in this.rawData['nodes']) {
                this.node_labels.push({
                    id: key,
                    name: this.rawData['nodes'][key].toString(),
                    itemStyle: {
                        color: 'steelblue'
                    },
                    symbolSize: this.nodeBaseSize + this.nodeStepSize * this.rawData['nodes'][key].length
                });
            }
        },

        // series会被经常修改，为了代码更加简洁，单独通过函数获取
        GetOptionSeries () {
            let series = [
                {
                    type: 'graph',
                    layout: 'force',
                    animation: true,
                    draggable: true,
                    //   symbolSize: this.height / 50 * 20,
                    data: this.node_labels,
                    force: {
                        repulsion: 90,
                        edgeLength: this.height * 1.2,
                        gravity: this.edgeGravity
                    },
                    lineStyle: {
                        width: this.height / 100 * 5
                    },
                    edges: this.edges,
                    emphasis: {
                        focus: 'none',
                        label: {
                            position: 'right',
                            show: true
                        },
                        itemStyle: {
                            scale: 4
                        }
                    }
                }
            ];
            return series;
        },

        updateNodeColor () {
            let selectedNeurons = Array.from(store.readSelectedNeuron());
            if (selectedNeurons.length > 0) {
                let count = 0;
                for (let key in this.rawData['nodes']) {
                    let elements = this.rawData['nodes'][key];
                    let intersection = elements.filter(item => {
                        return selectedNeurons.includes(item);
                    });
                    if (intersection.length === elements.length) {
                        this.node_labels[count].itemStyle.color = '#E24A52'; // 被选中或完全覆盖的节点
                    } else if (intersection.length === 0) {
                        this.node_labels[count].itemStyle.color = 'steelblue'; // 未被选中的节点
                    } else {
                        this.node_labels[count].itemStyle.color = '#FFDEAD'; // 相关的节点
                    }
                    count = count + 1;
                }
            }

            // 重新绘图
            var option = {
                tooltip: {},
                title: {
                    text: this.title,
                    left: '4%',
                    top: '2%',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'bolder'
                    }
                },
                series: this.GetOptionSeries()
            };
            option && this.myChart.setOption(option);
        },

        drawView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            this.createEdges();
            this.createNodes();
            this.updateNodeColor();
        },
        selectNodeEvent (index) {
            if (this.node_labels[index].itemStyle.color === 'red') {
                let delIndex = this.selected_nodes.indexOf(index);
                if (delIndex !== -1) { this.selected_nodes.splice(delIndex, 1); }
            } else {
                this.selected_nodes.push(index);
            }
            // 无重复绘制所有被选中的神经元
            let selectedNeurons = new Set();
            for (let i = 0; i < this.selected_nodes.length; i++) {
                let element = this.node_labels[this.selected_nodes[i]].id;
                let neurons = this.rawData['nodes'][element];
                for (let j = 0; j < neurons.length; j++) {
                    selectedNeurons.add(neurons[j]);
                }
            }
            store.updateSelectedNeuron(selectedNeurons);
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
</style>
