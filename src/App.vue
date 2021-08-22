<template>
  <base-layout>
    <template #header>
      <main-nav :genres="genres" @filter-films="setFilterFilms" />
    </template>
    <template #main>
      <div
        class="xl:container xl:mx-auto px-4 md:px-6 xl:px-8"
        :class="{
          flex: !hasData || isLockedView,
          'flex-col': !hasData || isLockedView,
          'h-full': !hasData || isLockedView,
        }"
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
          :class="{ 'flex-grow': !hasData || isLockedView }"
        >
          <page-404 v-if="!hasData" />
          <template v-else>
            <loader-films v-if="isLockedView" />
            <template v-else>
              <list-films
                :popular-films="renderedFilms"
                :base-img-url="$options.baseImgUrl"
                :genres="genres"
                @open-film="onFilmClick"
              />
              <popup-film :is-opened="isOpenedPopup" @close="closePopup">
                <h1 class="text-2xl font-semibold text-green-600">
                  {{ detailsFilm.title }}
                </h1>
                <p class="font-medium text-gray-500 mb-2.5">
                  {{ detailsFilm.runtime }}
                  {{
                    declinationOfNumbers(detailsFilm.runtime, [
                      "минута",
                      "минуты",
                      "минут",
                    ])
                  }}
                </p>
                <p class="italic text-base mb-3.5">
                  {{ detailsFilm.overview }}
                </p>
                <iframe
                  v-if="videosKey"
                  class="w-full h-full"
                  :src="`https://www.youtube.com/embed/${videosKey}`"
                >
                </iframe>
                <div v-else class="h-full flex justify-center items-center">
                  <p class="text-2xl font-semibold text-center">
                    К сожалению трейлер к видео отсутствует
                  </p>
                </div>
              </popup-film>
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
      <p class="text-white">
        Produced by
        <a
          class="hover:text-green-400 transition-colors"
          href="https://github.com/stLucky"
          >stLucky</a
        >
      </p>
    </template>
  </base-layout>
</template>
<script>
import BaseLayout from "@/components/BaseLayout";
import ListFilms from "@/components/ListFilms";
import PopupFilm from "@/components/PopupFilm";
import MainNav from "@/components/MainNav";
import LoaderFilms from "@/components/LoaderFilms";
import Page404 from "@/components/Page404";

import {
  getData,
  CONFIGURATION_PATH,
  GENRES_PATH,
  POPULAR_PATH,
  DISCOVER_PATH,
  DETAILS_PATH,
} from "@/api";

export default {
  name: "App",

  components: {
    BaseLayout,
    ListFilms,
    PopupFilm,
    MainNav,
    LoaderFilms,
    Page404,
  },

  RENDERING_DELAY_TIME: 1500,

  data: () => ({
    genres: {},
    films: [],
    currentPage: 1,
    currentGenre: null,
    isLockedView: false,
    hasData: true,
    isOpenedPopup: false,
    detailsFilm: {},
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

    hasFilmsOnPage() {
      return this.endIndexFilm <= this.films.length;
    },

    renderedFilms() {
      return this.films.slice(this.startIndexFilm, this.endIndexFilm);
    },

    nameGenre() {
      return this.genres[this.currentGenre];
    },

    videosKey() {
      return this.detailsFilm.videos.length > 0
        ? this.detailsFilm.videos[0]?.key
        : undefined;
    },

    declinationOfNumbers() {
      return (number, words) => {
        return words[
          number % 100 > 4 && number % 100 < 20
            ? 2
            : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
        ];
      };
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

    const requestToApi = async () => {
      try {
        this.lockedView();
        getData(CONFIGURATION_PATH, setBaseImgUrl);
        getData(GENRES_PATH, setGenresFilms);
        getData(POPULAR_PATH, this.setFilms, this.currentPage).then(
          this.unlockedView
        );
      } catch (err) {
        console.log(err);
        this.showError();
      }
    };

    requestToApi();
  },

  watch: {
    currentPage(newVal, oldVal) {
      if (newVal > oldVal && !this.hasFilmsOnPage) {
        this.lockedView();

        if (this.currentGenre) {
          getData(
            DISCOVER_PATH,
            this.setFilms,
            this.currentPage,
            this.currentGenre
          )
            .then(this.unlockedView)
            .catch((err) => {
              console.log(err);
              this.showError();
            });

          return;
        }

        getData(POPULAR_PATH, this.setFilms, this.currentPage)
          .then(this.unlockedView)
          .catch((err) => {
            console.log(err);
            this.showError();
          });
      }
    },
  },

  methods: {
    async onFilmClick(id) {
      try {
        await getData(`${DETAILS_PATH}${id}`, this.fillInfoFilm, undefined, id);

        this.isOpenedPopup = true;
      } catch (err) {
        console.log(err);
        this.showError();
      }
    },

    unlockedView() {
      setTimeout(() => {
        this.isLockedView = false;
      }, this.$options.RENDERING_DELAY_TIME);
    },

    lockedView() {
      this.isLockedView = true;
    },

    closePopup() {
      this.isOpenedPopup = false;
      this.detailsFilm = {};
    },

    fillInfoFilm({ title, overview, runtime, videos: { results } }) {
      this.detailsFilm = {
        title,
        overview,
        runtime,
        videos: results,
      };
    },

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
      this.hasData = true;

      this.lockedView();

      getData(DISCOVER_PATH, this.updateFilms, this.currentPage, id)
        .then(this.unlockedView)
        .catch((err) => {
          console.log(err);
          this.showError();
        });
    },
  },
};
</script>
