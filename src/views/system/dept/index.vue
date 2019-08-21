<template>
  <div v-if="checkPermission(['ADMIN','DEPT_ALL','DEPT_SELECT'])" class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.enabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','DEPT_ALL','DEPT_CREATE']" style="display: inline-block;margin: 0px 2px;">
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
      </div>
    </div>
		<!--表单组件-->
    <eForm ref="dialogForm" :is-add="isAdd" @getDeptList="getDeptList"/>
    <!--表格渲染-->
    <tree-table v-loading="listLoading" :expand-all="expand" :data="list" :columns="columns" size="small">
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
					<el-tag :type="scope.row.enabled =='1' ? 'success' : 'danger'">{{scope.row.enabled | enabledInfo}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','DEPT_ALL','DEPT_EDIT','DEPT_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','DEPT_ALL','DEPT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','DEPT_ALL','DEPT_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" :disabled="scope.row.id === 1" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
  <div v-else style="padding:30px;">
    <el-alert :closable="false" title="无法访问，您可能还没有权限" type="error"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import treeTable from '@/components/TreeTable'
import { parseTime } from '@/utils/index'
import { getDeptList,getDepts,delDept } from '@/api/dept'
import eForm from './form'

export default {
  components: { treeTable,eForm },
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      enabledTypeOptions: [
        { key: '1', display_name: '正常' },
        { key: '0', display_name: '禁用' }
      ],
			delLoading: false, expand: true,listLoading: false,list: [],isAdd: false,
			query: {value: null, enabled: null}
    }
	},
	filters:{
    enabledInfo(data){
      if(data==null||data===''){
        return 'N/A';
      }
      if(data == '1'){
        return '启用'
      }else{
        return '禁用'
      }
    }
  },
  created() {
		this.getDeptList();
  },
  methods: {
    parseTime,
    checkPermission,
    changeExpand() {
      this.expand = !this.expand
      this.getDeptList();
		},
		getDeptList(){
			this.listLoading = true
			const params = {name: this.query.value,enabled: this.query.enabled}
			getDeptList(params).then(response => {
				this.listLoading = false;
				this.list = response.data
			}).catch(err => {
				this.listLoading = false
			});
		},
		subDelete(id) {
      this.delLoading = true
      delDept(id).then(response => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.getDeptList()
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
		edit(data) {
      this.isAdd = false
      const _this = this.$refs.dialogForm
      _this.form = {
        id: data.id,
        name: data.name,
        pid: data.pid,
        createTime: data.createTime,
        enabled: data.enabled
			}
			_this.getDepts()
      _this.dialog = true
    },
    add(){
      this.isAdd = true
      const _this = this.$refs.dialogForm
      _this.getDepts()
      _this.dialog = true
    },
    toQuery(){
      this.getDeptList();
    }
	}
}
</script>

<style scoped>

</style>
