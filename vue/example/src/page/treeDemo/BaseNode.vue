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
    <div class="card" v-if="itemData.desc">
      <div class="title">
        <span>
          {{ itemData.title }}
        </span>
        <i class="el-icon-close close" @click="deleteItem"></i>
      </div>
      <el-row class="content">
        <span>{{itemData.desc}}</span>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
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
    };
  },
  methods: {
    handleChange() {},
    handleOperateChange() {},
    handleTypeChange() {},
    deleteItem() {
      this.$emit('del', this.itemData.id);
    },
  },
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
.card-text {
  margin: 0 10px;
}
.title {
  border-radius: 4px 4px 0px 0px;
  padding: 4px;
  width: 100%;
  color: white;
  background-color: rgb(50, 65, 87);
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1;
}
.title span {
  margin-right: 10px;
}
.close {
  float: right;
  cursor: pointer;
}
.content {
  padding: 8px;
}
</style>
