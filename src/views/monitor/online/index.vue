<template>
	<div class="app-container">
		<!--表格渲染-->
    <el-table ref="table" v-loading="listLoading" :data="list" size="small"  style="width: 100%;">
      <el-table-column type="selection" width="55" />

			<el-table-column prop="username" label="用户名"/>
      <el-table-column prop="nickName" label="用户昵称"/>
			<el-table-column label="部门 / 岗位">
				<template slot-scope="scope">
					<div>{{ scope.row.dept.name }} / {{ scope.row.job.name }}</div>
				</template>
			</el-table-column>
      <el-table-column prop="loginIp" label="登录IP"/>
      <el-table-column prop="loginAddress" label="登录地址"/>
			<el-table-column prop="browser" label="浏览器"/>
			<el-table-column :show-overflow-tooltip="true" prop="loginTime" label="登录时间">
				<template slot-scope="scope">
					<span>{{ parseTime(scope.row.loginTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">强退</el-button>
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
  </div>
</template>

<script>
import { getOnlineUmsAdminList,kickOutUmsAdmin } from '@/api/online'
import { parseTime } from '@/utils/index'

export default {
	data() {
    return {
			listLoading: false,list: [],total: null,delLoading: false,
			query: {value: null, enabled: null},
			listQuery: {
        pageNum: 1,
        pageSize: 5
      }
    }
	},
  created() {
		this.getOnlineUmsAdminList();
  },
  methods: {
		parseTime,
		handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getOnlineUmsAdminList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getOnlineUmsAdminList();
    },
		getOnlineUmsAdminList(){
			this.listLoading = true
			getOnlineUmsAdminList(this.listQuery).then(response => {
				this.listLoading = false;
				this.list = response.data.list
        this.total = response.data.total;
      }).catch(err => {
        this.listLoading = false
      });
		},
		subDelete(id) {
      this.delLoading = true
      kickOutUmsAdmin(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.getOnlineUmsAdminList();
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
