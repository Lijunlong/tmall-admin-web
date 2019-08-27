<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="请输入搜索内容" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;">
      <el-table-column prop="creater" label="用户名"/>
      <el-table-column prop="requestIp" label="IP"/>
      <el-table-column prop="address" label="IP来源"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column :show-overflow-tooltip="true" prop="method" label="方法名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数"/>
      <el-table-column prop="time" label="请求耗时" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getLogList } from '@/api/log'

export default {
	data() {
    return {
			listLoading: false,list: [],total: null,query: { type: null, name: null },
			listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      queryTypeOptions: [
        { key: 'creater', display_name: '用户名' },
        { key: 'ip', display_name: 'IP地址' },
        { key: 'description', display_name: '描述' }
      ]
    }
	},
  created() {
		this.getLogList();
  },
  methods: {
		parseTime,
		handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getLogList();
    },
		getLogList(){
			this.listLoading = true
			getLogList(this.listQuery).then(response => {
				this.listLoading = false;
				this.list = response.data.list
        this.total = response.data.total;
        //初始化，清空查询条件
        this.listQuery.creater = null;//清空部门id
        this.listQuery.ip = null;//清空用户名
        this.listQuery.emdescriptionail = null;//清空邮箱
      }).catch(err => {
        this.listLoading = false
        //初始化，清空查询条件
        this.listQuery.creater = null;//清空部门id
        this.listQuery.ip = null;//清空用户名
        this.listQuery.emdescriptionail = null;//清空邮箱
      });
    },
    toQuery(){
      if(!this.query.type && this.query.value){
        this.$message({
          message: '类型不能为空',
          type: 'warning'
        })
        return;
      }else if(!this.query.value && this.query.type){
        this.$message({
          message: '搜索内容不能为空',
          type: 'warning'
        })
      }else{
        if(this.query.type == 'creater'){
          this.listQuery.creater = this.query.value;
        }else if(this.query.type == 'ip'){
          this.listQuery.ip = this.query.value;
        }else if(this.query.type == 'description'){
          this.listQuery.description = this.query.value;
        }
        this.getLogList();
      }
    }
  }
}
</script>

<style scoped>

</style>
