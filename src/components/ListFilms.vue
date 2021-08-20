<template>
  <section>
    <h2 class="sr-only">Список фильмов</h2>
    <ul
      class="
        grid grid-cols-1
        sm:grid-cols-2
        md:grid-cols-4
        lg:grid-cols-5
        gap-4
      "
    >
      <li
        class="flex flex-col max-w-xs mx-auto sm:max-w-none"
        v-for="film of popularFilms"
        :key="film.id"
      >
        <div
          class="order-2 p-2 flex flex-col justify-center shadow-xl"
          style="height: 150px"
        >
          <h3 class="font-bold leading-4 mb-2">
            {{ film.title }}
          </h3>
          <p class="text-sm font-semibold text-green-400">
            {{ formattedDate(film) }}, {{ calculatedGenres(film) }}
          </p>
        </div>
        <a
          class="
            order-1
            flex-grow
            hover:shadow-2xl hover:scale-105
            transform-gpu
            transition-transform transition-shadow
          "
          href=""
        >
          <img class="h-full" :src="baseImgUrl + film.poster_path" alt="" />
        </a>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  name: "ListFilms",

  props: {
    genres: {
      type: Object,
      required: true,
    },

    popularFilms: {
      type: Array,
      required: true,
    },

    baseImgUrl: {
      type: String,
      required: true,
    },
  },

  computed: {
    calculatedGenres() {
      return (film) => film.genre_ids.map((id) => this.genres[id]).join(", ");
    },
    formattedDate() {
      return (film) => {
        if (film.release_date === undefined) {
          return "-";
        }

        return film.release_date.split("-")[0];
      };
    },
  },
};
</script>