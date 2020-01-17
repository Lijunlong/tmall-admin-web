<template>
  <div class="app-container">
		<el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
		</el-card>

    <!--表格渲染-->
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" size="small" style="width: 100%;" border>
        <el-table-column :show-overflow-tooltip="true" width="100px" label="标题"  align="center">
          <template slot-scope="scope">{{scope.row.jokeTitle}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="内容" align="center">
          <template slot-scope="scope">{{scope.row.jokeContent}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width="90px" label="星级" align="center">
          <template slot-scope="scope">{{scope.row.jokeStar}}</template>
        </el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="90px" label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
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
	import {fetchJokeList} from '@/api/timingTools'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5
  };
	export default {
    name: 'joke',
    data() {
      return {
        list: null,
				total: null,
				listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
      }
    },
    created() {
      this.getList();
    },
    filters:{
			
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
				fetchJokeList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
					this.total = response.data.total;
        });
			}
    }
  }
</script>

<style scoped>
</style>
