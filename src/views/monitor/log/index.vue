<template>
  <div class="app-container">
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
			listLoading: false,list: [],total: null,
			listQuery: {
        pageNum: 1,
        pageSize: 5
      },
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
      }).catch(err => {
        this.listLoading = false
      });
		},
  }
}
</script>

<style scoped>

</style>
