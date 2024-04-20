<template>
  <editor
    api-key="le0o98t5frz80j27coeuq1cx95h593lnycolk0hma28jvird"
    v-model="terms_en"
    :init="{
      height: 330,
      menubar: false,
      resize: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor charmap emoticons ',
        'searchreplace visualblocks code fullscreen directionality',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar: [
        'cut copy paste newdocument remove | undo redo|link image table  charmap emoticons|fullscreen media',
        'bold italic strikethrough  |removeformat|indent outdent| blockquote|   alignleft aligncenter alignright alignjustify |ltr rtl',
        'styleselect | formatselect| fontselect|fontsizeselect|forecolor backcolor|  '
      ]
    }"
  />
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "tiny-editor",
  emits: ["input"],
  props: {
    value: Object
  },
  components: {
    editor: Editor
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
