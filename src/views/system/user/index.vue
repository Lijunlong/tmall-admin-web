<template>
  <div v-if="checkPermission(['ADMIN','USER_ALL','USER_SELECT'])" class="app-container">
    <!--form 组件-->
    <eForm ref="dialogForm" :is-add="isAdd" @getUserList="getUserList"/>
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @change="getUserList" @input="getDeptDatas" @keyup.enter.native="getUserList"/>
        </div>
        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col>
      <!--用户数据-->
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.value" clearable placeholder="输入关键字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
            <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-select v-model="query.enabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="doQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <div v-permission="['ADMIN','USER_ALL','USER_CREATE']" style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
        </div>
        <!--表格渲染-->
        <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;" border>
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="telphone" label="电话"/>
          <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱"/>
          <el-table-column label="部门 / 岗位">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }} / {{ scope.row.job.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabled =='1' ? 'success' : 'danger'">{{scope.row.enabled | enabledInfo}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT','USER_DELETE'])" label="操作" width="125" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','USER_ALL','USER_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-popover
                v-permission="['ADMIN','USER_ALL','USER_DELETE']"
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :page-size="listQuery.pageSize"
            :page-sizes="[5,10,15]"
            :current-page.sync="listQuery.pageNum"
            :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
  <div v-else>无法访问，您可能没有权限</div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getDeptList } from '@/api/dept'
import { fetchUserList } from '@/api/user'
import { parseTime } from '@/utils/index'
import eForm from './form'
import { deleteUser } from '@/api/user'

export default {
  components: { eForm },
  data() {
    return {
      list: null,total: null,listLoading: false,delLoading: false,isAdd: false,deptName: '',depts: [],deptId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        deptId: null,
        username: null,
        email: null,
        enabled: null
      },
      query: {
        value: null,
        type: null,
        enabled: null
      },
      queryTypeOptions: [
        { key: 'username', display_name: '用户名' },
        { key: 'email', display_name: '邮箱' }
      ],
      enabledTypeOptions: [
        { key: '1', display_name: '激活' },
        { key: '0', display_name: '锁定' }
      ]
    }
  },
  created() {
    this.getDeptDatas()
    this.getUserList()
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
  methods: {
    parseTime,
    checkPermission,
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getUserList();
    },
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
      getDeptList(params).then(response => {
        this.depts = response.data
      });
    },
    async getUserList(){
      this.listLoading = true;
      fetchUserList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list
        this.total = response.data.total;
        //初始化，清空查询条件
        this.listQuery.deptId = null;//清空部门id
        this.listQuery.username = null;//清空用户名
        this.listQuery.email = null;//清空邮箱
        this.listQuery.enabled = null;//清空状态
      }).catch(err => {
        this.listLoading = false
        //初始化，清空查询条件
        this.listQuery.deptId = null;//清空部门id
        this.listQuery.username = null;//清空用户名
        this.listQuery.email = null;//清空邮箱
        this.listQuery.enabled = null;//清空状态
      });
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.listQuery.deptId = null
      } else {
        this.listQuery.deptId = data.id
      }
      this.getUserList();
    },
    subDelete(row) {
      const id = row.id
      this.delLoading = true
      this.$refs[id].doClose()
      deleteUser(id).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
        this.getUserList();
        this.delLoading = false
      }).catch(err => {
        this.delLoading = false
      })
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.dialogForm
      _this.jobListQuery.deptId = data.dept.id
      _this.getDepts()
      _this.getJobs();
      _this.getRoles();
      _this.roleIds= []
      _this.form = { nickName: data.nickName, username: data.username, enabled: data.enabled, telphone: data.telphone, email: data.email, dept: { id: data.dept.id }, job: { id: data.job.id }, roles: [] };
      _this.deptId = data.dept.id
      _this.jobId = data.job.id
      data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      _this.userId = data.id
      _this.dialog = true
    },
    add() {
      this.isAdd = true
      this.$refs.dialogForm.getDepts()
      this.$refs.dialogForm.getRoles()
      this.$refs.dialogForm.dialog = true
    },
    toQuery(){
      if(!this.query.type){
        this.$message({
          message: '类型不能为空',
          type: 'warning'
        })
        return;
      }else{
        this.doQuery();
      }
    },
    doQuery(){
      if(this.query.type == 'username'){
        this.listQuery.username = this.query.value;
      }else if(this.query.type == 'email'){
        this.listQuery.email = this.query.value;
      }
      if(this.query.enabled){
        this.listQuery.enabled = this.query.enabled;
      }
      this.getUserList();
    }
  }
}
</script>

<style scoped>
</style>
