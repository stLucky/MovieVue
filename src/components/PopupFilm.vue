<template>
  <div
    class="fixed inset-0 z-20 bg-black bg-opacity-80"
    v-if="isOpened"
    @click="close"
  >
    <div
      class="
        absolute
        inset-0
        bg-white
        z-30
        m-auto
        w-3/4
        h-3/4
        rounded-3xl
        p-7
        overflow-auto
      "
      @click.stop
    >
      <button
        class="absolute right-3 top-2 text-2xl font-bold hover:text-green-400"
        @click="close"
      >
        Х
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    close: null,
  },

  mounted() {
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  },

  methods: {
    handleKeydown(e) {
      if (this.isOpened && e.key === "Escape") {
        this.close();
      }
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>
