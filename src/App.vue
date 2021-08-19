<template>
  <base-layout>
    <template #header>
      <main-nav />
    </template>
    <template #main>
      <h1
        class="
          uppercase
          text-2xl
          md:text-4xl
          text-white
          font-bold
          tracking-widest
          mb-6
          md:mb-10
        "
      >
        Популярные фильмы онлайн
      </h1>
      <div class="bg-gray-100 rounded-2xl p-8">
        <filtering-films />
        <list-films
          :popular-films="popularFilms"
          :base-img-url="$options.baseImgUrl"
          :genres="genres"
        />
      </div>
    </template>
    <template #footer>
      <p class="text-white">©2021. All rights reserved.</p>
    </template>
  </base-layout>
</template>
<script>
import BaseLayout from "@/components/BaseLayout";
import FilteringFilms from "@/components/FilteringFilms";
import ListFilms from "@/components/ListFilms";
import MainNav from "@/components/MainNav";
import { getData, CONFIGURATION_PATH, GENRES_PATH, POPULAR_PATH } from "@/api";

export default {
  name: "App",

  components: {
    BaseLayout,
    FilteringFilms,
    ListFilms,
    MainNav,
  },

  data: () => ({
    genres: {},
    popularFilms: [],
  }),

  baseImgUrl: "",

  created() {
    const setBaseImgUrl = ({ images: { base_url, backdrop_sizes } }) => {
      this.$options.baseImgUrl =
        base_url + backdrop_sizes[backdrop_sizes.length - 1];
    };

    const setGenresFilms = ({ genres }) => {
      genres.forEach(({ id, name }) => {
        this.genres[id] = name;
      });
    };

    const setPopularFilms = ({ results }) => {
      this.popularFilms = results;
    };

    getData(CONFIGURATION_PATH, setBaseImgUrl);
    getData(GENRES_PATH, setGenresFilms);
    getData(POPULAR_PATH, setPopularFilms);
  },
};
</script>
