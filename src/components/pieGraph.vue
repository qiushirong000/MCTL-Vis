<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; ">{{title}}</label></div>
            </el-col>
        </el-row>
      </el-header>
      <!-- <div class="chart" ref="chart"></div> -->
      <svg class="chart" ref="chart"></svg>
    </div>

</template>
<script>
import { eventBus, EVENTS } from '../assets/js/MessageCenter.js';
import {store} from '../assets/js/DataManager.js';

import * as d3 from 'd3';
export default {
    name: 'pieGraph',
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
        modelState: {
            type: Boolean,
            default: false // false: S, true: T
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
            edges: [],
            node_labels: [],
            selected_nodes: [],
            rawData: [],
            weightLabel: ['all_gates_topoloy', 'input_gate_topoloy', 'output_gate_topoloy', 'forget_gate_topoloy', 'cell_state_topoloy'],
            weightData: null,
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
                this.weightData = JSON.parse(data['input_gate']);
            }.bind(this));
        } else {
            eventBus.$on(EVENTS.UPDATE_WEIGHT_GRAPH_S, function (data) {
                this.rawData = data[this.weightLabel[this.weightIndex]];
                this.weightData = JSON.parse(data['input_gate']);
            }.bind(this));
        }
        eventBus.$on(EVENTS.SWITCH_MAPPER_VIEW, function () {
            console.log('SWITCH_MAPPER_VIEW');
        });
        // eventBus.$on(EVENTS.UPDATE_SELECTED_NEURON, function (data) {
        //     this.drawView();
        // }.bind(this));
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 读取数据,若数据存在则绘图
        if (this.modelState) {
            if (store.readWeightGraphT() !== null) {
                this.rawData = store.readWeightGraphT()[this.weightLabel[this.weightIndex]];
                this.weightData = JSON.parse(store.readWeightGraphT()['input_gate']);
            }
        } else {
            if (store.readWeightGraphS() !== null) {
                this.rawData = store.readWeightGraphS()[this.weightLabel[this.weightIndex]];
                this.weightData = JSON.parse(store.readWeightGraphS()['input_gate']);
            }
        }
        if (this.rawData !== undefined) {
            this.drawView();
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
            if (this.weightData === null) return;
            for (let key in this.rawData['nodes']) {
                let neurons = this.rawData['nodes'][key];
                let arr = [0, 0, 0, 0, 0];
                for (let i = 0; i < neurons.length; i++) {
                    for (let j = 0; j < arr.length; j++) {
                        arr[j] += Math.abs(this.weightData[j][neurons[i]]);
                    }
                }
                this.node_labels.push({
                    id: key,
                    name: neurons.toString(),
                    value: arr,
                    symbolSize: this.nodeBaseSize + this.nodeStepSize * this.rawData['nodes'][key].length
                });
            }
        },
        drawView () {
            // Create the data for the graph
            // var nodes = [
            //     { id: 0, group: 1, value: [30, 20, 50, 10, 5], symbolSize: 10 },
            //     { id: 1, group: 1, value: [10, 40, 50, 10, 15], symbolSize: 20 },
            //     { id: 2, group: 2, value: [50, 10, 40, 10, 20], symbolSize: 30 },
            //     { id: 3, group: 2, value: [20, 50, 30, 5, 10], symbolSize: 20 },
            //     { id: 4, group: 3, value: [40, 30, 30, 10, 25], symbolSize: 30 },
            //     { id: 5, group: 3, value: [30, 20, 50, 10, 15], symbolSize: 10 },
            //     { id: 6, group: 4, value: [50, 10, 40, 10, 5], symbolSize: 20 },
            //     { id: 7, group: 4, value: [20, 50, 30, 10, 5], symbolSize: 30 },
            //     { id: 8, group: 5, value: [40, 30, 30, 5, 5], symbolSize: 20 },
            //     { id: 9, group: 5, value: [30, 20, 50, 10, 20], symbolSize: 10 },
            //     { id: 10, group: 5, value: [30, 20, 50, 10, 20], symbolSize: 15 },
            //     { id: 11, group: 5, value: [30, 20, 20, 10, 20], symbolSize: 10 }
            // ];

            // var links = [
            //     { source: 0, target: 1 },
            //     { source: 0, target: 2 },
            //     { source: 1, target: 2 },
            //     { source: 2, target: 4 },
            //     { source: 3, target: 5 },
            //     { source: 4, target: 6 },
            //     { source: 5, target: 7 },
            //     { source: 6, target: 8 },
            //     { source: 7, target: 9 },
            //     { source: 7, target: 10 },
            //     { source: 7, target: 11 }
            // ];
            this.createEdges();
            this.createNodes();
            // console.log(this.edges);
            // console.log(this.node_labels);
            var nodes = this.node_labels;
            var links = this.edges;

            // 获取 SVG 容器的宽度和高度，并设置 viewBox 属性
            var svg = d3.select(this.$refs.chart);
            // 选择SVG元素并删除所有子元素
            svg.selectAll('*').remove();
            var bbox = svg.node().getBoundingClientRect();
            var width = bbox.width;
            var height = bbox.height;
            // console.log('width: ' + width + ', height: ' + height);

            // Create the force simulation
            var simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id(d => d.id).distance(40))
                .force('charge', d3.forceManyBody().strength(-200))
                .force('center', d3.forceCenter(width / 2, height / 2));

            const handleClick = (d, i) => {
                // Reset the border style of all nodes
                // node.selectAll('circle')
                //     .attr('stroke-width', 2)
                //     .attr('stroke', '#fff');
                // 在控制台中打印出节点信息
                // console.log('Clicked node ' + i + ': ' + JSON.stringify(d));

                // Define the click event handler
                let selectedNode = d3.select(this);
                // console.log(selectedNode);
                // Update the border style of the clicked node
                selectedNode.select('circle')
                    .attr('stroke-width', 5)
                    .attr('stroke', 'red');

                // 使用selected_nodes数组记录被选中的节点
                // this.selected_nodes = [];
                this.selected_nodes.push(d.id);
                console.log(this.selected_nodes);

                // 无重复绘制所有被选中的神经元
                // let selectedNeurons = new Set();
                // let tmp = d.name.split(',');
                // for (let i = 0; i < tmp.length; i++) {
                //     selectedNeurons.add(tmp[i]);
                // }
                // console.log(selectedNeurons);

                // let corrNode = null;
                // // 将node中name包括字符串'2'的节点设为选中状态，更改其颜色
                // corrNode = d3.selectAll('.node')
                //     .filter((d, i) => {
                //         return d.name.includes('2');
                //     });
                // corrNode.select('circle')
                //     .attr('stroke-width', 5)
                //     .attr('stroke', 'green');
            };

            // Create the links between the nodes
            var link = svg.append('g')
                .attr('class', 'links')
                .selectAll('line')
                .data(links)
                .enter().append('line')
                .attr('stroke-width', 1.5)
                .attr('stroke', '#000');
            // var that = this;
            // Create the nodes as pie charts
            var node = svg.append('g')
                .attr('class', 'nodes')
                .selectAll('.node')
                .data(nodes)
                .enter().append('g')
                .attr('class', 'node')
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
                .on('mouseover', showIdLabel)
                .on('mouseout', hideIdLabel)
                .on('click', handleClick);

            var pie = d3.pie()
                .sort(null);

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius((d, i) => {
                    return d.size;
                });

            let colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];

            node.selectAll('.arc')
                // .data(d => pie(d.value))
                .data(d => {
                    let p = pie(d.value);
                    for (let i = 0; i < p.length; i++) {
                        p[i]['size'] = d.symbolSize;
                    }
                    return p;
                })
                .enter().append('path')
                .attr('class', 'arc')
                .attr('d', arc)
                .attr('fill', (d, i) => {
                    switch (i) {
                    case 0:
                        return colors[0];
                    case 1:
                        return colors[1];
                    case 2:
                        return colors[2];
                    case 3:
                        return colors[3];
                    case 4:
                        return colors[4];
                    default:
                        return '#d62728';
                    }
                })
                .attr('stroke', '#fff') // 添加 stroke 属性
                .attr('stroke-width', 1.5); // 添加 stroke-width 属性

            node.append('circle')
                .attr('r', (d, i) => {
                    return d.symbolSize;
                })
                .attr('stroke', 'fff')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('cx', 0)
                .attr('cy', 0);

            // Add the id labels to the nodes
            // node.append('text')
            //     .attr('class', 'id-label')
            //     .attr('color', 'white')
            //     .text(d => d.id);

            // Update the positions of the links and nodes
            simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('transform', d => `translate(${d.x},${d.y})`);
            });

            // 将节点位置限制在 SVG 容器内部
            simulation.force('x', d3.forceX().x(d => Math.min(width, d.x)))
                .force('y', d3.forceY().y(d => Math.min(height, d.y)));

            // Functions for dragging the nodes
            function dragstarted (d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged (d) {
                d.fx = Math.max(8, Math.min(width, d3.event.x));
                d.fy = Math.max(8, Math.min(height, d3.event.y));
            }

            function dragended (d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            // Functions for showing and hiding the id labels on hover
            function showIdLabel (d) {
                d3.select(this).selectAll('.id-label').classed('show', true);
            }

            function hideIdLabel (d) {
                d3.select(this).selectAll('.id-label').classed('show', false);
            }
        }
    }
};
</script>
<style scoped>
    .instance {
        /* border: 1px solid rgb(0, 0, 0); */
        width: 100%;
        height: 30vh;
    }
    .chart {
        /* border: 1px solid gainsboro; */
        width: 100%;
        height: 27vh;
    }
</style>
