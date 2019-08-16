<template>
	<el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
		<product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </product-info-detail>
		<product-sale-detail
			v-show="showStatus[1]"
			v-model="productParam"
			:is-edit="isEdit"
			@nextStep="nextStep"
			@prevStep="prevStep"
			@finishCommit="finishCommit">
		</product-sale-detail>
  </el-card>
</template>

<script>
	import ProductInfoDetail from './ProductInfoDetail';
	import ProductSaleDetail from './ProductSaleDetail';
	import {createProduct} from '@/api/product';

	const defaultProductParam = {
		name: null,//商品名称
		pic: null,//商品图片地址
		productSn: null,//货号
		deleteStatus: null,//删除状态：0->未删除；1->已删除
		publishStatus: null,//上架状态：0->下架；1->上架
		newStatus: null,//新品状态:0->不是新品；1->新品
		recommandStatus: null,//推荐状态；0->不推荐；1->推荐
		verifyStatus: null,//审核状态：0->未审核；1->审核通过
		sort: null,	//排序
		sale: null,//销量
		price: null,//价格
		promotionPrice: null,//促销价格
		subTitle: null,//副标题
		description: null,//商品描述
		originalPrice: null,//市场价
		stock: null,//库存
		lowStock: null,//库存预警值
		unit: null,//单位
		weight: null,//商品重量，默认为克
		previewStatus: 1,//是否为预告商品：0->不是；1->是
		serviceIds: null,//以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮
		keywords: null,//关键字
		note: null,//备注信息
		albumPics: null,//画册图片，连产品图片限制为5张，以逗号分割
		brandId: null,//品牌id
		brandName: null,//品牌名称
		productCategoryId: null,//产品分类id
		productCategoryName: null//产品分类名称
	};
	export default {
		name: 'ProductDetail',
		components: {ProductInfoDetail,ProductSaleDetail},
		props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
				 active: 0,
				 showStatus: [true, false, false, false],
				 productParam: Object.assign({}, defaultProductParam),
      }
    },
    methods: {
			hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
			},
			prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
			nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
			},
			finishCommit(isEdit) {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(isEdit){
						this.$message({
							type: 'success',
							message: '提交成功',
							duration:1000
						});
          }else{
						createProduct(this.productParam).then(response=>{
							this.$message({
								type: 'success',
								message: '提交成功',
								duration:1000
							});
							location.reload();
						})

						
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
