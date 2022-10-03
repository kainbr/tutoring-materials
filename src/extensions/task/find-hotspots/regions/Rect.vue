<template>
  <div class="grid grid-flow-row-dense grid-cols-3 mt-1 gap-1.5">
    <div>
      <label
        for="x-position"
        class="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        x Position
      </label>
      <input
        type="number"
        id="x-position"
        placeholder="x Position"
        v-model="region.config.x"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
      />
    </div>
    <div>
      <label
        for="y-position"
        class="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        y Position
      </label>
      <input
        type="number"
        id="y-position"
        placeholder="y Position"
        v-model="region.config.y"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
      />
    </div>
    <div>
      <label
        for="width"
        class="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Width
      </label>
      <input
        type="number"
        id="width"
        placeholder="Width"
        v-model="region.config.width"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
      />
    </div>
    <div>
      <label
        for="height"
        class="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Height
      </label>
      <input
        type="number"
        id="height"
        placeholder="Height"
        v-model="region.config.height"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
      />
    </div>
    <div>
      <label
        for="rotation"
        class="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Rotation
      </label>
      <input
        type="number"
        id="rotation"
        placeholder="Rotation"
        v-model="region.config.rotation"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { PropType } from "vue";
import type { FHRegion } from "@/extensions/task/find-hotspots/types";

export default defineComponent({
  name: "Rect",

  props: {
    region: {
      type: Object as PropType<FHRegion>,
      required: true,
    },
  },
});
</script>
