<template>
	<el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
			<el-form-item label="分类级别：" prop="level">
        <el-radio-group v-model="productCate.level" @change="levelRadioChange">
          <el-radio-button :label="0">一级菜单</el-radio-button>
          <el-radio-button v-if="isShowLevel" :label="1">二级菜单</el-radio-button>
        </el-radio-group>
      </el-form-item>
			<el-form-item v-if="productCate.level == '1'" label="上级分类：" prop="parentId">
        <el-select v-model="productCate.parentId"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectProductCateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model="productCate.sort"></el-input>
      </el-form-item>
			<el-form-item label="是否显示：" prop="showStatus">
        <el-radio-group v-model="productCate.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-form-item label="分类图标：" prop="icon">
        <single-upload v-model="productCate.icon"></single-upload>
      </el-form-item>
			<el-form-item label="关键词：" prop="keywords">
        <el-input v-model="productCate.keywords"></el-input>
      </el-form-item>
      <el-form-item label="分类描述：" prop="description">
        <el-input type="textarea" :autosize="true" v-model="productCate.description"></el-input>
      </el-form-item>
			<el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
        <el-button class="btn-back" @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
	</el-card>
</template>

<script>
  import { fetchList ,createProductCate, updateProductCate, getProductCate } from '@/api/productCate';
  import SingleUpload from '@/components/Upload/singleUpload';

	const defaultProductCate = {
    name: '',
    level: 0,
		parentId: 0,
		showStatus: '',
		icon: '',
		keywords: '',
		description: ''
  };
	export default {
		name: 'ProductCateDetail',
		components: {SingleUpload},
		props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
				productCate: Object.assign({}, defaultProductCate),
				selectProductCateList: [],
				rules: {
          name: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          parentId: [{required: true, message: '该项为必填项', trigger: 'change'}],
          sort: [{required: true, message: '该项为必填项', trigger: 'blur'}],
          showStatus: [{required: true, message: '该项为必填项', trigger: 'change'}],
          icon: [{required: true, message: '请上传图片'}],
          keywords: [{required: true, message: '该项为必填项', trigger: 'blur'}],
          description: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        },
        isShowLevel: true
      }
		},
		created() {
      if (this.isEdit) {
        getProductCate(this.$route.query.id).then(response => {
          this.productCate = response.data;
          if(this.isEdit && this.productCate && this.productCate.level == 0){
            this.isShowLevel = false;
          }
        });
      } else {
        this.productCate = Object.assign({}, defaultProductCate);
      }
      this.getSelectProductCateList();//获取上级分类列表
		},
    methods: {
      getSelectProductCateList() {
        fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectProductCateList = response.data.list;
        });
      },
			onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateProductCate(this.$route.query.id, this.productCate).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductCate(this.productCate).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.productCate = Object.assign({}, defaultProductCate);
      },
      levelRadioChange:function(val){
        let that = this;
        if(val === 1 && this.productCate.parentId === 0){
          this.productCate.parentId = null;
        }else if(val === 0){
          this.productCate.parentId = 0;
        }
      },
      back(){
        this.$router.push({path: '/pms/productCate', query: {parentId: this.productCate.parentId}})
    	}
    }
  }
</script>

<style scoped>
</style>
