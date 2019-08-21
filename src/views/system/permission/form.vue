<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增权限' : '编辑权限'" append-to-body width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="form.alias" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 360px;"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="上级类目">
        <treeselect v-model="form.pid" :options="permissions" style="width: 360px;" placeholder="选择上级类目" />
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
import { getPermissionTree,updatePermission,createPermission } from '@/api/permission'

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
      loading: false, dialog: false, permissions: [],
      form: { name: '', alias: '', sort: 999, pid: 0 },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入别名', trigger: 'blur' }
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
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { name: '', alias: '', sort: 999, pid: 0 }
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd();
          } else {
            if (this.form.id === this.form.pid) {
              this.$message({
                message: '上级类目不能选择自己',
                type: 'warning'
              })
              this.loading = false
            }else{
              this.doUpdate();
            }
          }
        } else {
          return false
        }
      })
    },
    doUpdate(){
      updatePermission(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$emit("getPermissionList")
      }).catch(err => {
        this.loading = false
      });
    },
    doAdd(){
      createPermission(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$emit("getPermissionList")
      }).catch(err => {
        this.loading = false
      });
    },
    fetchPermissions(){
      getPermissionTree().then(response => {
        this.permissions = []
        const permission = { id: 0, label: '顶级类目', children: [] }
        permission.children = response.data
        this.permissions.push(permission)
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
