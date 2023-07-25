import { provide } from "vue";
import { useI18n } from "vue-i18n";

import type { TaskOptions } from "@/extensions/task/types";

export type InjectedDefaults = {
  taskOptions: TaskOptions;
};

export default function (props: { taskOptions: Partial<TaskOptions> }): InjectedDefaults {
  const { t } = useI18n();

  const taskOptions = {
    allowEmptyAnswerSubmission: false,
    hasMaxAttempts: true,
    maxAttempts: 2,
    hasDisabledCheckTimer: true,
    disabledCheckTimer: 10,
    hasDisabledNextTimer: true,
    disabledNextTimer: 5,
    textSubmitButton: t("global.options.text-submit-button"),
    titleCorrectAnswer: t("global.options.title-correct-answer"),
    textCorrectAnswer: t("global.options.text-correct-answer"),
    titleIncorrectAnswer: t("global.options.title-incorrect-answer"),
    textIncorrectAnswer: t("global.options.text-incorrect-answer"),
    titleFinalIncorrectAnswer: t("global.options.title-final-incorrect-answer"),
    textFinalIncorrectAnswer: t("global.options.text-final-incorrect-answer"),
    ...props.taskOptions
  };

  provide("defaults", {
    taskOptions,
  });

  return { taskOptions };
}
