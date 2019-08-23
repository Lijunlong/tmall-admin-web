<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;">
      <el-table-column prop="creater" label="用户名"/>
      <el-table-column prop="requestIp" label="IP"/>
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
			listLoading: false,list: [],errorInfo: '', dialog: false,total: null,
			listQuery: {
        pageNum: 1,
        pageSize: 5
      }
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
      }).catch(err => {
        this.listLoading = false
      });
		},
		info(data) {
			this.dialog = true
			this.errorInfo = data.exceptionDetail
    }
  }
}
</script>

<style scoped>

</style>
