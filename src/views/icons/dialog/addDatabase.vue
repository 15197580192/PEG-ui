<template>
  <el-dialog
    title="新建数据库"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="closeDialog"
    width="600px"
  >
    <el-form
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="160px"
    >
      <el-row>
        <el-col :span="24"
        >
          <el-form-item label="数据库名" prop="dbname">
            <el-input
              placeholder="dbname"
              v-model="dataForm.dbname"
              clearable>
            </el-input>
          </el-form-item
          >
        </el-col>
        <el-col :span="24"
        >
          <el-form-item label="nt文件路径" prop="dbpath">
            <el-input
              placeholder="dbpath"
              v-model="dataForm.dbpath"
              clearable>
            </el-input>
          </el-form-item
          >
        </el-col>
        <el-col :span="24"
        >
          <el-form-item label="划分文件路径" prop="divfilepath">
            <el-input
              placeholder="divfilepath"
              v-model="dataForm.divfilepath"
              clearable>
            </el-input>
          </el-form-item
          >
        </el-col>

      </el-row>


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="dataFormSubmit()" :disabled="loading">确认</el-button>
      <el-button  type="danger" @click="closeDialog" :disabled="loading">取消</el-button>
    </span>

  </el-dialog>
</template>

<script>
import {addDatabase} from "../../../api/article";

export default {
  data() {
    return {
      visible: false,
      selectVisible: false,
      loading: false,
      dataForm: {
        dbname: "",
        dbpath: '',
        divfilepath: ''
      },

      dataRule: {
        dbname: [
          {required: true, message: "Database Name is not null", trigger: "blur"},
        ],
        dbpath: [{required: true, message: "dbpath is not null", trigger: "blur"}],
        divfilepath: [{required: true, message: "divfilepath is not null", trigger: "blur"}],
      },
    };
  },
  components: {},
  methods: {
    //取消提交
    closeDialog() {
      this.dataForm = {}
      this.$nextTick(()=>{
        this.$refs["dataForm"].resetFields();
      })
      this.visible = false;
    },
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    // 表单提交
    dataFormSubmit() {
      let params = {
        dbname: this.dataForm.dbname,
        dbpath: this.dataForm.dbpath,
        divfilepath: this.dataForm.divfilepath,
      };
      console.log('参数列表', params)
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log('通过校验')
        }
        this.loading = true
        addDatabase(params).then((data) => {
          console.log(data);
          if (data.status === "success") {
            this.$message({
              message: "Create Success",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.$refs["dataForm"].resetFields();
                this.visible = false;
                this.$emit("refreshDataList");
              },
            });
          } else {
            this.$message.error(data.message);
          }
        }).finally(()=>{
          this.loading = false
        });

      });
    },

  },
};
</script>
