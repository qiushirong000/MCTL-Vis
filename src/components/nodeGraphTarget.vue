<template>
    <div class="instance" ref="subcontainer">
      <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
        <el-row style="border: 0px solid #73ad21; height:100%;">
            <el-col :span="11">
              <div style="margin-top:4px; text-align: left; padding-left: 1.5em;"><label style="font-weight: bold;">{{title}}</label></div>
            </el-col>
            <el-col :span="10">
            <div style="margin-top:7px">
              <el-radio-group v-model="radio" @change="changeMode">
                <el-radio :label="1">mode 1</el-radio>
                <el-radio :label="2">mode 2</el-radio>
              </el-radio-group>
            </div>
            </el-col>
            <el-col :span="2">
                <div style="margin-top:7px"><el-button type="text" style="margin-top:-20px;color:steelblue" @click="checkGraph"><u>switch</u></el-button></div>
            </el-col>
        </el-row>
      </el-header>
      <component :is="this.comName" :show-header="false" :height="(height - 2)" :weightIndex="0"  :modelState="true"></component>
    </div>

</template>

<script>
import {store} from '../assets/js/DataManager.js';
import nodeGraphSingle from './nodeGraphSingle.vue';
import nodeGraphGates from './nodeGraphGates.vue';
import { eventBus, EVENTS } from '../assets/js/MessageCenter.js';
export default {
    name: 'nodeGraphTarget',
    components: { nodeGraphSingle, nodeGraphGates },
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
            comName: 'nodeGraphSingle',
            count: 1
        };
    },
    created () {
        this.loadRawData();
        eventBus.$on(EVENTS.UPDATE_SELECTED_EPOCH, () => {
            this.loadRawData();
        });
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
    },
    methods: {
        loadRawData () {
            this.$http.get('static/data/D7_to_D1_i1_layer1/epoch_' + store.readSelectedEpoch() + '.json').then((response) => {
                store.updateWeightGraphT(response.data);
            });
        },

        changeMode (param) {
            console.log('change mode :', param);
        },
        checkGraph () {
            if (this.count > 0) {
                this.comName = 'nodeGraphGates';
            } else {
                this.comName = 'nodeGraphSingle';
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
