<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px 0px">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="changeExpand">{{ expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true"/>
      </div>
    </div>
		<!--表单组件-->
    <eForm ref="dialogForm" :is-add="isAdd" @getPermissionList="getPermissionList"/>
    <!--表格渲染-->
    <tree-table v-loading="listLoading" :data="list" :expand-all="expand" :columns="columns" size="small">
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
			<el-table-column label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200">
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import treeTable from '@/components/TreeTable'
import { getPermissionList, delPermissions } from '@/api/permission'
import eForm from './form'

export default {
	components: { treeTable, eForm },
  data() {
    return {
			listLoading: false,delLoading: false,expand: true,list: [],isAdd: false,
			columns: [
        {
          text: '名称',
          value: 'name'
        },
        {
          text: '别名',
          value: 'alias'
        }
      ],
      query: {value: null}
    }
  },
  created() {
		this.getPermissionList();
  },
  methods: {
		parseTime,
		getPermissionList(){
      this.listLoading = true
      const params = {name: this.query.value}
			getPermissionList(params).then(response => {
				this.listLoading = false;
        this.list = response.data
      }).catch(err => {
        this.listLoading = false
      });
    },
    add() {
      this.isAdd = true
      this.$refs.dialogForm.fetchPermissions()
      this.$refs.dialogForm.dialog = true
    },
		edit(data) {
      this.isAdd = false
      const _this = this.$refs.dialogForm
      _this.form = { id: data.id, name: data.name, alias: data.alias, pid: data.pid }
      _this.fetchPermissions()
      _this.dialog = true
    },
    subDelete(id) {
      this.delLoading = true
      delPermissions(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.getPermissionList();
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    changeExpand() {
      this.expand = !this.expand
      this.getPermissionList();
    },
    toQuery(){
      this.getPermissionList();
    }
  }
}
</script>

<style scoped>

</style>
