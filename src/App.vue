<template>
  <base-layout>
    <template #header>
      <main-nav :genres="genres" @filter-films="setFilterFilms" />
    </template>
    <template #main>
      <div
        class="xl:container xl:mx-auto px-4 md:px-6 xl:px-8"
        :class="{ 'h-full': !hasData || !isUnlockedLoader }"
      >
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
          :class="{ 'text-green-400': currentGenre }"
        >
          {{ currentGenre ? nameGenre : "Популярные фильмы онлайн" }}
        </h1>
        <div
          class="bg-gray-100 rounded-2xl p-8 relative"
          :class="{ 'h-full': !hasData || !isUnlockedLoader }"
        >
          <page-404 v-if="!hasData" />
          <template v-else>
            <loader-films v-if="!isUnlockedLoader" />
            <template v-else>
              <list-films
                :popular-films="renderedFilms"
                :base-img-url="$options.baseImgUrl"
                :genres="genres"
              />
              <ul class="flex flex-row justify-center mt-10">
                <li class="mr-10">
                  <a
                    class="
                      p-4
                      border
                      rounded-xl
                      shadow-md
                      bg-gray-700
                      text-white
                      font-bold
                    "
                    :class="disabledBackClass"
                    @click.prevent="onBackClick"
                    href=""
                    :disabled="isFirstPage"
                    >Предыдущая</a
                  >
                </li>
                <li>
                  <a
                    class="
                      p-4
                      border
                      rounded-xl
                      shadow-md
                      bg-gray-700
                      text-white
                      font-bold
                    "
                    :class="disabledNextClass"
                    @click.prevent="onNextClick"
                    href=""
                    >Следующая</a
                  >
                </li>
              </ul>
            </template>
          </template>
        </div>
      </div>
    </template>
    <template #footer>
      <p class="text-white">©2021. All rights reserved.</p>
    </template>
  </base-layout>
</template>
<script>
import BaseLayout from "@/components/BaseLayout";
import ListFilms from "@/components/ListFilms";
import MainNav from "@/components/MainNav";
import LoaderFilms from "@/components/LoaderFilms";
import Page404 from "@/components/Page404";

import {
  getData,
  CONFIGURATION_PATH,
  GENRES_PATH,
  POPULAR_PATH,
  DISCOVER_PATH,
} from "@/api";

export default {
  name: "App",

  components: {
    BaseLayout,
    ListFilms,
    MainNav,
    LoaderFilms,
    Page404,
  },

  data: () => ({
    genres: {},
    films: [],
    currentPage: 1,
    currentGenre: null,
    isUnlockedLoader: false,
    hasData: true,
  }),

  computed: {
    isFirstPage() {
      return this.currentPage === 1;
    },

    hasNextPage() {
      return this.films.length < this.endIndexFilm;
    },

    disabledBackClass() {
      return {
        "opacity-50": this.isFirstPage,
        "cursor-default": this.isFirstPage,
      };
    },

    disabledNextClass() {
      return {
        "opacity-50": this.hasNextPage,
        "cursor-default": this.hasNextPage,
      };
    },

    startIndexFilm() {
      return (this.currentPage - 1) * this.$options.filmsOnPage;
    },

    endIndexFilm() {
      return this.currentPage * this.$options.filmsOnPage;
    },

    renderedFilms() {
      return this.films.slice(this.startIndexFilm, this.endIndexFilm);
    },

    nameGenre() {
      return this.genres[this.currentGenre];
    },
  },

  baseImgUrl: "",
  filmsOnPage: 20,

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

    getData(CONFIGURATION_PATH, setBaseImgUrl, this.showError);
    getData(GENRES_PATH, setGenresFilms, this.showError);
    getData(POPULAR_PATH, this.setFilms, this.showError, this.currentPage);
  },

  watch: {
    currentPage(newVal, oldVal) {
      if (newVal > oldVal) {
        if (this.currentGenre) {
          getData(
            DISCOVER_PATH,

            this.setFilms,
            this.showError,
            this.currentPage,
            this.currentGenre
          );

          return;
        }
        getData(POPULAR_PATH, this.setFilms, this.showError, this.currentPage);
      }
    },

    films() {
      this.$nextTick(() => (this.isUnlockedLoader = true));
    },
  },

  methods: {
    onNextClick() {
      this.currentPage++;
    },

    onBackClick() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    setFilms({ results }) {
      this.films = [...this.films, ...results];
    },

    updateFilms({ results }) {
      this.films = results;
    },

    showError() {
      this.hasData = false;
    },

    setFilterFilms(id) {
      this.currentPage = 1;
      this.currentGenre = id;

      getData(
        DISCOVER_PATH,

        this.updateFilms,
        this.showError,
        this.currentPage,
        id
      );
    },
  },
};
</script>
