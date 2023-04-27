import Vue from 'vue';

export const eventBus = new Vue({
    methods: {
    }
});

export const EVENTS = {
    UPDATE_CHECKED_IDS: 'update-checkedIds',
    UPDATE_SOURCE_CONDITION_ID: 'update-source-condition-id',
    UPDATE_TARGET_CONDITION_ID: 'update-target-condition-id',
    UPDATE_WEIGHT_GRAPH_S: 'update-weight-graph-source',
    UPDATE_WEIGHT_GRAPH_T: 'update-weight-graph-target',
    SWITCH_MAPPER_VIEW: 'switch-mapper-view',
    UPDATE_SELECTED_EPOCH: 'update-selected-epoch',
    UPDATE_SELECTED_NEURON: 'update-selected-neuron'
};
