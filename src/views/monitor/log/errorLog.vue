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
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="异常详情" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="info(scope.row)">查看详情</el-button>
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
    <el-dialog :visible.sync="dialog" title="异常详情" append-to-body width="85%">
			<el-input type="textarea" autosize v-model="errorInfo" readonly/>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getErrorLogList } from '@/api/log'

export default {
  data() {
    return {
			listLoading: false,list: [],errorInfo: '', dialog: false,total: null,query: { type: null, name: null },
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
		this.getErrorLogList();
  },
  methods: {
		parseTime,
		handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getErrorLogList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getErrorLogList();
    },
		getErrorLogList(){
			getErrorLogList(this.listQuery).then(response => {
				this.listLoading = false;
				this.list = response.data.list
        this.total = response.data.total;
        //初始化，清空查询条件
        this.listQuery.creater = null;//清空部门id
        this.listQuery.ip = null;//清空用户名
        this.listQuery.description = null;//清空邮箱
      }).catch(err => {
        this.listLoading = false
        //初始化，清空查询条件
        this.listQuery.creater = null;//清空部门id
        this.listQuery.ip = null;//清空用户名
        this.listQuery.emdescriptionail = null;//清空邮箱
      });
		},
		info(data) {
			this.dialog = true
			this.errorInfo = data.exceptionDetail
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
        this.getErrorLogList();
      }
    }
  }
}
</script>

<style scoped>

</style>
