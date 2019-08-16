<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增岗位' : '编辑岗位'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 370px;"/>
      </el-form-item>
      <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
				<el-radio-group v-model="form.enabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属部门">
        <treeselect v-model="deptId" :options="depts" style="width: 370px" placeholder="选择部门"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepts } from '@/api/dept'
import { insertJob, updateJob } from '@/api/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [], deptId: null,
      form: {id: '', name: '', sort: 999, enabled: '', umsDepartmentId: ''},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.umsDepartmentId = this.deptId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.deptId === null || this.deptId === undefined) {
            this.$message({
              message: '所属部门不能为空',
              type: 'warning'
            })
          } else {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else{
							this.doEdit()
						}
          }
        }
      })
    },
    doAdd() {
      insertJob(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
				})
				this.$emit("getJobList")
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    doEdit() {
      updateJob(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
				})
				this.$emit("getJobList")
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.deptId = null
      this.form = {id: '',name: '',sort: 999,enabled: '', umsDepartmentId: ''}
    },
    getDepts() {
      getDepts().then(response => {
        this.depts = response.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
