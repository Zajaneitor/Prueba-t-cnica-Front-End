<template>
  <div class="min-h-screen flex flex-col bg-slate-900 text-slate-100">
    <!-- Header -->
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div
        class="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <h1 class="text-2xl font-bold">
          Galería de Arte – Art Institute of Chicago
        </h1>
        <p class="text-sm text-slate-300">
          Scroll infinito, filtros en vivo y pruebas E2E.
        </p>
      </div>
    </header>

    <!-- Filtros -->
    <section class="max-w-6xl mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
        <!-- Búsqueda por texto -->
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1" for="search">
            Buscar por título o artista
          </label>
          <input
            id="search"
            data-cy="search-input"
            type="text"
            v-model="searchText"
            placeholder="Ej. Monet, Water Lilies, etc."
            class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Filtro por artista -->
        <div class="w-full md:w-64">
          <label class="block text-sm font-medium mb-1" for="artist">
            Filtrar por artista
          </label>
          <select
            id="artist"
            data-cy="artist-select"
            v-model="selectedArtist"
            class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos</option>
            <option
              v-for="artist in artists"
              :key="artist"
              :value="artist"
            >
              {{ artist || 'Desconocido' }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- Galería -->
    <main class="flex-1">
      <section class="max-w-6xl mx-auto px-4 pb-8">
        <div
          v-if="error"
          class="mb-4 rounded-lg bg-red-900/40 border border-red-500 px-4 py-3 text-sm text-red-100"
        >
          {{ error }}
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ArtworkCard
            v-for="art in filteredArtworks"
            :key="art.id"
            :artwork="art"
            :iiif-url="iiifUrl"
          />
        </div>

        <!-- Estado de carga / no más resultados -->
        <div
          class="mt-6 flex flex-col items-center gap-2 text-sm text-slate-300"
        >
          <div v-if="loading">
            Cargando más obras...
          </div>
          <div v-else-if="!hasMore && artworks.length > 0">
            No hay más resultados para mostrar.
          </div>
          <div v-else-if="!loading && filteredArtworks.length === 0">
            No se encontraron obras con los filtros actuales.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ArtworkCard from "./components/ArtworkCard.vue";
import { fetchArtworks } from "./services/artworksApi";

const artworks = ref([]);
const page = ref(1);
const hasMore = ref(true);
const loading = ref(false);
const error = ref(null);
const iiifUrl = ref("https://www.artic.edu/iiif/2");

// Filtros
const searchText = ref("");
const selectedArtist = ref("all");

// Lista de artistas únicos para el select
const artists = computed(() => {
  const set = new Set();
  artworks.value.forEach((a) => {
    if (a.artist_title) {
      set.add(a.artist_title);
    }
  });
  return Array.from(set).sort();
});

// Aplicar filtros en memoria
const filteredArtworks = computed(() => {
  const search = searchText.value.trim().toLowerCase();

  return artworks.value.filter((a) => {
    const title = (a.title || "").toLowerCase();
    const artist = (a.artist_title || "").toLowerCase();

    const matchesSearch =
      !search || title.includes(search) || artist.includes(search);

    const matchesArtist =
      selectedArtist.value === "all" ||
      a.artist_title === selectedArtist.value;

    return matchesSearch && matchesArtist;
  });
});

async function loadPage(p) {
  try {
    loading.value = true;
    error.value = null;

    const { artworks: newArtworks, pagination, iiifUrl: url } =
      await fetchArtworks(p, 20);

    if (p === 1) {
      artworks.value = newArtworks;
    } else {
      artworks.value = [...artworks.value, ...newArtworks];
    }

    if (url) {
      iiifUrl.value = url;
    }

    const current = pagination.current_page || p;
    const totalPages = pagination.total_pages || current;
    hasMore.value = current < totalPages;
  } catch (e) {
    console.error(e);
    error.value = "No se pudieron cargar las obras. Intenta de nuevo.";
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
}

function loadInitial() {
  page.value = 1;
  hasMore.value = true;
  loadPage(page.value);
}

function loadMore() {
  if (!hasMore.value || loading.value) return;
  page.value += 1;
  loadPage(page.value);
}

// Scroll infinito básico
function handleScroll() {
  const scrollPos = window.innerHeight + window.scrollY;
  const threshold = document.documentElement.scrollHeight - 200;

  if (scrollPos >= threshold) {
    loadMore();
  }
}

onMounted(() => {
  loadInitial();
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
