<template>
  <div class="flex flex-col h-full border border-2 shadow rounded-lg divide-y divide-gray-200">
    <div>
      <div class="sm:hidden">
        <label for="tabs" class="sr-only">
          {{ $t("statistics.tab-option-none") }}
        </label>
        <select
          v-model="selectedTab"
          class="block w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
        >
          <option :selected="selectedTab === 'Events'">
            {{ $t("statistics.tab-option-events") }}
          </option>
          <option :selected="selectedTab === 'Statistics'">
            {{ $t("statistics.tab-option-statistics") }}
          </option>
        </select>
      </div>
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex bg-slate-50" aria-label="Tabs">
            <a
              :class="[
                selectedTab === 'Events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'w-1/4 py-3 px-1 text-center border-b-2 font-medium text-sm cursor-pointer grow',
              ]"
              :aria-current="selectedTab === 'Events' ? 'page' : undefined"
              @click="selectedTab = 'Events'"
              >{{ $t("statistics.tab-option-events") }}</a
            >
            <a
              :class="[
                selectedTab === 'Statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'w-1/4 py-3 px-1 text-center border-b-2 font-medium text-sm cursor-pointer grow',
              ]"
              :aria-current="selectedTab === 'Statistics' ? 'page' : undefined"
              @click="selectedTab = 'Statistics'"
              >{{ $t("statistics.tab-option-statistics") }}</a
            >
          </nav>
        </div>
      </div>
    </div>
    <div v-if="selectedTab === 'Statistics'" class="p-4">Statistics</div>
    <div v-if="selectedTab === 'Events'" class="flex flex-row grow overflow-auto">
      <div class="flex flex-col border-r w-68">
        <div class="flex-none p-1.5 bg-slate-50 border-b">
          <input class="w-full text-sm p-1" placeholder="Filter" type="text" disabled />
        </div>
        <div class="grow">
          <ul class="divide-y divide-gray-200" role="list">
            <li
              v-for="(event, index) in filteredEventsPlayer"
              :key="index"
              class="py-2 px-2 hover:bg-gray-50 cursor-pointer"
              @click="selectedEvent = event"
            >
              <div class="flex space-x-1 min-w-[250px]">
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium">
                      <LabelComponent :label="event.label" />
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{
                        event?.ts ? dayjs(event.ts).format("HH:mm:ss:SSS") : "No timestamp provided"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex w-full overflow-auto">
        <span v-if="!selectedEvent" class="mx-auto my-auto">
          {{ $t("statistics.tab-events-placeholder") }}
        </span>
        <div v-else class="p-4">
          <dl>
            <dt class="text-sm font-medium text-gray-500">
              {{ $t("statistics.tab-events-timestamp") }}
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{
                selectedEvent?.ts
                  ? dayjs(selectedEvent.ts).format("HH:mm:ss:SSS")
                  : "No timestamp provided"
              }}
            </dd>
          </dl>
          <dl class="mt-2">
            <dt class="text-sm font-medium text-gray-500">
              {{ $t("statistics.tab-events-type") }}
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ selectedEvent?.type || "No type provided" }}
            </dd>
          </dl>
          <dl class="mt-2">
            <dt class="text-sm font-medium text-gray-500">
              {{ $t("statistics.tab-events-facts") }}
            </dt>
            <dd v-if="!selectedEvent?.facts" class="mt-1 text-sm text-gray-900">
              No facts provided
            </dd>
          </dl>
          <div>
            <pre v-if="!!selectedEvent?.facts" class="mt-1 text-xs text-gray-900">{{
              selectedEvent?.facts
            }}</pre>
          </div>
          <dl class="mt-2">
            <dt class="text-sm font-medium text-gray-500">
              {{ $t("statistics.tab-events-data") }}
            </dt>
            <dd v-if="!selectedEvent?.data" class="mt-1 text-sm text-gray-900">No data provided</dd>
          </dl>
          <div>
            <pre v-if="!!selectedEvent?.data" class="mt-1 text-xs text-gray-900">{{
              selectedEvent?.data
            }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import type { EmittedEvent } from "@/extensions/document/types";
import type { PropType } from "vue";
import LabelComponent from "@/helpers/LabelComponent.vue";

export default defineComponent({
  name: "TutoringMaterialStatistics",
  components: { LabelComponent },
  props: {
    events: {
      type: Array as PropType<EmittedEvent[]>,
      required: true,
    },
  },

  data() {
    return {
      selectedTab: "Events",
      selectedEvent: null as EmittedEvent | null,
    };
  },

  computed: {
    filteredEventsPlayer(): EmittedEvent[] {
      return this.events.map((e: EmittedEvent) => e);
    },
  },

  methods: {
    dayjs(ts: number) {
      return dayjs(ts);
    },
  },
});
</script>
