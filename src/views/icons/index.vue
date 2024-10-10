<template>
  <div>
    <h1>HST</h1>
    <p>一站式数据库管理平台，帮助您解锁数据的力量</p>
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#5FB878FF">
      <el-menu-item index="1" style="font-family: Arial, sans-serif; font-size: 18px; border-radius: 10px;">数据库管理</el-menu-item>
      <el-menu-item index="2" style="font-family: Arial, sans-serif; font-size: 18px; border-radius: 10px;">数据查询</el-menu-item>
    </el-menu>

    <!-- 表格 -->
    <div v-if="showTable" class="table-container">
      <!-- 左边的方块 -->
<!--      <h2>数据查询1</h2>-->
      <div class="left-section">
        <h2>数据库信息</h2>
        <!-- 这里填充左边的内容 -->
<!--        <div>-->
<!--          <h2>数据库数量</h2>-->
<!--          <p>{{ cards.length }}</p>-->
<!--        </div>-->
        <div class="leftonecard" style="margin-top: 60px;">
          <el-card shadow="always" >
            <div slot="header" class="header-container-left">
              <span class="nametext-left">{{ "数据库数量" }}</span>
            </div>
            <div class="numtext-left">
              {{ cards.length}}
            </div>
          </el-card>
        </div>
        <div class="leftonecard" style="margin-top: 20px;">
          <el-card shadow="always" @click.native="addDatabase">
            <div slot="header" class="header-container-left">
              <span class="nametext-left">{{ "增加数据库" }}</span>
            </div>
            <div style="height: 46px;display: flex;justify-content: center;">
              <i class="el-icon-plus" style="font-size: 32px;   color: #5FB878FF;"></i>
            </div>
          </el-card>
        </div>
      </div>
        <add-database v-if="addVisible" ref="addDatabase" @refreshDataList="getList"></add-database>
      <!-- 右边的内容 -->
      <div class="right-section">
        <h2>数据库详情</h2>

        <el-row :gutter="12">
          <div class="box-card">
            <div v-for="(item, index) in cards" :key="index" class="rightonecard">
              <el-card shadow="always">
                <div slot="header" class="header-container">
                  <span class="nametext">{{ "数据名称" }}</span>
                  <el-button
                    @click="deleteHandle(item)"
                    icon="el-icon-delete"
                    style="float: right;  font-size: 20px;color: red"
                    type="text"
                    class="trash-icon"
                    plain >
                  </el-button>
                </div>
                <div class="numtext">
                  {{ item.dbName }}
                  <div class="in-numtext" ></div>
                </div>
              </el-card>
            </div>
          </div>
        </el-row>

      </div>

    </div>

    <div v-if="QueryTable" class="table-container" style="display: flex; justify-content: center;">
      <!-- 左边的框 -->
      <div class="left-section-query">
        <h2>数据库查询</h2>
          <el-card class="top-box">
            <div style="display: flex;margin: 5px 0;justify-content: space-between">
              <el-select v-model="database" placeholder="选择您想查询的数据库" style="width: 70% ;margin-right: 1px;">
                <el-option
                  v-for="(item, index) in cards"
                  :key="index"
                  :label="item.dbName"
                  :value="item.dbName"
                  style="text-align: center;">
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-search" @click="queryHandle" style="width: 30%; background-color: #5FB878FF; margin-left: 1px"> 执行查询</el-button>
            </div>
            <div class="input-left-area"  >
              <el-input
                type="textarea"
                :rows="14"
                placeholder="请输入查询语句"
                v-model="sparql"
                class="center-placeholder">
              </el-input>
            </div>
          </el-card>
      </div>

      <!-- 右边的框 -->
      <div class="right-section-query">
        <h2>查询结果</h2>
<!--          <div class="box-card">-->
<!--          <el-card class="top-box" v-loading="resultLoading" >-->
        <el-card class="top-box">
            <div class="input-right-area" >
              <el-input
                type="textarea"
                :rows="16"
                placeholder=""
                v-model="result">
              </el-input>
            </div>
          </el-card>
<!--          </div>-->
      </div>

    </div>

  </div>
</template>

<script>
    import AddDatabase from "./dialog/addDatabase";
    import {databaseList, delDatabase} from "../../api/article";
    import {query} from "../../api/query";
export default {
  data() {
    return {
      activeIndex: '1',
      showTable: true, // 控制表格显示
      QueryTable: false, // 控制数据查询显示
      databases: [], // 存储数据库列表数据
      sparql: '',
      database: '',
      result: '',
      addVisible: false,
      restoreVisible: false,
      resultLoading: false,
      cards:[
        {
          dbName: "Movie"
        },
        {
          dbName: 'Student'
        },
        {
          dbName: 'Gene'
        },
        {
          dbName: 'Course'
        },
        {
          dbName: 'Course'
        },
      ]
    };
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
      this.$confirm('Delete Database, Continue?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消删除',
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
    },

    handleSelect(key, keyPath) {
      if (key === '1') {
        // 数据库管理被选中
        this.showTable = true; // 显示表格
        this.QueryTable = false; // 隐藏数据查询
      }
      else if (key === '2') {
        // 数据查询被选中
        this.showTable = false; // 隐藏表格
        this.QueryTable = true; // 显示数据查询
      }
    },

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
  }
}
</script>

