<template>
  <article
    class="bg-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col"
    data-cy="artwork-card"
  >
    <div class="aspect-[4/3] bg-slate-700 flex items-center justify-center">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="artwork.title || 'Obra de arte'"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <span v-else class="text-sm text-slate-300 px-4 text-center">
        Imagen no disponible
      </span>
    </div>

    <div class="p-4 flex flex-col gap-1">
      <h3 class="font-semibold text-lg line-clamp-2">
        {{ artwork.title || 'Sin título' }}
      </h3>
      <p class="text-sm text-slate-300">
        <span class="font-medium">Artista:</span>
        {{ artwork.artist_title || 'Desconocido' }}
      </p>
      <p class="text-sm text-slate-300">
        <span class="font-medium">Año:</span>
        {{ artwork.date_display || 'N/D' }}
      </p>
      <p class="text-xs text-slate-400 mt-1">
        <span class="font-medium">Galería:</span>
        {{ artwork.gallery_title || 'Scisa' }}
      </p>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  artwork: {
    type: Object,
    required: true,
  },
  iiifUrl: {
    type: String,
    required: true,
  },
});

// Construimos la URL de la imagen usando image_id + iiifUrl
const imageUrl = computed(() => {
  const id = props.artwork.image_id;
  if (!id) return null;
  return `${props.iiifUrl}/${id}/full/843,/0/default.jpg`;
});
</script>
