<template>
	<div class="app-container">
		<el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">
				<router-link :to="'/pms/productCate'" :key="previousCateName">{{previousCateName}}</router-link>
				数据列表
			</span>
			<el-button
        class="btn-back"
        @click="back()"
        size="mini"
				v-if="isShowBack()">
        返回
      </el-button>
      <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
		<div class="table-container">
			<el-table ref="productCateTable"
								style="width: 100%"
								:data="list"
								v-loading="listLoading" border >
				<el-table-column label="编号" width="100" align="center">
					<template slot-scope="scope">{{scope.row.id}}</template>
				</el-table-column>
				<el-table-column label="分类名称" align="center">
					<template slot-scope="scope">{{scope.row.name}}</template>
				</el-table-column>
				<el-table-column label="级别" width="100" align="center">
					<template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
				</el-table-column>
				<el-table-column label="是否显示" width="100" align="center">
					<template slot-scope="scope">
						<el-switch
							@change="handleShowStatusChange(scope.$index, scope.row)"
							:active-value="1"
							:inactive-value="0"
							v-model="scope.row.showStatus">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="排序" width="100" align="center">
					<template slot-scope="scope">{{scope.row.sort }}</template>
				</el-table-column>
				<el-table-column label="设置" width="200" align="center">
					<template slot-scope="scope">
						<el-button
							size="mini"
							:disabled="scope.row.level | disableNextLevel"
							@click="handleShowNextLevel(scope.$index, scope.row)">查看下级
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template slot-scope="scope">
						<el-button
							size="mini"
							@click="handleUpdate(scope.$index, scope.row)">编辑
						</el-button>
						<el-button
							size="mini"
							type="danger"
							@click="handleDelete(scope.$index, scope.row)">删除
						</el-button>
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
  import {fetchList, getProductCate, updateShowStatus } from '@/api/productCate'
	export default {
		name: 'productCate',
    data() {
			return {
				list: null,
				total: null,
				nextLevelList: null,
				listLoading: true,
				nextLevelListLoading: true,
				listQuery: {
          pageNum: 1,
          pageSize: 5
        },
				parentId: 0,
				previousCateName: ''//先前的产品类别名称
			}
		},
		created() {
			this.getList();
		},
		watch: {
    	$route(route) {
        this.resetParentId();
				this.getList();
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
			resetParentId(){
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
			getList() {
				this.listLoading = true;
				if(this.$route.query.parentId != null && this.$route.query.parentId != ''){
					this.parentId = this.$route.query.parentId;
				}
				getProductCate(this.parentId).then(response => {
					if(response && response.data){
						this.previousCateName = response.data.name + " - ";
					}else{
						this.previousCateName = '';
					}
        });
        fetchList(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
					this.total = response.data.total;
        });
			},
			handleAddProductCate() {
        this.$router.push('/pms/addProductCate');
			},
			handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductCate',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductCate(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
			},
			showProductCateChildren:function(data){
				fetchList(data.id, this.listQuery).then(response => {
          this.childrenListLoading = false;
          this.childrenList = response.data.list;
          this.total = response.data.total;
        });
			},
			handleShowNextLevel(index, row) {
				this.previousCateName = row.name + " - ";//先前的产品类别名称
				this.$router.push({path: '/pms/productCate', query: {parentId: row.id}})
			},
			handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        data.append('id',row.id);
        data.append('showStatus',row.showStatus);
        updateShowStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
			},
			back(){
        this.$router.push('/pms/productCate');//返回上一层
			},
			isShowBack(){//是否显示返回按钮
				return this.parentId !== 0;
			}
		},
		filters: {
      levelFilter(value) {
				if (value === 0) {
					return '一级';
				} else if (value === 1) {
					return '二级';
				}
			},
			disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
		}
  }
</script>

<style scoped>
.btn-back{
	float: right;
	background-color: white;
}
</style>
