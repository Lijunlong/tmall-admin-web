<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增部门' : '编辑部门'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio-group v-model="form.enabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.pid !== 0" style="margin-bottom: 0px;" label="上级部门">
        <treeselect v-model="form.pid" :options="depts" style="width: 370px;" placeholder="选择上级类目" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getDeptList,insertDept,updateDept } from '@/api/dept'

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
      loading: false, dialog: false, depts: [],
      form: {
        id: '',
        name: '',
        pid: 1,
        enabled: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.doAdd()
          } else{
            this.doEdit()
          }
        }
      })
    },
    doAdd(){
      insertDept(this.form).then(response => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.$emit("getDeptList")
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    doEdit(){
      updateDept(this.form.id, this.form).then(response => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.$emit("getDeptList")
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        pid: 1,
        enabled: '1'
      }
    },
    getDepts(){
      const params = null
			getDeptList(params).then(response => {
				this.depts = response.data
			})
		}
  }
}
</script>

<style scoped>

</style>
