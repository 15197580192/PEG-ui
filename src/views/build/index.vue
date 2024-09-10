<template>
    <div class="build-container">

      <el-row :gutter="12">
        <div class="box-card">
          <div v-for="(item, index) in cards" :key="index" class="onecard">
            <el-card shadow="always">
              <div slot="header" >
                <span class="nametext">{{ "Database" }}</span>
                <el-button
                  @click="deleteHandle(item)"
                  icon="el-icon-remove-outline"
                  style="float: right; padding: 3px 0;color: #909399"
                  type="text"
                  plain >Delete</el-button>
              </div>
              <div class="numtext">
                {{ item.dbName }}
                <br>
                <div class="in-numtext" >triple num:{{ item.dbNum }}</div>
              </div>
            </el-card>
          </div>
        </div>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="24">
          <div class="box-card">
            <div class="onecard">
              <el-card shadow="always" @click.native="addDatabase">
                <div class="nametext">Database Number</div>
                <el-divider></el-divider>
                <div class="numtext">
                  {{total}}
                  <div class="in-numtext" ></div>
                </div>
              </el-card>
            </div>
            <div class="onecard">
              <el-card shadow="always" @click.native="addDatabase">
                <div class="nametext">Create Datebase</div>
                <el-divider></el-divider>
                <div style="height: 46px;display: flex;justify-content: center;">
                  <i class="el-icon-plus"></i>
                </div>
              </el-card>
            </div>
          </div>
        </el-col>

      </el-row>
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

                        dbName: "re"
                    },
                    {

                        dbName: 'fdff'
                    }
                ]

            }
        },
        components:{
          AddDatabase,
        },
        mounted() {
            this.getList()
        },
        methods: {
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
    width: 100vh;
    height: 100%;
    padding: 20px
  }
  body {
  }
  .box-card {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 24px;
    width: 100vw;
  }
  .onecard {
    width: 19%;
    margin: 20px;
    height: 100%;
    transition: all .5s;
  }
  .numtext {

    font-size: 40px;
    color: rgb(95,184,120);
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
