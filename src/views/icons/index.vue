<template>
  <div class="sql-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="top-box">
          <div slot="header">
            <span>Database Query</span>
          </div>
          <div class="input-area">
            <el-input
              type="textarea"
              :rows="10"
              placeholder="Please Input Sparql Statement:"
              v-model="sparql">
            </el-input>
          </div>
          <div style="display: flex;margin: 5px 0;justify-content: space-between">
            <el-select v-model="database" placeholder="Please Choose" style="width: 40%">
              <el-option
                v-for="item in databases"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" style="width: 58%" @click="queryHandle">Execute</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="top-box" v-loading="resultLoading">
          <div slot="header">
            <span>Result</span>
          </div>
          <div class="input-area">
            <el-input
              type="textarea"
              :rows="10"
              placeholder="This is results:"
              v-model="result">
            </el-input>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>


import {databaseList} from "../../api/article";
import {query} from "../../api/query";

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
    padding: 20px
  }

  .top-box {
    width: 100%;
  }

  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
</style>

