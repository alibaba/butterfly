<template>
  <div class="item">
    <el-select
      v-model="itemData.condition"
      clearable
      filterable
      @change="handleChange"
      style="width: 180px"
      class="condition"
    >
      <el-option
        v-for="item in conditionList"
        :key="item.standardCode"
        :label="item.codeNm"
        :value="item.standardCode"
      >
      </el-option>
    </el-select>
    <div class="card">
      <div class="title">
        <span>
          {{ itemData.title || itemData.desc }}
        </span>
        <i class="el-icon-close close" @click="deleteItem"></i>
      </div>
      <el-row class="content">
        <el-input v-model="itemData.desc" disabled style="width: 180px"></el-input>
        <el-select
          v-model="itemData.operator"
          clearable
          filterable
          style="width: 105px"
          @change="handleOperateChange"
        >
          <el-option
            v-for="item in operatorList"
            :key="item.standardCode"
            :label="item.codeNm"
            :value="item.standardCode"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="itemData.paramType"
          clearable
          filterable
          style="width: 120px"
          @change="handleTypeChange"
        >
          <el-option
            v-for="item in paramTypeList"
            :key="item.standardCode"
            :label="item.codeNm"
            :value="item.standardCode"
          >
          </el-option>
        </el-select>
        <el-input v-model="itemData.value" style="width: 180px"></el-input>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    itemData: Object,
  },
  data() {
    return {
      conditionList: [
        { standardCode: '01', codeNm: '如下所有条件都成立' },
        { standardCode: '02', codeNm: '如下任一条件成立' },
        { standardCode: '03', codeNm: '如下所有条件都不成立' },
        { standardCode: '04', codeNm: '并且' },
        { standardCode: '05', codeNm: '或者' },
      ],
      operatorList: [
        { standardCode: '01', codeNm: '等于' },
        { standardCode: '02', codeNm: '大于' },
        { standardCode: '03', codeNm: '小于' },
        { standardCode: '04', codeNm: '大于等于' },
        { standardCode: '05', codeNm: '小于等于' },
        { standardCode: '06', codeNm: '为空' },
        { standardCode: '07', codeNm: '不为空' },
        { standardCode: '08', codeNm: '存在于' },
        { standardCode: '09', codeNm: '不存在于' },
      ],
      paramTypeList: [
        { standardCode: '01', codeNm: '常量' },
        { standardCode: '02', codeNm: '范围' },
        { standardCode: '03', codeNm: '正则表达式' },
        { standardCode: '04', codeNm: '基础变量' },
        { standardCode: '05', codeNm: '衍生变量' },
        { standardCode: '06', codeNm: '关联字段' },
        { standardCode: '07', codeNm: '自定义参数' },
      ],
    };
  },
  methods: {
    handleChange() {},
    handleOperateChange() {},
    handleTypeChange() {},
    deleteItem() {
      // this.list.splice(this.index,1)
    },
  },
  mounted() {},
};
</script>
<style scoped>
.item {
  position: relative;
}
.condition {
  margin-right: 4px;
}
.card {
  position: absolute;
  white-space: nowrap;
  top: 0;
  left: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 3px 0 rgba(0, 112, 204, 0.06);
  margin-bottom: 8px;
  box-sizing: border-box;
}
.title {
  border-radius: 4px 4px 0px 0px;
  padding: 4px;
  width: 100%;
  color: white;
  background-color: rgb(50, 65, 87);
}
.close {
  float: right;
  cursor: pointer;
}
.content {
  padding: 8px;
}
</style>
