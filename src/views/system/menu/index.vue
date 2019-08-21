<template>
  <div v-if="checkPermission(['ADMIN','MENU_ALL','MENU_SELECT'])" class="app-container">
    <!--工具栏-->
    <div class="head-container">
			<!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','MENU_ALL','MENU_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="changExpand">{{ expand ? '折叠' : '展开' }}</el-button>
      </div>
		</div>
		<!--表单组件-->
		<eForm ref="dialogForm" :is-add="isAdd" @getMenuList="getMenuList"/>
		<!--表格渲染-->
		<tree-table v-loading="listLoading" :data="list" :expand-all="expand" :columns="columns" size="small">
			<el-table-column prop="icon" label="图标" align="center" width="80px">
				<template slot-scope="scope">
					<svg-icon :icon-class="scope.row.icon" />
				</template>
			</el-table-column>
			<el-table-column prop="sort" align="center" width="100px" label="排序">
				<template slot-scope="scope">
					<el-tag>{{ scope.row.sort }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="path" label="链接地址"/>
			<el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径"/>
			<el-table-column prop="iFrame" width="100px" label="内部菜单">
				<template slot-scope="scope">
					<span v-if="scope.row.iFrame == '1'">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建日期">
				<template slot-scope="scope">
					<span>{{ parseTime(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column v-if="checkPermission(['ADMIN','MENU_ALL','MENU_EDIT','MENU_DELETE'])" label="操作" width="130px" align="center">
				<template slot-scope="scope">
					<el-button v-permission="['ADMIN','MENU_ALL','MENU_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
					<el-popover
						v-permission="['ADMIN','MENU_ALL','MENU_DELETE']"
						:ref="scope.row.id"
						placement="top"
						width="200">
						<p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
						<div style="text-align: right; margin: 0">
							<el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
							<el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
						</div>
						<el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
					</el-popover>
				</template>
			</el-table-column>
		</tree-table>
  </div>
	<div v-else style="padding:30px;">
    <el-alert :closable="false" title="无法访问，您可能还没有权限" type="error"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils/index'
import treeTable from '@/components/TreeTable'
import { getMenuList,delMenu } from '@/api/menu'
import eForm from './form'

export default {
	components: { treeTable,eForm },
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
			delLoading: false, expand: true, list: [], listLoading: false,isAdd: false,
			query: {value: null}
    }
  },
  created() {
		this.getMenuList();
  },
  methods: {
		parseTime,
		checkPermission,
		getMenuList(){
			this.listLoading = true
      const params = {name: this.query.value}
			getMenuList(params).then(response => {
				this.listLoading = false;
        this.list = response.data
      }).catch(err => {
        this.listLoading = false
      });
		},
		add() {
      this.isAdd = true
      this.$refs.dialogForm.getMenus()
      this.$refs.dialogForm.dialog = true
    },
		edit(data) {
      this.isAdd = false
      const _this = this.$refs.dialogForm
      _this.form = { id: data.id, component: data.component, name: data.name, sort: data.sort, pid: data.pid, path: data.path, iFrame: data.iFrame, roles: [], icon: data.icon, enabled: data.enabled, hidden: data.hidden }
      _this.getMenus()
      _this.dialog = true
		},
		toQuery(){
			this.getMenuList();
		},
		changExpand() {
			this.expand = !this.expand
			this.getMenuList();
		},
		subDelete(id) {
      this.delLoading = true
      delMenu(id).then(res => {
        this.delLoading = false
				this.$refs[id].doClose()
        this.$notify({
					title: '删除成功',
          type: 'success',
          duration: 2500
        })
				this.getMenuList();
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
  }
}
</script>

<style scoped>

</style>
