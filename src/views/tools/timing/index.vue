<template>
  <div class="app-container">
		<el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
		</el-card>

    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-container"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="dialog = true;isAdd = true">新增</el-button>
    </div>
    <!-- 任务日志 -->
    <div style="display: inline-block;">
      <el-button
        class="filter-container"
        size="mini"
        type="warning"
        icon="el-icon-tickets"
        @click="doLog">执行日志</el-button>
      <Log ref="log"/>
    </div>
    <!--Form表单-->
    <el-dialog :visible.sync="dialog" :title="isAdd ? '新增任务' : '编辑任务'" append-to-body width="600px">
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules" size="small" label-width="100px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="dialogForm.jobName" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="Bean名称" prop="beanName">
          <el-input v-model="dialogForm.beanName" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="dialogForm.methodName" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input v-model="dialogForm.params" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="dialogForm.cronExpression" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio v-model="dialogForm.isPause" label="0">启用</el-radio>
          <el-radio v-model="dialogForm.isPause" label="1" >暂停</el-radio>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="dialogForm.remark" style="width: 460px;" rows="2" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="listLoading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;" border>
        <el-table-column :show-overflow-tooltip="true" width="100px" label="任务名称"  align="center">
          <template slot-scope="scope">{{scope.row.jobName}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="Bean名称" align="center">
          <template slot-scope="scope">{{scope.row.beanName}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="90px" label="执行方法" align="center">
          <template slot-scope="scope">{{scope.row.methodName}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="80px" label="参数" align="center">
          <template slot-scope="scope">{{scope.row.params}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="100px" label="cron表达式" align="center">
          <template slot-scope="scope">{{scope.row.cronExpression}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="90px" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isPause == '1' ? 'warning' : 'success'">{{ scope.row.isPause == '1' ? '已暂停' : '运行中' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="描述" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="更新日期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" style="margin-right: 3px;" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row.id)">执行</el-button>
            <el-button style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row.id,scope.row.isPause == '1' ? '恢复' : '暂停')">
              {{ scope.row.isPause == '1' ? '恢复' : '暂停' }}
            </el-button>
            <el-popover
              :ref="scope.row.id"
              placement="top"
              width="200">
              <p>确定停止并删除该任务吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  import {formatDate} from '@/utils/date';
  import {fetchList,createJob,editJob,executeJob,updateJobStatus,deleteJob} from '@/api/timing'
  import Log from './log'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5
  };
	export default {
    name: 'timing',
    components: {
      Log
    },
    data() {
      return {
        list: null,
        total: null,
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        delLoading: false,
        isAdd: false,
        dialog: false,
        dialogForm: { jobName: '', beanName: '', methodName: '', params: '', cronExpression: '', isPause: '0', remark: '' }, permissionIds: [],
        rules: {
          jobName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          beanName: [
            { required: true, message: '请输入Bean名称', trigger: 'blur' }
          ],
          methodName: [
            { required: true, message: '请输入方法名称', trigger: 'blur' }
          ],
          cronExpression: [
            { required: true, message: '请输入Cron表达式', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    filters:{
      formatTime(time) {
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
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
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
					this.total = response.data.total;
        });
      },
      execute(id) {
        executeJob(id).then(response => {
          this.getList();
          this.$message({
            message: '执行成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateStatus(id){
        updateJobStatus(id).then(response => {
          this.getList();
          this.$message({
            message: '执行成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      deleteJob(id){
        deleteJob(id).then(response => {
          this.getList();
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      edit(data){
        this.isAdd = false
        this.dialogForm = { id: data.id, jobName: data.jobName, beanName: data.beanName, methodName: data.methodName, params: data.params, cronExpression: data.cronExpression, isPause: data.isPause.toString(), remark: data.remark }
        this.dialog = true
      },
      cancel() {
        this.resetForm()
      },
      resetForm() {
        this.dialog = false
        this.$refs['dialogForm'].resetFields()
        this.form = { jobName: '', beanName: '', methodName: '', params: '', cronExpression: '', isPause: '0', remark: '' }
      },
      doSubmit() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            if (this.isAdd) {
              this.doAdd()
            } else {
              this.doEdit()
            }
          } else {
            return false
          }
        })
      },
      doAdd() {
        createJob(this.dialogForm).then(response => {
          this.getList();
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1000
          });
        })
      },
      doEdit() {
        editJob(this.dialogForm.id,this.dialogForm).then(response => {
          this.getList();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        })
      },
      subDelete(id) {
        this.delLoading = true
        deleteJob(id).then(response => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.getList();
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        })
      },
      doLog() {
        this.$refs.log.dialog = true
        this.$refs.log.getList()
      }
    }
  }
</script>

<style scoped>
</style>
