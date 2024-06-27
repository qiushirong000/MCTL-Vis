<template>
    <el-container class="mainContainer">
        <!-- <el-header>Header</el-header> -->
        <el-main style="margin-bottom:-10px">
            <el-row type="flex" :gutter="5" style="margin-top:-20px; margin-left: -20px; margin-right: -20px;">
                <el-col :span="4">
                    <data-config :height="30" :title="'DataSet Settings'" :show-header="true"></data-config>
                </el-col>
                <el-col :span="7">
                    <condition-similarity :height="30" :title="'Multi-condition Similarity'" :show-header="true"></condition-similarity>
                </el-col>
                <el-col :span="7">
                    <condition-comparison :height="30" :title="'Feature Probability Density Distribution.'" :show-header="true"></condition-comparison>
                </el-col>
                <el-col :span="6">
                    <model-performance :height="30" :title="'Model Performance Evaluation'" :show-header="true"></model-performance>
                </el-col>
            </el-row>
            <el-row type="flex" :gutter="5" style="margin-top: 5px; margin-left: -20px; margin-right: -20px;">
                <el-col :span="4">
                    <model-config :height="66" :title="'Model Settings'" :show-header="true"></model-config>
                </el-col>
                <el-col :span="14">
                    <el-row type="flex" :gutter="5" style="margin-top: 0px; margin-left: 0px; margin-right: 0px;">
                        <el-col :span="12">
                            <node-graph-source :height="60" :title="'Source Model Topology'" :show-header="true"></node-graph-source>
                        </el-col>
                        <el-col :span="12">
                            <node-graph-target :height="60" :title="'Target Model Topology'" :show-header="true"></node-graph-target>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="5" style="margin-top: 2px; margin-left: 1px; margin-right: 1px;">
                        <epoch-line :height="5" :title="'Template'" :show-header="false"></epoch-line>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <!-- <el-row type="flex" :gutter="6" style="margin-top: 0px; margin-left: 3px; margin-right: 0px;">
                        <state-persistent :height="29.5" :title="'Model state comparison'" :show-header="true"></state-persistent>
                    </el-row> -->
                    <div v-if="mode === 0">
                        <el-row type="flex" :gutter="4" style="margin-top: 2px; margin-left: 0px; margin-right: 0px;">
                            <el-col :span="12">
                                <weight-change :height="12" :show-header="false" :title="'Weight Change'"></weight-change>
                            </el-col>
                            <el-col :span="12">
                                <!-- <activation-distribution :height="15" :show-header="true" :title="'Activation distribution'"></activation-distribution> -->
                            </el-col>
                        </el-row>
                    </div>
                    <div v-else-if="mode === 1">
                        <el-row type="flex" :gutter="6" style="margin-top: 0px; margin-left: 3px; margin-right: 0px;">
                            <!-- <instance :height="30" :title="'weight feature evolution'" :show-header="true"></instance> -->
                            <topology-change :height="25" :title="'Topological characteristic Change'" :show-header="true"></topology-change>
                        </el-row>
                    </div>
                    <el-row type="flex" :gutter="3" style="margin-top: 5px; margin-left: 3px; margin-right: 0px;">
                        <weight-evolution :height="14" :title="'weight feature evolution'" :show-header="false"></weight-evolution>
                    </el-row>

                    <el-row type="flex" :gutter="3" style="margin-top: 5px; margin-left: 3px; margin-right: 0px;">
                        <!-- <model-evaluation :height="20" :title="'Loss value curve'" :show-header="true"></model-evaluation> -->
                        <feature-importance :height="25" :title="'Input Features Sensitivity'" :show-header="true"></feature-importance>
                    </el-row>

                    <!-- <el-row type="flex" :gutter="4" style="margin-top: 5px; margin-left: 0px; margin-right: 0px;">
                        <el-col :span="12">
                            <activation-saturation :height="14" :show-header="true" :title="'Activation Saturation'"></activation-saturation>
                        </el-col>
                        <el-col :span="12">
                            <activation-distribution :height="14" :show-header="true" :title="'Activation Distribution'"></activation-distribution>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="3" style="margin-top: 5px; margin-left: 3px; margin-right: 0px;">
                        <model-evaluation :height="20" :title="'Loss value curve'" :show-header="true"></model-evaluation>
                    </el-row> -->
                </el-col>
            </el-row>
            <!-- <el-row type="flex" :gutter="5" style="margin-top: 30px; margin-left: -100px; margin-right: -20px;">
                <el-col :span="4">
                </el-col>
                <el-col :span="8">
                    <weight-evolution :height="25" :title="'weight feature evolution'" :show-header="false"></weight-evolution>
                </el-col>
            </el-row> -->
        </el-main>
    </el-container>

</template>

<script>
import ConditionComparison from '../components/conditionComparison.vue';
import ConditionSimilarity from '../components/conditionSimilarity.vue';
import DataConfig from '../components/dataConfig.vue';
import instance from '../components/instance.vue';
import ModelConfig from '../components/modelConfig.vue';
import NodeGraphSource from '../components/nodeGraphSource.vue';
import NodeGraphTarget from '../components/nodeGraphTarget.vue';
import epochLine from '../components/epochLine.vue';
import ActivationDistribution from '../components/activationDistribution.vue';
import ActivationSaturation from '../components/activationSaturation.vue';
import ModelEvaluation from '../components/modelEvaluation.vue';
import StateComparison from '../components/stateComparison.vue';
import featureImportance from '../components/featureImportance.vue';
import StatePersistent from '../components/statePersistent.vue';
import pieGraph from '../components/pieGraph.vue';
import WeightEvolution from '../components/weightEvolution.vue';
import WeightChange from '../components/weightChange.vue';
import topologyChange from '../components/topologyChange.vue';
import ModelPerformance from '../components/modelPerformance.vue';
export default {
    components: {
        instance,
        DataConfig,
        ConditionSimilarity,
        ConditionComparison,
        ModelConfig,
        NodeGraphSource,
        NodeGraphTarget,
        epochLine,
        ActivationSaturation,
        ActivationDistribution,
        ModelEvaluation,
        StateComparison,
        featureImportance,
        StatePersistent,
        pieGraph,
        WeightEvolution,
        WeightChange,
        topologyChange,
        ModelPerformance
    },
    name: 'Home',
    data () {
        return {
            drawer: false,
            mode: 1
        };
    },
    mounted () {

    },
    methods: {

    }
};
</script>

  <style scoped>
 .mainContainer {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 1px solid #000000;
    width: 100%;
    height: 98.2vh;
    margin-top: 0%;
    line-height: 100%;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  </style>
