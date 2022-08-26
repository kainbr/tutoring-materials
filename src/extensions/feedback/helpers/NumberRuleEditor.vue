<template>
  <span class="px-1">
    <select
      :value="rule.operation"
      class="bg-transparent cursor-pointer appearance-none"
      @change="updateOperation"
    >
      <option value="smaller">
        {{ $t("global.condition.number.label-smaller") }}
      </option>
      <option value="smaller-equal">
        {{ $t("global.condition.number.label-smaller-equal") }}
      </option>
      <option value="equal">
        {{ $t("global.condition.number.label-equal") }}
      </option>
      <option value="greater-equal">
        {{ $t("global.condition.number.label-greater-equal") }}
      </option>
      <option value="greater">
        {{ $t("global.condition.number.label-greater") }}
      </option>
    </select>
  </span>

  <span class="max-w-fit">
    <!--suppress JSUnresolvedVariable -->
    <input
      type="number"
      class="bg-transparent cursor-pointer appearance-none w-10"
      :value="rule.value"
      :min="min"
      :max="max"
      :step="step"
      @change="updateValue"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { PropType } from "vue";
import type {
  EventCondition,
  NumberConditionOptions,
  NumberEventRule,
} from "@/extensions/feedback/types";

export default defineComponent({
  name: "NumberRuleEditor",

  props: {
    rule: {
      type: Object as PropType<NumberEventRule>,
      required: true,
    },
    condition: {
      type: Object as PropType<EventCondition>,
      required: true,
    },
  },

  emits: ["update:rule"],

  computed: {
    min() {
      return (this.condition.options as NumberConditionOptions)?.min;
    },
    max() {
      return (this.condition.options as NumberConditionOptions)?.max;
    },
    step() {
      return (this.condition.options as NumberConditionOptions)?.step;
    },
  },

  methods: {
    updateOperation($event: Event) {
      this.$emit("update:rule", {
        ...this.rule,
        operation: ($event.target as HTMLSelectElement).value,
      });
    },
    updateValue($event: Event) {
      this.$emit("update:rule", {
        ...this.rule,
        value: ($event.target as HTMLSelectElement).value,
      });
    },
  },
});
</script>
