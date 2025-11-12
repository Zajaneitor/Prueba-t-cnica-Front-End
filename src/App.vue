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
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
      >
        <!-- Filtro 1: Búsqueda por título -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium mb-1" for="search">
            Buscar por título
          </label>
          <input
            id="search"
            data-cy="search-input"
            type="text"
            v-model="searchText"
            placeholder="Ej. Water Lilies, Sunflowers..."
            class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p class="mt-1 text-xs text-slate-400 invisible">
            &nbsp;
          </p>
        </div>

        <!-- Filtro 2: Artista -->
        <div class="flex flex-col">
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
          <p class="mt-1 text-xs text-slate-400 invisible">
            &nbsp;
          </p>
        </div>

        <!-- Filtro 3: Año mínimo -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium mb-1" for="year">
            Filtrar por año (desde)
          </label>
          <input
            id="year"
            data-cy="year-input"
            type="number"
            min="0"
            v-model="yearFilter"
            placeholder="Ej. 1800"
            class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p class="mt-1 text-xs text-slate-400">
            Muestra obras con año de inicio mayor o igual al indicado.
          </p>
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

// Estado base
const artworks = ref([]);
const page = ref(1);
const hasMore = ref(true);
const loading = ref(false);
const error = ref(null);
const iiifUrl = ref("https://www.artic.edu/iiif/2");

// Filtros
const searchText = ref("");       // título
const selectedArtist = ref("all"); // artista
const yearFilter = ref("");        // año (string)

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
  
  // Manejar yearFilter como string o número
  const yearValue = yearFilter.value !== null && yearFilter.value !== undefined 
    ? String(yearFilter.value).trim() 
    : "";
  const parsedYear = parseInt(yearValue, 10);
  const hasYearFilter = yearValue !== "" && !Number.isNaN(parsedYear);

  return artworks.value.filter((a) => {
    const title = (a.title || "").toLowerCase();
    const artist = (a.artist_title || "").toLowerCase();

    // Filtro por título
    const matchesSearch = !search || title.includes(search);

    // Filtro por artista
    const matchesArtist =
      selectedArtist.value === "all" ||
      a.artist_title === selectedArtist.value;

    // Filtro por año (usamos date_start como número)
    let matchesYear = true;
    if (hasYearFilter) {
      const start = a.date_start;
      
      // Convertir date_start a número si es necesario
      let startYear = null;
      if (start !== null && start !== undefined) {
        if (typeof start === "number") {
          startYear = start;
        } else if (typeof start === "string" && start.trim() !== "") {
          const parsed = parseInt(start, 10);
          if (!Number.isNaN(parsed)) {
            startYear = parsed;
          }
        }
      }
      
      // Si tenemos un año válido se compara
      if (startYear !== null) {
        matchesYear = startYear >= parsedYear;
      } else {
        // Si no hay fecha de inicio válida se excluye
        matchesYear = false;
      }
    }

    return matchesSearch && matchesArtist && matchesYear;
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
