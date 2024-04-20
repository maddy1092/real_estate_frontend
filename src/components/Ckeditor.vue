<template>
  <ckeditor :editor="editor" v-model="terms_en" :config="editorConfig" />
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-vue2";

export default {
  name: "CKeditor",
  emits: ["input"],
  props: {
    value: Object
  },
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {}
    };
  },
  computed: {
    terms_en: {
      get() {
        return this.value;
      },
      async set(value) {
        await this.$nextTick();
        this.$emit("input", value);
      }
    }
  }
};
</script>
