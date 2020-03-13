<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增用户' : '编辑用户'" append-to-body width="570px">
		<el-form ref="dialogForm" :inline="true" :rules="rules" :model="form" size="small" label-width="66px">
      <el-form-item v-permission="['ADMIN']" label="用户名" prop="username">
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="电话" prop="telphone">
        <el-input v-model.number="form.telphone" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="form.nickName"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="部门">
        <treeselect v-model="deptId" :options="depts" :style="style" placeholder="选择部门" @select="selectFun" />
      </el-form-item>
      <el-form-item label="岗位">
        <el-select v-model="jobId" :style="style" placeholder="请先选择部门">
          <el-option
            v-for="(item, index) in jobs"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex" style="width: 178px">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
				<el-radio-group v-model="form.enabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="角色">
        <el-select v-model="roleIds" style="width: 450px;" multiple placeholder="请选择">
          <el-option
            v-for="(item, index) in roles"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
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
import { getDepts } from '@/api/dept'
import { getJobs } from '@/api/job'
import { getRoles } from '@/api/role'
import { updateUser,createUser } from '@/api/user'

const defaultJobListQuery = {
  pageNum: 1,
  pageSize: 5,
  deptId: 99999
};
const defaultRoleListQuery = {
  pageNum: 1,
  pageSize: 99999,
};

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
			dialog: false,
			form: { nickName: '', username: '',sex: '', enabled: '', telphone: null, email: '', dept: { id: '' }, job: { id: '' }, roles: [] },
      style: 'width: 172px',
      jobListQuery: Object.assign({}, defaultJobListQuery),
      roleListQuery: Object.assign({}, defaultRoleListQuery),
      depts: [], jobs: [], roles: [], deptId: null, jobId: null, roleIds: [], loading: false, userId: null,
      rules: {
        nickName: [
          { required: true, message: '请输入别名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        telphone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
		const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },
  methods: {
		getDepts() {
      const sort = 'id,desc'
      const params = { sort: sort }
      getDepts(params).then(response => {
        this.depts = response.data
      })
		},
		selectFun(node, instanceId) {
      this.jobListQuery.deptId = node.id;
      this.getJobs(this.jobListQuery);
      this.jobId = null;
    },
    getJobs(){
      getJobs(this.jobListQuery).then(res => {
        this.jobs = res.data.list
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getRoles(){
      getRoles (this.roleListQuery).then(res => {
        this.roles = res.data.list
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
      this.$refs['dialogForm'].resetFields()
      this.deptId = null
      this.jobId = null
      this.roleIds = []
      this.form = { nickName: '', username: '', enabled: '', telphone: null, email: '', dept: { id: '' }, job: { id: '' }, roles: [] }
    },
    doSubmit() {
      this.form.dept.id = this.deptId
      this.form.job.id = this.jobId
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          if (this.deptId === null || this.deptId === undefined) {
            this.$message({
              message: '部门不能为空',
              type: 'warning'
            })
          } else if (this.jobId === null) {
            this.$message({
              message: '岗位不能为空',
              type: 'warning'
            })
          } else if (this.roleIds.length === 0) {
            this.$message({
              message: '角色不能为空',
              type: 'warning'
            })
          } else {
            this.loading = true
            this.form.roles = []
            const _this = this
            this.roleIds.forEach(function(data, index) {
              const role = { id: data }
              _this.form.roles.push(role)
            })
            if (this.isAdd) {
              createUser(this.form).then(response => {
                this.resetForm()
                this.$emit("getUserList")
                this.$notify({
                  title: '添加成功',
                  message: '默认密码：123456',
                  type: 'success',
                  duration: 2500
                });
                this.loading = false
              }).catch(err => {
                this.loading = false
              })
            } else{
              updateUser(this.userId, this.form).then(response => {
                this.resetForm()
                this.$emit("getUserList")
                this.$notify({
                  title: '修改成功',
                  type: 'success',
                  duration: 2500
                });
                this.loading = false
              }).catch(err => {
                this.loading = false
              })
            }
          }
        } else {
          return false
        }
      })
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    }
  }
}
</script>

<style scoped>

</style>
