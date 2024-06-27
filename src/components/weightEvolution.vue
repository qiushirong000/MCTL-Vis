<template>
    <div class="weightEvolution" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="22">
                    <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label
                            style="font-weight: bold; font-size: 15px;">{{ title }}</label></div>
                </el-col>
                <el-col :span="2">
                    <div style="margin-top:7px"><el-button type="text" style="margin-top:-20px;color:steelblue"
                            @click="swichChart"><u>switch</u></el-button></div>
                </el-col>
            </el-row>
        </el-header>
        <el-row style="border: 0px solid #73ad21; height:20px; width: 100%; ">
            <el-col :span="18">
                <div style="margin-top:7px"></div>
            </el-col>
            <el-col :span="5" style="margin-top: 5px; margin-left: 10px;">
                <el-select v-model="metricValue" placeholder="SW distance" size="medium">
                    <el-option v-for="item in metricOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
export default {
    name: 'weightEvolution',
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
                value: '1',
                label: 'nodes'
            }, {
                value: '2',
                label: 'edges'
            }, {
                value: '3',
                label: 'dense'
            }, {
                value: '4',
                label: 'SW distance'
            }],
            metricValue: '4',
            inputGateVal: [],
            forgetGateVal: [],
            outputGateVal: [],
            cellGateVal: [],
            InputWeightVal: []

        };
    },
    watch: {
        metricValue: function () {
            console.log(this.metricValue);
        }
    },
    created () {
        this.loadRawData();
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2) + 'vh' : this.height + 'vh';
        // 绘制视图
        // this.drawView();
    },

    methods: {
        loadRawData () {
            this.$http.get('static/data/weightEvolution.json').then(response => {
                // this.inputGateVal = response.data.input_gate_sw;
                // this.forgetGateVal = response.data.forget_gate_sw;
                // this.outputGateVal = response.data.output_gate_sw;
                // this.cellGateVal = response.data.cell_state_sw;
                // this.InputWeightVal = response.data.input_weight_sw;

                this.inputGateVal = response.data.input_gate_dense;
                this.forgetGateVal = response.data.forget_gate_dense;
                this.outputGateVal = response.data.output_gate_dense;
                this.cellGateVal = response.data.cell_state_dense;
                this.InputWeightVal = response.data.input_weight_dense;
                // console.log('input gate', response.data);
                // console.log(this.inputGateVal);
                this.drawView();
            });
        },
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
                    height: '55%',
                    top: '15%',
                    left: '10%',
                    right: '5%',
                    width: '80%'
                },
                legend: {
                    data: ['Wi', 'Wf', 'Wc', 'Wo', 'W'],
                    // data: ['Wr', 'Wu', 'Wc', 'W'],
                    top: '-1%'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: false,
                        realtime: true,
                        start: 0,
                        end: 100,
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
                    // min: 5,
                    // max: 0.5,
                    min: 'dataMin',
                    // max: 'dataMax',
                    splitLine: false
                },
                series: [
                    {
                        // name: 'Wr',
                        name: 'Wi',
                        type: 'line',
                        showSymbol: false,
                        smooth: false,
                        data: this.inputGateVal
                    },
                    {
                        // name: 'Wu',
                        name: 'Wf',
                        type: 'line',
                        showSymbol: false,
                        smooth: false,
                        data: this.forgetGateVal
                    },
                    {
                        name: 'Wo',
                        type: 'line',
                        showSymbol: false,
                        smooth: false,
                        data: this.outputGateVal
                    },
                    {
                        name: 'Wc',
                        type: 'line',
                        showSymbol: false,
                        smooth: false,
                        data: this.cellGateVal
                    },
                    {
                        name: 'W',
                        type: 'line',
                        showSymbol: false,
                        smooth: false,
                        data: this.InputWeightVal
                    }
                ]
            };

            option && this.myChart.setOption(option);
        }
    }
};
</script>
<style scoped>
.weightEvolution {
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
