<template>
  <div class="sql-container">
    <el-row :gutter="20">
      <h1 style="margin-left: 20px;">FedTopK 图数据库管理系统</h1>
    </el-row>
    <el-row :gutter="20">

      <el-col :span="12">
        <el-card class="top-box" :style="{ borderRadius: '15px', overflow: 'hidden' }">
          <div slot="header">
            <h3>数据库管理</h3>
          </div>
          <build  />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="top-box" :style="{ borderRadius: '15px', overflow: 'hidden' }">
          <div slot="header">
            <h3>Sparql查询</h3>
          </div>
          <div style="display: flex;margin: 5px 0;justify-content: space-between">
            <el-select v-model="database" placeholder="选择数据库" style="width: 40% ;borderRadius: '5px'">
              <el-option
                v-for="item in databases"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
            <el-button type="warning" icon="el-icon-search" round style="width: 58%" @click="queryHandle">执行</el-button>
          </div>
          <div class="input-area">
            <el-input
              type="textarea"
              :rows="9"
              placeholder="请输入Sparql查询:
例如
select ?v0 ?v2 ?v3 where {
?v0	<http://db.uwaterloo.ca/~galuc/wsdbm/subscribes>	<http://db.uwaterloo.ca/~galuc/wsdbm/Website23> .
?v2	<http://schema.org/caption>	?v3 .
?v0	<http://db.uwaterloo.ca/~galuc/wsdbm/likes>	?v2 .
}"
              v-model="sparql">
            </el-input>
          </div>
<!--          <div slot="header">-->
<!--            <span>查询结果</span>-->
<!--          </div>-->
          <div class="input-area">
            <el-input
              type="textarea"
              :rows="10"
              placeholder="查询结果:"
              v-model="result">
            </el-input>
          </div>
        </el-card>
<!--        <el-card class="top-box" v-loading="resultLoading">-->

<!--        </el-card>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>


import {databaseList} from "../../api/article";
import {query} from "../../api/query";
import build from "../build/index.vue";
export default {
  name: 'Icons',
  data() {
    return {
        sparql: '',
        database: '',
        result: '',
        resultLoading: false,
        databases: [{}]
    }
  },
  components: {
    build
  },
  methods: {
      queryHandle(){
          //传递的参数
          let params = {
              sparql: this.sparql,
              dbname: this.database
          };
          console.log('参数列表为');
          console.log(params);

          this.resultLoading = true
          //接口传来的数据
          query(params).then(data => {
              this.result = data.data
          }).finally(()=>{
              this.$message({
                  message: 'Query Success！',
                  type: "success",
                  duration: 1500,
              });
              this.resultLoading = false
          })
      },

      getList() {
          databaseList().then(data => {
              this.databases = data.dbs.map((item, index)=>{
                  console.log(item, index)
                  return {
                      value: index,
                      label: item.dbName
                  }

              })
              console.log(this.databases)
          })
      },
  },
  mounted() {
    this.getList()
  }
}
</script>
<style scoped>
  .sql-container{
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #D6D1F7
  }

  .top-box {
    background-color: #EDEBFB;
    width: 100%;
  }

  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
</style>

