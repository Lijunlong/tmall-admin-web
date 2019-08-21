<template>
  <div v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_SELECT'])" class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入岗位名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.enabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','USERJOB_ALL','USERJOB_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
		<!--表单组件-->
    <eForm ref="dialogForm" :is-add="isAdd" @getJobList="getJobList"/>
    <!--表格渲染-->
    <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;">
			<el-table-column prop="name" label="名称"/>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          <div>{{ scope.row.deptSuperiorName ? scope.row.deptSuperiorName + ' / ' : '' }}{{ scope.row.dept.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
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
      <el-table-column v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_EDIT','USERJOB_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','USERJOB_ALL','USERJOB_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','USERJOB_ALL','USERJOB_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div v-else>无法访问，您可能没有权限</div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import { getJobs,deleleJob } from '@/api/job'
import eForm from './form'

export default {
	components: { eForm },
  data() {
    return {
			listLoading: false,delLoading: false,list: [],isAdd: false,
      query: {value: null, enabled: null},
      enabledTypeOptions: [
        { key: '1', display_name: '正常' },
        { key: '0', display_name: '禁用' }
      ]
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
		this.getJobList();
  },
  methods: {
    parseTime,
    checkPermission,
		getJobList(){
			this.listLoading = true
      const params = {name: this.query.value, enabled: this.query.enabled}
			getJobs(params).then(response => {
				this.listLoading = false;
        this.list = response.data.list
      }).catch(err => {
        this.listLoading = false
      });
		},
		subDelete(id) {
      this.delLoading = true
      deleleJob(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.getJobList();
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
		add() {
      this.isAdd = true
      this.$refs.dialogForm.getDepts()
      this.$refs.dialogForm.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.dialogForm
      _this.getDepts()
      _this.form = {
        id: data.id,
        name: data.name,
        sort: data.sort,
        enabled: data.enabled,
        umsDepartmentId: data.umsDepartmentId
      }
      _this.deptId = data.umsDepartmentId
      _this.dialog = true
    },
    toQuery(){
      this.getJobList();
    }
  }
}
</script>

<style scoped>

</style>
