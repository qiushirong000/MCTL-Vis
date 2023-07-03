<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="24">
              <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; ">{{title}}</label></div>

            </el-col>
        </el-row>
      </el-header>
      <div class="chart" ref="chart"></div>
    </div>

</template>

<script>
import boundarydata from '../assets/data/road2-12-9road/boundaryroad.json';
import crosswalkdata from '../assets/data/road2-12-9road/crosswalkroad.json';
import laneroaddata from '../assets/data/road2-12-9road/laneroad.json';
import signalroaddata from '../assets/data/road2-12-9road/signalroad.json';
import stoplinedata from '../assets/data/road2-12-9road/stoplineroad.json';

export default {
    name: 'trafficMap',
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
            /*
            const filteredFeatures = [];
            var fid = [];
            laneroaddata.features.forEach((feature) => {
                if (feature.properties && feature.properties.lane_count === 3) {
                    fid.push({
                        name: feature.properties.fid,
                        coordinate: [
                            feature.geometry.coordinates[0][0],
                            feature.geometry.coordinates[0][1]
                        ]
                    });
                    // feature.geometry.coordinates = [feature.geometry.coordinates[0], feature.geometry.coordinates[feature.geometry.coordinates.length - 1]]
                    filteredFeatures.push(feature);
                }
            });
            let mergedFeatures = boundarydata.features.concat(
                crosswalkdata.features.concat(
                    laneroaddata.features.concat(
                        signalroaddata.features.concat(stoplinedata.features)
                    )
                )
            );
            console.log(mergedFeatures);
            // 3. 将筛选后的 features 转换为 GeoJSON 格式
            const filteredGeoJSON = {
                type: 'FeatureCollection',
                features: mergedFeatures
            };

            this.$echarts.registerMap('data', { geoJSON: filteredGeoJSON });
            */

            this.$echarts.registerMap('边界线', { geoJSON: boundarydata });
            this.$echarts.registerMap('人行道', { geoJSON: crosswalkdata });
            this.$echarts.registerMap('线道路', { geoJSON: laneroaddata });
            this.$echarts.registerMap('signal', { geoJSON: signalroaddata });
            this.$echarts.registerMap('停车线', { geoJSON: stoplinedata });
            var option = {
                toolbox: {},
                geo: [
                    {
                        map: '边界线',
                        aspectScale: 1,
                        layoutSize: '100%',
                        projection: 'map',
                        show: false,
                        roam: true,
                        // center: [200, -500],
                        zoom: 1,
                        itemStyle: {
                            areaColor: 'gray',
                            borderColor: 'blue'
                        },
                        regions: [{
                            name: 95,
                            itemStyle: {
                                areaColor: 'red',
                                color: 'red',
                                borderColor: 'orange',
                                borderWidth: 100
                            }
                        }]

                        // label: {
                        //   show: true,
                        //   formatter: function (params) {
                        //     console.log(params)
                        //     return params.name

                        //   }
                        //   // emphasis: {
                        //   //   show: false
                        //   // }
                        // },
                    },
                    {
                        map: '人行道',
                        aspectScale: 1,
                        layoutSize: '100%',
                        projection: 'map',
                        show: false,
                        roam: true,
                        // center: [-100, -200],
                        zoom: 1,
                        itemStyle: {
                            areaColor: 'red',
                            borderColor: 'black'
                        },
                        regions: [{
                            name: 100,
                            itemStyle: {
                                borderColor: 'green',
                                borderWidth: 30
                            }
                        }]
                    },
                    {
                        map: '线道路',
                        aspectScale: 1,
                        layoutSize: '100%',
                        show: false,
                        roam: true,
                        // center: [200, -500],
                        zoom: 1,
                        itemStyle: {
                            areaColor: 'gray',
                            borderColor: 'black'
                        }
                    },
                    {
                        map: 'signal',
                        backgroundColor: '#232e67',
                        aspectScale: 1,
                        layoutSize: '100%',
                        show: true,
                        roam: true,
                        // center: [200, -500],
                        label: {
                            show: true
                        },
                        zoom: 10,
                        itemStyle: {
                            areaColor: 'gray',
                            borderColor: 'black',
                            borderWidth: 100
                        }
                    },
                    {
                        map: '停车线',
                        aspectScale: 1,
                        layoutSize: '100%',
                        show: false,
                        roam: true,
                        // center: [200, -500],
                        zoom: 1,
                        itemStyle: {
                            areaColor: 'gray',
                            borderColor: 'black'
                        }
                    }
                ]
                // series: [{ // 配置地图上的元素
                //     type: 'scatter',
                //     coordinateSystem: 'geo',
                //     data: [
                //         { name: '北京', value: [-236.0309374121, 5.0416777162] },
                //         { name: '上海', value: [-236.9969299946, 3.5091866154] },
                //         { name: '广州', value: [113.23, 23.16] }
                //     ],
                //     itemStyle: { // 配置元素的样式
                //         color: '#FF0000'
                //     },
                //     label: { // 配置元素的标签
                //         show: true,
                //         formatter: '{b}',
                //         color: '#333',
                //         fontSize: 12
                //     }
                // }]
                /*
                series: [
                    {
                        type: 'map',
                        map: 'data',
                        aspectScale: 1,
                        zoom: 1,
                        // center: [-100, -10],
                        roam: true,

                        layoutSize: '100%',
                        // markPoint: {
                        //   symbol: 'none'
                        // },
                        // showLegendSymbol: false,
                        label: {
                            show: false,
                            // formatter: function (params) {
                            //   // 获取当前label的样式
                            //   console.log(params);

                            //   // 根据数据项的值来设置颜色
                            //   if (params) {
                            //     return "{a|" + params.name + "}";
                            //   } else {
                            //     return "{b|" + params.name + "}";
                            //   }
                            //   // console.log('caonima')
                            // },
                            rich: {
                                a: {
                                    color: 'red'
                                },
                                b: { color: 'blue' }
                            }
                        },
                        itemStyle: {
                            areaColor: 'gray',
                            borderColor: 'black'
                        }
                    }
                ]
                */
            };
            this.myChart.setOption(option);
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
