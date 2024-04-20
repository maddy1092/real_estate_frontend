<template>
  <div class="overflow-hidden text-xs-center pt-2">
    <v-pagination
      v-model="page"
      :length="pagesCount"
      :total-visible="10"
    ></v-pagination>
  </div>
</template>

<script>
  export default {
    name: "Paginator",
    props: ['pagesCount'],
    computed: {
      page: {
        get: function(){
          return parseInt(this.$route.query.page) || 1
        },
        set: function(value){
          this.$router.push({query: {...this.$route.query, page: value}})
        }
      }
    }
  }
</script>

<style scoped>

</style>