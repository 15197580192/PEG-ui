<template>
    <div class="build-container">
      <el-row :gutter="12">
        <el-button type="warning" style="margin-left: 0px;" round icon="el-icon-plus" @click="addDatabase">新建数据库</el-button>
      </el-row>
      <el-row :gutter="12">

        <div class="box-card">
          <el-table
            :data="cards"
            style="width: 100%;border-radius: 10px;overflow: hidden;">
            <el-table-column
              label="数据库名称"
              prop="dbName">
            </el-table-column>
            <el-table-column
              align="right">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteHandle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
<!--          <div v-for="(item, index) in cards" :key="index" class="onecard">-->
<!--            <el-card shadow="always" :style="{ borderRadius: '15px', overflow: 'hidden' }">-->
<!--              <div slot="header" >-->
<!--                <span class="nametext">{{ "数据库" }}</span>-->
<!--                <el-button-->
<!--                  @click="deleteHandle(item)"-->
<!--                  style="float: right; padding: 3px 0;color: #909399"-->
<!--                  type="text"-->
<!--                  plain >删除</el-button>-->
<!--              </div>-->
<!--              <div class="numtext">-->
<!--                {{ item.dbName }}-->
<!--                <div class="in-numtext" ></div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </div>-->

        </div>
      </el-row>
<!--      <el-row :gutter="12">-->
<!--        <el-col :span="24">-->
<!--          <div class="box-card">-->
<!--&lt;!&ndash;            <div class="onecard">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-card shadow="always" @click.native="addDatabase">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="nametext">Database Number</div>&ndash;&gt;-->
<!--&lt;!&ndash;                <el-divider></el-divider>&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="numtext">&ndash;&gt;-->
<!--&lt;!&ndash;                  {{total}}&ndash;&gt;-->
<!--&lt;!&ndash;                  <div class="in-numtext" ></div>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-card>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->

<!--            <div class="onecard">-->
<!--              <el-card shadow="always" @click.native="addDatabase">-->
<!--                <div class="nametext">新建数据库</div>-->
<!--                <el-divider></el-divider>-->
<!--                <div style="height: 46px;display: flex;justify-content: center;">-->
<!--                  <i class="el-icon-plus"></i>-->
<!--                </div>-->
<!--              </el-card>-->
<!--            </div>-->
<!--            </div>-->
<!--        </el-col>-->

<!--      </el-row>-->
        <add-database v-if="addVisible" ref="addDatabase" @refreshDataList="getList"></add-database>
    </div>
</template>

<script>

    import AddDatabase from "./dialog/addDatabase";
    import {databaseList, delDatabase} from "../../api/article";
    import list from "../example/list";

    export default {
        name: "index",
        data() {
            return {
                addVisible: false,
                restoreVisible: false,
                total: 0,
                cards:[
                    {
                        dbName: "test"
                    },
                    {
                        dbName: "test1"
                    }
                ],
              tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
              }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }],
              search: ''

            }
        },
        components:{
          AddDatabase,
        },
        mounted() {
            this.getList()
        },
        methods: {
          handleDelete(index, row) {
            console.log(index, row);
          },
            getList() {
                this.listLoading = true

                databaseList().then(response => {
                    this.cards = response.dbs
                    this.total = response.dbs.length
                    //this.total = response.data.total

                    // Just to simulate the time of the request
                    // setTimeout(() => {
                    //     this.listLoading = false
                    // }, 1.5 * 1000)
                }).finally(()=>{
                    this.listLoading = false
                })
            },

            /**
             * 删除数据库
             * @param item:选中的数据库信息
             */
            deleteHandle(item){
              console.log(item)
                let parmas = {
                    dbname: item.dbName,
                };
                this.$confirm('Delete Database, Continue?', 'Tip', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    delDatabase(parmas).then(response => {
                        if (response.status === "success") {
                            this.$message({
                                message: response.message,
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.getList();
                                },
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancel Delete'
                    });
                });
            },


            addDatabase() {
                this.addVisible = true;
                this.$nextTick(() => {
                    this.$refs.addDatabase.init();
                });
            },
            restoreDatabase() {
                this.restoreVisible = true;
                this.$nextTick(() => {
                    this.$refs.restoreDatabase.init();
                });
            }
        },
    }
</script>

<style scoped>
  .build-container{
    height: 100%;
    padding: 0 10px 10px 10px
  }
  body {
  }
  .box-card {

    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 24px;
  }
  .onecard {
    width: 19%;
    margin: 20px;
    height: 100%;
    transition: all .5s;
  }
  .numtext {

    font-size: 40px;
    color: black;
  }
  .in-numtext {
    display: inline-block;
    font-size: 14px;
    color: black;
  }
  .nametext {
    font-size: 14px;
    font-weight: bold;
  }
</style>
