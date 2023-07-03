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
// import {store} from '../assets/js/DataManager.js';

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
        eventBus.$on(EVENTS.UPDATE_SELECTED_NEURON, function (data) {
            // 选择SVG元素并删除所有子元素
            d3.select('svg').selectAll('*').remove();
            this.drawView();
        }.bind(this));
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 绘制视图
        this.drawView();
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

            // Create the SVG container for the graph
            // var svg = d3.select('svg');
            // let width = svg.attr('width');
            // let height = svg.attr('height');
            // 获取 SVG 容器的宽度和高度，并设置 viewBox 属性
            var svg = d3.select('svg');
            var bbox = svg.node().getBoundingClientRect();
            var width = bbox.width;
            var height = bbox.height;
            console.log('width: ' + width + ', height: ' + height);

            // Create the force simulation
            var simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id(d => d.id).distance(40))
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2));

            // 将节点位置限制在 SVG 容器内部
            simulation.force('x', d3.forceX().x(d => Math.min(width, d.x)))
                .force('y', d3.forceY().y(d => Math.min(height, d.y)));

            // Create the links between the nodes
            var link = svg.append('g')
                .attr('class', 'links')
                .selectAll('line')
                .data(links)
                .enter().append('line')
                .attr('stroke-width', 1.5)
                .attr('stroke', '#000');

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

            // Define the click event handler
            var selectedNode = null;

            function handleClick (d, i) {
            // 在控制台中打印出节点信息
                console.log('Clicked node ' + i + ': ' + JSON.stringify(d));
                // Save the selected node
                selectedNode = d3.select(this);
                console.log(selectedNode);

                // Reset the border style of all nodes
                node.selectAll('circle')
                    .attr('stroke-width', 2)
                    .attr('stroke', '#fff');

                // Update the border style of the clicked node
                selectedNode.select('circle')
                    .attr('stroke-width', 5)
                    .attr('stroke', 'red');

                // 将ID为2的节点设为选中状态，更改其颜色
                // d3.selectAll('.node')
                //     .filter((d, i) => i === 2)
                //     .select('circle')
                //     .attr('stroke', 'green');
            }

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
        },

        drawView2 () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            // 初始节点数据
            let data = [
                {
                    name: 'Node 1',
                    x: 500, // 自定义关系图节点出现的坐标，以达到关系图的自定义布局
                    y: 100
                },
                {
                    name: 'Node 2',
                    x: 200,
                    y: 300
                },
                {
                    name: 'Node 3',
                    x: 400,
                    y: 350
                },
                {
                    name: 'Node 4',
                    x: 500,
                    y: 500
                }
            ];

            // 初始边数据
            let links = [
                {
                    source: 0, // 可以为索引，也可以为节点的name
                    target: 1,
                    symbolSize: [5, 20],
                    lineStyle: { // 自定义关系图该边的宽度和曲度
                        width: 5,
                        curveness: 0.2
                    }
                },
                {
                    source: 'Node 1',
                    target: 'Node 3'
                },
                {
                    source: 'Node 2',
                    target: 'Node 3'
                },
                {
                    source: 'Node 2',
                    target: 'Node 4'
                },
                {
                    source: 'Node 1',
                    target: 'Node 4'
                },
                {
                    source: 'Node 3',
                    target: 'Node 4'
                }
            ];

            // 关系图数据
            let seriesData = [
                {
                    type: 'graph',
                    layout: 'none', // 自定义布局
                    symbolSize: 60,
                    roam: false,
                    zlevel: 1,
                    label: {
                        show: true,
                        position: 'left'
                    },
                    edgeSymbol: ['circle', 'arrow'], // 边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。这里设置为箭头
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 20
                    },
                    data: data, // 节点数据
                    links: links, // 边数据
                    lineStyle: { // 统一设置边的样式
                        opacity: 0.9,
                        width: 2, // 边的宽度
                        curveness: 0.1 // 曲度
                    }
                }
            ];

            let option = {
                title: {
                    text: 'Graph + Pie'
                },
                tooltip: {},
                series: seriesData
            };

            option && this.myChart.setOption(option);

            // 根据关系图的各节点信息得到饼图数据
            function getPieSeries (graphData, chart) {
                return graphData.map(function (item, index) {
                    // convertToPixel()方法的两个参数：第一个参数用来指定坐标系，第二个参数用来指定某个点
                    var center = chart.convertToPixel({seriesIndex: 0}, [item.x, item.y]);
                    return {
                        // 以下内容均可以根据自己的需求进行改变
                        name: item.name,
                        id: index + 'pie',
                        zlevel: 2,
                        type: 'pie',
                        center: center,
                        label: {
                            formatter: '{c}',
                            position: 'inside'
                        },
                        radius: 30,
                        data: [
                            { name: '工作', value: Math.round(Math.random() * 24) },
                            { name: '娱乐', value: Math.round(Math.random() * 24) },
                            { name: '睡觉', value: Math.round(Math.random() * 24) }
                        ]
                    };
                });
            }

            this.myChart.setOption({
                series: getPieSeries(data, this.myChart)
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
