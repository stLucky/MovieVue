<template>
  <nav class="max-w-xl flex flex-row flex-wrap items-center">
    <div class="mr-4 md:mr-8" v-for="genre of visibleGenres" :key="genre">
      <a
        class="p-1 text-white hover:text-green-400 transition-colors font-bold"
        @click.prevent="onGenreClick(genre)"
        href=""
      >
        {{ genre }}</a
      >
    </div>
    <div class="relative">
      <a
        class="p-1 text-white hover:text-green-400 transition-colors font-bold"
        href=""
        @mouseover="isOverMore = true"
        @mouseleave="isOverMore = false"
      >
        Eще</a
      >
      <ul
        v-show="isOverMore"
        @mouseover="isOverMore = true"
        @mouseleave="isOverMore = false"
        class="absolute bg-gray-200 p-4 z-20 rounded-md top-full left-0"
      >
        <li v-for="genre of moreGenres" :key="genre.id">
          <a
            class="text-black hover:text-green-400 transition-colors"
            href=""
            @click.prevent="onGenreClick(genre), (isOverMore = false)"
          >
            {{ genre }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: "MainNav",

  props: {
    genres: {
      type: Object,
      required: true,
    },
  },

  emits: {
    filterFilms: null,
  },

  data: () => ({
    isOverMore: false,
  }),

  maxVisibleCountFilms: 4,

  computed: {
    listGenres() {
      return Object.values(this.genres);
    },

    formattedGenres() {
      return this.listGenres.map(this.toUpperCaseFirst);
    },

    visibleGenres() {
      return this.formattedGenres.slice(0, this.$options.maxVisibleCountFilms);
    },

    moreGenres() {
      return this.formattedGenres.slice(this.$options.maxVisibleCountFilms);
    },
  },

  methods: {
    toUpperCaseFirst(str) {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    },

    onGenreClick(genre) {
      const id = Object.keys(this.genres).find(
        (key) => this.genres[key].toUpperCase() === genre.toUpperCase()
      );

      this.$emit("filterFilms", id);
    },
  },
};
</script>
