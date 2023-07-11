// 这个js文件用于存储组件之间共享的公共数据，比如checkedIds，默认为[0,1,2,3,4,5]，表示所有的checkbox都被选中,帮我生成这个文件
import Vue from 'vue';
import { eventBus, EVENTS } from './MessageCenter.js';

export const store = new Vue({
    data: {
        checkedIds: [true, true, true, true, true, true, true, true, true, true],
        labels: ['NOxCAL', 'AirVol', 'Ammonia-A', 'Ammonia-B', '02'],
        conditionNum: 10, // 工况总数
        conditionS: 7, // 源工况
        conditionT: 9, // 目标工况
        selectedLayer: 2, // 选中的LSTM隐藏层
        epochNum: 100, // epoch总数
        selectedNeuron: new Set([]), // 选中的神经元
        selectedEpoch: 90, // 选中的epoch
        weightGraphS: null, // 源权重图数据
        weightGraphT: null, // 目标权重图数据
        filePath: 'D7_to_D4_layer1'
    },
    methods: {
        updateCheckedIds (data) {
            this.checkedIds = data;
            eventBus.$emit(EVENTS.UPDATE_CHECKED_IDS, data);
        },
        readCheckedIds () {
            return this.checkedIds;
        },
        readLabels () {
            return this.labels;
        },
        readSourceConditionId () {
            return this.conditionS;
        },
        readTargetConditionId () {
            return this.conditionT;
        },
        updateSourceConditionId (data) {
            this.conditionS = data;
            eventBus.$emit(EVENTS.UPDATE_SOURCE_CONDITION_ID, data);
        },
        updateTargetConditionId (data) {
            this.conditionT = data;
            eventBus.$emit(EVENTS.UPDATE_TARGET_CONDITION_ID, data);
        },
        readConditionNum () {
            return this.conditionNum;
        },
        readSelectedLayer () {
            return this.selectedLayer;
        },
        updataSelectedLayer (data) {
            this.selectedLayer = data;
        },
        updateWeightGraphS (data) {
            this.weightGraphS = data;
            eventBus.$emit(EVENTS.UPDATE_WEIGHT_GRAPH_S, data);
        },
        readWeightGraphS () {
            return this.weightGraphS;
        },
        updateWeightGraphT (data) {
            this.weightGraphT = data;
            eventBus.$emit(EVENTS.UPDATE_WEIGHT_GRAPH_T, data);
        },
        readWeightGraphT () {
            return this.weightGraphT;
        },
        SwitchMapperViewEvent () {
            eventBus.$emit(EVENTS.SWITCH_MAPPER_VIEW);
        },
        readSelectedEpoch () {
            return this.selectedEpoch;
        },
        updateSelectedEpoch (data) {
            this.selectedEpoch = data;
            eventBus.$emit(EVENTS.UPDATE_SELECTED_EPOCH, data);
        },
        readEpochNum () {
            return this.epochNum;
        },
        readSelectedNeuron () {
            return this.selectedNeuron;
        },
        updateSelectedNeuron (data) {
            this.selectedNeuron = data;
            eventBus.$emit(EVENTS.UPDATE_SELECTED_NEURON, data);
        }
    }
});
