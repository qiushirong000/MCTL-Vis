<template>
    <div class="instance" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="22">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>

                </el-col>
                <el-col :span="2">
                    <div style="margin-top:7px"><el-button type="text" style="margin-top:-20px;color:steelblue" @click="swichChart"><u>switch</u></el-button></div>
                </el-col>
            </el-row>
        </el-header>
        <el-row style="border: 0px solid #73ad21; height:25px; width: 100%; ">
            <div v-if="mode === 0">
                <el-col :span="18">
                    <div style="margin-top:7px"></div>
                </el-col>
                <el-col :span="4" style="margin-top: 5px;">
                    <el-select v-model="metricValue" placeholder="MSE" size="mini">
                        <el-option
                        v-for="item in metricOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </div>
            <div v-else-if="mode === 1">
                <el-col :span="18">
                    <div style="margin-top:7px"></div>
                </el-col>
                <el-col :span="5">
                    <label style="fontWeight: bold">Instance:</label>
                    <input id="instance" type="text" :value="0" style="width:40%; textAlign: center">
                </el-col>
            </div>
        </el-row>
      <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
export default {
    name: 'modelEvaluation',
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
                value: '选项1',
                label: 'RMSE'
            }, {
                value: '选项2',
                label: 'R2'
            }, {
                value: '选项3',
                label: 'MSE'
            }, {
                value: '选项4',
                label: 'MAPE'
            }],
            metricValue: '',
            mode: 0,
            fileData: null,
            train_loss: null,
            test_loss: null,
            predict_value: [0.3561941, 0.35645542, 0.35546702, 0.35532138, 0.35527757, 0.35509133, 0.35520995, 0.3555913, 0.3559639, 0.35618153, 0.35623983, 0.3561739, 0.35605365, 0.35596982, 0.35598263, 0.3561018, 0.35629928, 0.35652864, 0.356739, 0.35688642,
                0.35694566, 0.35691637, 0.35681736, 0.35667604, 0.35652184, 0.35638726, 0.35630742, 0.35630772, 0.35638678, 0.35651785, 0.35666624, 0.35680383, 0.35692275, 0.35699564, 0.35701725, 0.35700598, 0.35694912, 0.35686114, 0.35675073, 0.3566404,
                0.3565473, 0.3564896, 0.35646948, 0.35647875, 0.3570786, 0.35702518, 0.35743755, 0.35732087, 0.3576461, 0.35754555, 0.35719138, 0.35686317, 0.35683438, 0.3577928, 0.35680687, 0.3563533, 0.3576354, 0.35717404, 0.3581234, 0.35857698,
                0.3585885, 0.35837913, 0.35799447, 0.3575363, 0.3572357, 0.35742527, 0.35809776, 0.3589855, 0.35973915, 0.36002275],
            real_value: [0.35542275, 0.35544352, 0.35544352, 0.35547676, 0.35547676, 0.35547676, 0.35579877, 0.35608753, 0.35637215, 0.35655496,
                0.35670662, 0.35687282, 0.35739426, 0.35772458, 0.35799673, 0.35821901, 0.35821901, 0.35844338, 0.35858465, 0.35870099, 0.35879655, 0.35889004, 0.35895028, 0.35900014, 0.35904169, 0.35907493, 0.35910817, 0.35912894, 0.35912894, 0.35916011,
                0.35916011, 0.35918504, 0.35905831, 0.358755, 0.35845169, 0.35825641, 0.35825641, 0.35809852, 0.35775366, 0.35735063, 0.35694968, 0.35669415, 0.35648433, 0.3563119, 0.35617271, 0.35603144, 0.35594211, 0.3558237, 0.35543937, 0.35505296,
                0.35480782, 0.35460422, 0.3544401, 0.35430507, 0.35417003, 0.35408278, 0.35401215, 0.35401215, 0.35394359, 0.35419496, 0.35473303, 0.35551, 0.3561831, 0.35727377, 0.35829173, 0.35917673, 0.36023416, 0.36177563, 0.36298472, 0.36410447]
            // loss_data: [0.000559658, 0.000462189, 0.000383154, 0.000355514, 0.00042927, 0.000369741, 0.000799258, 0.000388272, 0.000320224, 0.000505685, 0.000264274, 0.000224991, 0.00024769, 0.000255003, 0.000256082, 0.00026289, 0.000217568, 0.000524743, 0.000281544, 0.000301619, 0.000243574, 0.000215558, 0.000379385, 0.000358053, 0.000415624, 0.000267315, 0.000365729, 0.0003149, 0.000305853, 0.000364189, 0.000258196, 0.000398429, 0.000358676, 0.000332635, 0.000236722, 0.000305553, 0.000250649, 0.000309203, 0.00023299, 0.000390952, 0.000227389, 0.000332752, 0.000203532, 0.000301097, 0.000306164, 0.000251769, 0.000265595, 0.00023098, 0.000278979, 0.00022975, 0.000209579, 0.000284754, 0.000214058, 0.000164795, 0.000123903, 0.000201713, 0.000192873, 0.000196366, 0.000278811, 0.000159023, 0.000206587, 0.000251198, 0.000187441, 0.00021466, 0.000262531, 0.000268078, 0.000213872, 0.000258242, 0.000186081, 0.000196369, 1.00E-04, 0.000412538, 0.000171848, 0.000166004, 0.000171214, 0.000319351, 0.000279812, 0.000282398, 0.000316975, 0.000232825, 0.00033211, 0.000247633, 0.000236438, 0.000273144, 0.000153141, 0.000225873, 0.000150418, 0.000118491, 9.99E-05, 8.62E-05, 0.000130826, 0.000148683, 0.000261716, 0.000271922, 9.24E-05, 0.000109506, 9.02E-05, 9.35E-05, 0.000102073, 0.000130387]
        };
    },
    watch: {
        fileData: function () {
            if (this.fileData !== null) { this.drawView(); }
        }
    },
    created () {
        this.loadRawData();
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 2.5) + 'vh' : this.height + 'vh';
        // 绘制视图
        // this.drawView();
    },
    methods: {
        swichChart () {
            if (this.mode === 0) {
                this.mode = 1;
            } else {
                this.mode = 0;
            }
            this.drawView();
        },
        createxAxis () {
            let x = [];
            for (let i = 0; i < 100; i++) {
                x.push(i + '');
            }
            return x;
        },
        loadRawData () {
            this.$http.get('static/data/loss_data.csv').then(response => {
                // this.fileData = response.data;
                const csvData = response.data;
                const lines = csvData.split('\n');
                const dataArray = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].split(',');
                    const floatLine = line.map(value => parseFloat(value));
                    dataArray.push(floatLine);
                }
                this.fileData = dataArray;

                // 获取损失值数组
                this.train_loss = this.fileData.map(value => value[2]);
                this.test_loss = this.fileData.map(value => value[3]);
                // this.train_loss[22] -= 0.001;
                // this.train_loss[28] += 0.0019;
                // this.test_loss[28] += 0.0015;
                // console.log(this.train_loss);
                // console.log(this.test_loss);
            });

            // this.$http.get('static/data/loss_data.json').then(response => {
            //     this.fileData = response.data;
            //     // 获取损失值数组
            //     this.train_loss = this.fileData.train_losses;
            //     this.test_loss = this.fileData.val_losses;
            //     console.log(this.train_loss);
            //     console.log(this.test_loss);
            // });
        },
        drawView () {
            if (this.mode === 0) {
                this.drawLossView();
            } else {
                this.drawPredictView();
            }
        },
        drawLossView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            let xLabels = this.createxAxis();

            let option = {
                grid: {
                    height: '63%',
                    top: '4%',
                    left: '10%',
                    right: '5%',
                    width: '85%'
                },
                legend: {
                    data: ['train loss', 'valid loss'],
                    top: '0%'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
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
                    max: 0.03,
                    min: 0,
                    splitLine: false
                },
                series: [
                //     {
                //     data: this.loss_data.map((value, index) => ({
                //         value: [index, value], // 数组第一个元素表示 x 坐标，第二个元素表示 y 坐标
                //         itemStyle: {
                //             color: index === 40 ? 'red' : 'blue'
                //         },
                //         emphasis: {
                //             itemStyle: {
                //                 color: 'red',
                //                 shadowBlur: 20, // 设置阴影模糊度
                //                 shadowColor: 'rgba(255, 0, 0, 0.5)' // 设置阴影颜色
                //             },
                //             symbolSize: 100 // 设置高亮状态下的数据点大小
                //         }
                //     })),
                //     type: 'line',
                //     smooth: true,
                //     yAxisIndex: 0,
                //     xAxisIndex: 0
                // },
                    {
                        name: 'train loss',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        data: this.train_loss

                    },
                    {
                        name: 'valid loss',
                        type: 'line',
                        smooth: true,
                        color: 'orange',
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        data: this.test_loss
                    }
                ]
            };

            option && this.myChart.setOption(option);
        },
        drawPredictView () {
            if (this.$refs.chart === undefined) return;
            if (this.myChart === null) { this.myChart = this.$echarts.init(this.$refs.chart); }
            let xLabels = this.createxAxis();

            let option = {
                grid: {
                    height: '63%',
                    top: '6%',
                    left: '10%',
                    right: '5%',
                    width: '85%'
                },
                legend: {
                    data: ['predict value', 'real value'],
                    top: '0%'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 70,
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
                    min: 'dataMin',
                    splitLine: false
                },
                series: [
                    {
                        name: 'predict value',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        data: this.predict_value
                    },
                    {
                        name: 'real value',
                        type: 'line',
                        smooth: true,
                        color: 'red',
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        data: this.real_value
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
