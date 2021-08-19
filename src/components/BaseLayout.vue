<template>
  <div
    class="bg-gray-700"
    style="
      display: grid;
      min-height: 100%;
      grid-template-rows: min-content 1fr min-content;
    "
  >
    <header
      class="
        py-4
        md:py-6
        xl:py-8
        border-b border-green-400 border-solid
        shadow-2xl
      "
    >
      <div class="xl:container xl:mx-auto px-4 md:px-6 xl:px-8">
        <slot name="header"></slot>
      </div>
    </header>
    <main class="py-2 md:py-4 xl:py-6">
      <div class="xl:container xl:mx-auto px-4 md:px-6 xl:px-8">
        <slot name="main"></slot>
      </div>
    </main>
    <footer class="py-4 md:py-6 xl:py-8">
      <div class="xl:container xl:mx-auto px-4 md:px-6 xl:px-8">
        <slot name="footer"></slot>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  name: "BaseLayout",
};
</script>
