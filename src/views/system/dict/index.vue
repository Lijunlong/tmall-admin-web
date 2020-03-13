<template>
  <div>
    <!--表单组件-->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增字典' : '编辑字典'" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!-- 字典列表 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <!-- 新增 -->
            <el-button
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="add"
            >新增</el-button>
          </div>
          <!--工具栏-->
          <div class="head-container">
            <!-- 搜索 -->
            <el-input v-model="form.name" clearable size="small" placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="">搜索</el-button>
          </div>
          <!--表格渲染-->
          <el-table v-loading="listLoading" :data="list" highlight-current-row size="small" style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
            <el-table-column label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180"
                >
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              v-if="this.$refs.dictDetail && this.$refs.dictDetail.dictName"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail.add"
            >新增</el-button>
          </div>
          <dictDetail ref="dictDetail" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDictionaryList,insertDictionary, updateDictionary, deleteDictionary } from '@/api/dict'
import dictDetail from './dictDetail'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5
};
export default {
  components: { dictDetail },
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      list: null,listLoading: false,loading: false,delLoading: false, dialog: false, isAdd: false,
      listQuery: Object.assign({}, defaultListQuery),
      form: { id: null, name: null, remark: null },
      rules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入字典描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDictionaryList();
  },
  methods: {
    getDictionaryList(){
      this.listLoading = true
      getDictionaryList(this.listQuery).then(response => {
				this.listLoading = false;
        this.list = response.data.list
      }).catch(err => {
        this.listLoading = false
      });
    },
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { id: null, name: null, remark: null }
    },
    add(){
      this.isAdd = true
      this.dialog = true
    },
    edit(data){
      this.isAdd = false
      this.form = { id: data.id, name: data.name, remark: data.remark }
      this.dialog = true
    },
    subDelete(id) {
      this.delLoading = true
      deleteDictionary(id).then(res => {
        this.delLoading = false
				this.$refs[id].doClose()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.getDictionaryList()
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    doSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else{
            this.doEdit()
          }
        }
      })
    },
    doAdd() {
      insertDictionary(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
				})
        this.loading = false
        this.getDictionaryList()
      }).catch(err => {
        this.loading = false
      })
    },
    doEdit() {
      updateDictionary(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
				})
        this.loading = false
        this.getDictionaryList()
      }).catch(err => {
        this.loading = false
      })
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.dictName = val.name
        this.$refs.dictDetail.form.dictionaryId = val.id
        this.$refs.dictDetail.init();
      }
    }
  }
}
</script>

<style scoped>
</style>
