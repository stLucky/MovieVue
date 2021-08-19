<template>
  <section class="flex flex-row flex-wrap mb-6 md:mb-10">
    <h2 class="sr-only">Фильтрация фильмов по категориям</h2>
    <ul class="flex flex-row flex-wrap">
      <li class="mr-4 md:mr-8">
        <a
          href=""
          class="
            text-black
            hover:text-green-600
            transition-colors
            font-semibold
          "
        >
          Жанр</a
        >
      </li>
      <li class="mr-4 md:mr-8">
        <a
          href=""
          class="
            text-black
            hover:text-green-600
            transition-colors
            font-semibold
          "
        >
          Год
        </a>
      </li>
      <li class="mr-4 md:mr-8">
        <a
          href=""
          class="
            text-black
            hover:text-green-600
            transition-colors
            font-semibold
          "
        >
          Страна</a
        >
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  name: "FilteringFilms",
};
</script>
