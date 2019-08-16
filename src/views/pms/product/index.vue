<template>
	<div>
		2222
	</div>
</template>

<script>
  import {fetchProductList} from '@/api/product';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5
  };
	export default {
    name: 'product',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchProductList(this.listQuery).then(response => {
          
        });
      }
    }
  }
</script>

<style scoped>
</style>
