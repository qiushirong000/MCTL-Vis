<template>
    <div class="instance" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="24">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold;">{{title}}</label></div>
                </el-col>
            </el-row>
        </el-header>

        <el-row type="flex" :gutter="5" style="width:100%; margin-top: 0px; margin-left: -2px; margin-right: 0px;">
            <el-col :span="12">
                <node-graph-single :height="(height - 1)/2" :title='"Input Gate"' :showHeader="false" :weightIndex="1" :modelState="modelState" style=" margin-top: -10px;"></node-graph-single>
            </el-col>
            <el-col :span="12">
                <node-graph-single :height="(height - 1)/2" :title='"Forget Gate"' :showHeader="false" :weightIndex="2" :modelState="modelState" style=" margin-top: -10px;"></node-graph-single>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="5" style="width:100%; margin-top: 15px; margin-left: -2px; margin-right: 0px;">
            <el-col :span="12">
                <node-graph-single :height="(height - 1)/2" :title='"Cell State"' :showHeader="false" :weightIndex="3" :modelState="modelState" style=" margin-top: -10px;"></node-graph-single>
            </el-col>
            <el-col :span="12">
                <node-graph-single :height="(height - 1)/2" :title='"Output Gate"' :showHeader="false" :weightIndex="4" :modelState="modelState" style=" margin-top: -10px;"></node-graph-single>
            </el-col>
        </el-row>
    </div>

</template>

<script>
import nodeGraphSingle from './nodeGraphSingle.vue';

export default {
    name: 'nodeGraphGates',
    components: { nodeGraphSingle },
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
        },
        modelState: {
            type: Boolean,
            default: false // false: S, true: T
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
    },
    methods: {

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
