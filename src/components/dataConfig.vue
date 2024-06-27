<template>
    <div class="instance" ref="subcontainer">
        <el-header style="height:2vh; background-color: gainsboro;" v-if="showHeader">
            <el-row style="border: 0px solid #73ad21; height:100%;">
                <el-col :span="24">
                <div style="margin-top:4px; text-align: left; padding-left: 2em;"><label style="font-weight: bold; font-size: 15px;  ">{{title}}</label></div>
                </el-col>
            </el-row>
        </el-header>

        <div class="chart" ref="chart">
            <el-descriptions title="" :border="true" :column="1" :size="'medium'" style="margin-top:5px; margin-left: 5px; margin-right: 5px; " >
                <el-descriptions-item label="DataSet" labelStyle="font-size:xx-small;text-align: center;background-color: #F8F8FF; font-weight: bold; color: black" contentStyle="padding-left: 2em">
                    <button style="margin-top: -5%; height: 30px; width:120px; padding-left: 0.5em; text-align: left;">./210701000.csv</button>
                    <!-- <input type="file" id="folder-input" accept="./210701000.csv" style="margin-top: -5%; height: 30px; width:150px" webkitdirectory directory multiple> -->
                </el-descriptions-item>
                <el-descriptions-item label=" MC-ID" labelStyle="font-size:xx-small; background-color: #F8F8FF;  text-align: center;  font-weight: bold; color: black" contentStyle="padding-left: 2em">
                    <el-tree
                        :data="ocIds"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[]"
                        :default-checked-keys="[]"
                        ref="tree"
                        @check-change="handleCheckChange"
                        :props="defaultProps">
                    </el-tree>
                </el-descriptions-item>

                <el-descriptions-item  label=" Source Domain" labelStyle="font-size:xx-small;background-color: #F8F8FF; padding-left: 0em; font-weight: bold; color: black; text-align: center" contentStyle="padding-left: 2em">
                    <el-select v-model="SValue[1]" style="width:120px; text-align: center;" @change="handleChangeS">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item  label=" Target Domain" labelStyle="font-size:xx-small;background-color: #F8F8FF; padding-left: 0em; font-weight: bold; color: black; text-align: center" contentStyle="padding-left: 2em">
                <el-select v-model="TValue[1]" style="width:120px" @change="handleChangeT">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import {store} from '../assets/js/DataManager.js';

export default {
    name: 'dataConfig',
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
            conditionNum: 10,
            ocIds: [{
                id: -1,
                label: 'Conditions',
                children: [{
                    id: 0,
                    label: 'D0'
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            checkedIds: [],
            options: [{
                value: 0,
                label: 'D1'
            }],
            SValue: ['D7', 'D7'],
            TValue: ['D2', 'D2']
        };
    },
    created () {
        let subTree = [];
        this.checkedIds = [];
        for (let i = 0; i < this.conditionNum; i++) {
            subTree.push({
                id: i,
                label: 'D' + i
            });
            this.checkedIds.push(true);
        }
        this.ocIds[0].children = subTree;
        // 初始化
        this.updateCheckedBox();
        this.SValue = [store.readSourceConditionId(), store.readSourceConditionId()];
        this.TValue = [store.readTargetConditionId(), store.readTargetConditionId()];
    },
    mounted () {
        // 设置视图高度
        this.$refs.subcontainer.style.height = this.height + 'vh';
        this.$refs.chart.style.height = this.showHeader ? (this.height - 3) + 'vh' : this.height + 'vh';
        this.$refs.tree.setCheckedKeys([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    },
    methods: {
        updateCheckedBox () {
            this.options = [];
            for (let i = 0; i < this.conditionNum; i++) {
                if (this.checkedIds[i]) {
                    this.options.push({
                        value: i,
                        label: 'D' + i
                    });
                }
            }
        },
        handleCheckChange (data, checked, indeterminate) {
            // console.log(data, checked, indeterminate);
            this.checkedIds[(data.$treeNodeId - 2)] = checked;
            this.updateCheckedBox();
            store.updateCheckedIds(this.checkedIds);
        },
        handleChangeS (value) {
            // this.$message('click on item ' + value);
            // 源工况Id与目标工况Id需不同
            if (this.SValue[1] === this.TValue[1]) {
                this.SValue[1] = this.SValue[0];
            } else {
                store.updateSourceConditionId(this.SValue[1]);
            }
            this.SValue[0] = this.SValue[1];
        },
        handleChangeT (value) {
            // this.$message('click on item ' + value);
            // 源工况Id与目标工况Id需不同
            if (this.SValue[1] === this.TValue[1]) {
                this.TValue[1] = this.TValue[0];
            } else {
                store.updateTargetConditionId(this.TValue[1]);
            }
            this.TValue[0] = this.TValue[1];
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
        border: 0px solid rgb(244, 5, 5);
        width: 100%;
        height: 27vh;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    ::-webkit-scrollbar {
        width: 10px; /* 竖向滚动条宽度 */
        height: 10px; /* 横向滚动条高度 */
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px; /* 滚动条样式 */
        -webkit-box-shadow: inset 0 0 0px rgb(201, 201, 201);  /* 内阴影 */
        background-color: #7c7f83; /* 滚动条颜色 */
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #7c7f83; /* 滚动条悬浮颜色 */
    }

</style>
