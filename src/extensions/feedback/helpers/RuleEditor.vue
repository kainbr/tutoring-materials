<template>
  <span v-if="!!condition">
    <LabelComponent :label="condition.label" />
    <component
      :is="ruleEditor"
      :key="rule.id"
      :rule="rule"
      :condition="condition"
      @update:rule="$emit('update:rule', $event)"
    />
  </span>
  <span v-else> Unsupported rule </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LabelComponent from "@/helpers/LabelComponent.vue";

import type { PropType } from "vue";
import type { EventCondition, EventRule } from "@/extensions/feedback/types";
import NumberRuleEditor from "@/extensions/feedback/helpers/NumberRuleEditor.vue";
import BooleanRuleEditor from "@/extensions/feedback/helpers/BooleanRuleEditor.vue";

export default defineComponent({
  name: "RuleEditor",

  components: {
    LabelComponent,
  },

  props: {
    rule: {
      type: Object as PropType<EventRule>,
      required: true,
    },
    condition: {
      type: Object as PropType<EventCondition>,
      required: true,
    },
  },

  emits: ["update:rule"],

  computed: {
    ruleEditor() {
      if (!!this.condition) {
        switch (this.condition.type) {
          case "number":
            return NumberRuleEditor;
          case "boolean":
            return BooleanRuleEditor;
          default:
            return null;
        }
      } else {
        return null;
      }
    },
  },
});
</script>
