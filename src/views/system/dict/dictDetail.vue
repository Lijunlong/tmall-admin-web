<template>
  <div>
    <div v-if="dictName === ''">
    	<div class="my-code">点击字典查看详情</div>
    </div>
		<div v-else>
			<!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增字典详情' : '编辑字典详情'" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值" prop="value">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
			<!--表格渲染-->
      <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;">
        <el-table-column label="所属字典">
					<template slot-scope="scope">{{dictName}}</template>
        </el-table-column>
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="sort" label="排序">
          <template slot-scope="scope">
					  <el-tag>{{ scope.row.sort }}</el-tag>
				  </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
            <el-popover
              :ref="scope.row.id"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getDictionaryDetailList,insertDictionaryDetail,updateDictionaryDetail,deleteDictionaryDetail } from '@/api/dict'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5
};
export default {
  data() {
    return {
			list: null,listLoading: false,loading: false,delLoading: false, dialog: false, isAdd: false,dictName: '',
      listQuery: Object.assign({}, defaultListQuery),
			form: { id: null, label: null, value: null,sort: 999,dictionaryId: null },
			rules: {
        label: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
    	}
    }
  },
  methods: {
		init(){
			this.listLoading = true
      getDictionaryDetailList(this.form.dictionaryId,this.listQuery).then(response => {
				this.listLoading = false;
        this.list = response.data.list
      }).catch(err => {
        this.listLoading = false
			});
		},
		add(){
			this.isAdd = true
      this.dialog = true
		},
		edit(data){
			console.log(data);
			this.isAdd = false
			this.form = { id: data.id, label: data.label, value: data.value,sort: data.sort, dictionaryId: data.dictionaryId }
      this.dialog = true
		},
		subDelete(id){
			this.delLoading = true
      deleteDictionaryDetail(id).then(res => {
        this.delLoading = false
				this.$refs[id].doClose()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
		},
		cancel() {
      this.resetForm()
		},
		resetForm() {
      this.$refs['form'].resetFields()
			this.form = { id: null, label: null, value: null,sort: 999,dictionaryId: this.form.dictionaryId }
			this.dialog = false
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
      insertDictionaryDetail(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
				})
        this.loading = false
        this.init()
      }).catch(err => {
        this.loading = false
      })
    },
    doEdit() {
      updateDictionaryDetail(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
				})
        this.loading = false
        this.init()
      }).catch(err => {
        this.loading = false
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
