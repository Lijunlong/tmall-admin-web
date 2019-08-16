<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增菜单' : '编辑菜单'" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单图标">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.icon" style="width: 460px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="内部菜单" prop="iFrame">
        <el-radio-group v-model="form.iFrame">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接地址">
        <el-input v-model="form.path" placeholder="菜单路径" style="width: 460px;"/>
      </el-form-item>
      <el-form-item v-if="form.iFrame == '1'" label="组件路径">
        <el-input v-model="form.component" placeholder="菜单路径" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="上级类目">
        <treeselect v-model="form.pid" :options="menus" style="width: 460px;" placeholder="选择上级类目" />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio-group v-model="form.enabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示" prop="hidden">
        <el-radio-group v-model="form.hidden">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
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
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMenus,updateMenu,insertMenu } from '@/api/menu'

export default {
  components: { Treeselect, IconSelect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, menus: [],
      form: { name: '', sort: 999, path: '', component: '', iFrame: '', roles: [], pid: 0, icon: '', enabled: '',hidden: ''  },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        iFrame: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        hidden: [
          { required: true, message: '不能为空', trigger: 'change' }
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
          this.loading = true
          if (this.isAdd) {
            this.doAdd();
          } else{
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
    doAdd(){
      insertMenu(this.form).then(response => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.$emit("getMenuList")
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    doUpdate(){
      updateMenu(this.form.id, this.form).then(response => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.$emit("getMenuList")
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { name: '', sort: 999, path: '', component: '', iFrame: '', roles: [], pid: 0, icon: '', enabled: '', hidden: ''}
    },
    selected(name) {
      this.form.icon = name
    },
    getMenus(){
      getMenus().then(response => {
        this.menus = []
        const menu = { id: 0, label: '顶级类目', children: [] }
        menu.children = response.data
        this.menus.push(menu)
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
