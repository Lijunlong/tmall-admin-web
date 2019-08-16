<template>
  <el-dialog :visible.sync="dialog" append-to-body title="执行日志" width="88%">
    <!--表格渲染-->
    <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;margin-top: -10px;" border>
      <el-table-column :show-overflow-tooltip="true" label="任务名称" align="center">
        <template slot-scope="scope">{{scope.row.jobName}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="Bean名称" align="center">
        <template slot-scope="scope">{{scope.row.beanName}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="执行方法" align="center">
        <template slot-scope="scope">{{scope.row.methodName}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="120px" label="参数" align="center">
        <template slot-scope="scope">{{scope.row.params}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="cron表达式" align="center">
        <template slot-scope="scope">{{scope.row.cronExpression}}</template>
      </el-table-column>
      <el-table-column label="异常详情" width="110px"  align="center">
        <template slot-scope="scope">
          <el-button v-show="scope.row.exceptionDetail" size="mini" type="text" @click="info(scope.row.exceptionDetail)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="100px" label="耗时(毫秒)" align="center">
        <template slot-scope="scope">{{scope.row.time}}</template>
      </el-table-column>
      <el-table-column width="80px" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSuccess =='0' ? 'success' : 'danger'">{{ scope.row.isSuccess == '0' ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="创建日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="errorDialog" append-to-body title="异常详情" width="85%">
      <el-input type="textarea" autosize v-model="errorInfo" readonly/>
    </el-dialog>
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
  </el-dialog>
</template>

<script>
  import {formatDate} from '@/utils/date';
  import {fetchLogList} from '@/api/timing'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5
  };
	export default {
    name: 'log',
    filters:{
      formatTime(time) {
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        dialog: false,
        errorDialog: false,
        list: null,
        total: null,
        errorInfo: null
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        fetchLogList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
					this.total = response.data.total;
        });
      },
      info(errorInfo) {
        this.errorInfo = errorInfo
        this.errorDialog = true
      }
    }
  }
</script>

<style scoped>
textarea{
  width: 100%;
}
</style>
