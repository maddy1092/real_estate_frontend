export default {
  methods: {
    breadItemsSetLang() {
      const items = JSON.parse(JSON.stringify(this.$route.meta.bread_items));
      items.forEach(item => {
        item.text = this.$t(item.text);
      });
      return items;
    }
  }
};
