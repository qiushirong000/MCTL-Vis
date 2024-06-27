<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="11">
              <div style="margin-top:4px; text-align: left; padding-left: 1.5em;"><label style="font-weight: bold; font-size: 15px;">{{title}}</label></div>
            </el-col>
            <el-col :span="10">
            <div style="margin-top:7px">
              <!-- <el-radio-group v-model="radio" @change="changeMode">
                <el-radio :label="1">mode 1</el-radio>
                <el-radio :label="2">mode 2</el-radio>
              </el-radio-group> -->
            </div>
          </el-col>
          <el-col :span="2">
            <div style="margin-top:7px"><el-button type="text" style="margin-top:-20px;color:steelblue" @click="checkGraph"><u>switch</u></el-button></div>
          </el-col>
        </el-row>
      </el-header>
      <component :is="this.comName" :show-header="false" :height="(height - 2)" :weightIndex="0"  :modelState="false"></component>
    </div>

</template>

<script>
import {store} from '../assets/js/DataManager.js';
import nodeGraphSingle from './nodeGraphSingle.vue';
import nodeGraphGates from './nodeGraphGates.vue';
import pieGraph from './pieGraph.vue';

export default {
    name: 'nodeGraphSource',
    components: {
        nodeGraphSingle,
        nodeGraphGates,
        pieGraph},
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
            radio: 1,
            // comName: 'nodeGraphSingle',
            comName: 'pieGraph',
            count: 1
        };
    },
    created () {
        this.loadRawData();
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
    },
    methods: {
        // 加载static/data/transfer_sample/epoch_0.json文件，存储到fileData中
        loadRawData () {
            this.$http.get('static/data/' + store.filePath + '/epoch_2.json').then((response) => {
                store.updateWeightGraphS(response.data);
            });
        },
        changeMode (param) {
            console.log('change mode :', param);
            store.updateSelectedNeuron(new Set());
        },
        checkGraph () {
            if (this.count > 0) {
                this.comName = 'nodeGraphGates';
            } else {
                // this.comName = 'nodeGraphSingle';
                this.comName = 'pieGraph';
            }
            // console.log('change mode ... ' + this.comName);
            store.SwitchMapperViewEvent();
            this.count = this.count * -1;
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