<style>
/* 样式可以根据需要进行调整 */
h1 {
  font-family: Arial, sans-serif;
  font-size: 60px;
  text-align: center;
  color: #ffffff;
  margin-top: 18px; /* 将这个值增加到80px或者你想要的距离 */
  margin-bottom: 10px;
}

h2 {
  font-family: Arial, sans-serif;
  font-size: 20px;
  text-align: center;
  color: #ffffff;
  margin-top: 20px; /* 将这个值增加到80px或者你想要的距离 */
}

p {
  font-family: Arial, sans-serif;
  font-size: 18px;
  text-align: center;
  color: #ffffff;
  margin-top: 10px;
  margin-bottom: 5px;
  line-height: 1.5;
}


.el-menu-demo {
  display: flex;
  justify-content: flex-start;
  border-radius: 10px; /* 添加圆角 */
  width: 90%;
  color: #2A6F89FF;
  margin: 0 auto;
  /*margin-bottom: 5px;*/
}


.table-container {
  display: flex;
  border: 1px solid #ccc; /* 添加边框 */
  border-radius: 10px; /* 添加圆角 */
  overflow: hidden; /* 防止内容溢出 */
  max-width: 90%; /* 设置最大宽度为800像素 */
  height: 50%;
  margin: 0 auto; /* 让容器水平居中 */
}

.header-container {
  display: flex;
  align-items: center;
  height: 20px;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.header-container-left {
  display: flex;
  align-items: center;
  height: 20px;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

/*.nametext {*/
/*  margin-right: 150px; !* 添加右边距 *!*/
/*}*/

.trash-icon {
  margin-left: auto;
}

.box-card {
  display: flex;
  flex-wrap: wrap;
  /*flex-direction: row;*/
  justify-content: flex-start;
  margin-top: 24px;
  width: 60vw;
}
/*.rightonecard-container {*/
/*  display: flex;*/
/*  flex-wrap: wrap;*/
/*  justify-content: space-between; !* 让卡片在容器内均匀分布 *!*/
/*}*/

/*.rightonecard {*/
/*  width: 380px; !* 计算每个卡片宽度，减去 margin 的宽度 *!*/
/*  margin: 20px ; !* 分别设定上、右、下、左的 margin 值 *!*/
/*  height: 160px;*/
/*  transition: all .5s;*/
/*}*/


.rightonecard {
  width: 380px ;
  margin-top: 20px ;
  margin-bottom: 20px ;
  margin-right: 10px ;
  margin-left: 35px ;
  height: 160px;
  /*margin-left: auto; !* 自动填充左侧空白 *!*/
  /*margin-right: auto; !* 自动填充右侧空白 *!*/
  transition: all .5s;
}

.leftonecard {
  width: 380px;
  height: 130px;
  margin: 20px;
  margin-top: 40px; /* 上外边距 */
  margin-bottom: 70px; /* 下外边距 */
  margin-left: auto; /* 自动填充左侧空白 */
  margin-right: auto; /* 自动填充右侧空白 */
  transition: all .5s;
}

.numtext {
  font-size: 30px;
  color: #5FB878FF;
  height: 50px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.numtext-left {
  font-size: 30px;
  color: #5FB878FF;
  height: 50px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.in-numtext {
  display: inline-block;
  font-size: 14px;
  color: black;
}
.nametext {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.nametext-left {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.left-section {
  flex: 0 1 35% ; /* 左边占据 70% 的空间 */
  border-radius: 5px; /* 添加圆角 */
  justify-content: center; /* 在主轴上居中 */
  margin-right: 1px; /* 添加右边距 */
  height: 500px;
}

.right-section {
  flex: 0 1 65% ; /* 右边占据 30% 的空间 */
  border-radius: 5px; /* 添加圆角 */
  margin-left: 1px; /* 添加左边距 */
  height: 500px;
}

.right-section {
  overflow-y: auto; /* 仅显示垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

.left-section-query{
  flex: 1; /* 让它们平分父容器的空间 */
  border-radius: 5px; /* 添加圆角 */
  margin-right: 1px; /* 添加右边距 */
  height: 500px;
}

.right-section-query {
  flex: 1; /* 让它们平分父容器的空间 */
  border-radius: 5px; /* 添加圆角 */
  margin-left: 1px; /* 添加左边距 */
  height: 500px;
}

.left-section {
  background-color: #545c64; /* 左侧背景色 */
}
.right-section {
  background-color: #545c64; /* 左侧背景色 */
}


.left-section-query {
  background-color: #545c64; /* 左侧背景色 */
}
.right-section-query {
  background-color: #545c64; /* 左侧背景色 */
}

.left-section h2,
.right-section h2 {
  text-align: center; /* 标题居中 */
  margin-top: 0; /* 去除默认顶部边距 */
  padding: 10px; /* 添加内边距 */
}

.right-section ul {
  margin-top: 0; /* 去除默认顶部边距 */
  margin-right: 3; /* 去除默认顶部边距 */
  padding-left: 10px; /* 调整列表内边距 */
}
.top-box {
  width: 90%;
  height: 80%;
  border-radius: 18px; /* 添加圆角 */
  margin-left: auto; /* 自动填充左侧空白 */
  margin-right: auto; /* 自动填充右侧空白 */
  transition: all .5s;
}



html {
  background-color: #1b1c1c;
}

</style>
