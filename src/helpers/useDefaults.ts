import type { TaskOptions } from "@/extensions/task/types";
import { provide } from "vue";
import { useI18n } from "vue-i18n";

export default function (props: { taskOptions: Partial<TaskOptions> }) {
  const { t } = useI18n();

  // Set default task options with respect to the provided options
  // If the instance is a player, only set
  provide("defaultTaskOptions", {
    allowEmptyAnswerSubmission: false,
    hasMaxAttempts: true,
    maxAttempts: 2,
    textSubmitButton: t("global.options.text-submit-button"),
    titleCorrectAnswer: t("global.options.title-correct-answer"),
    textCorrectAnswer: t("global.options.text-correct-answer"),
    titleIncorrectAnswer: t("global.options.title-incorrect-answer"),
    textIncorrectAnswer: t("global.options.text-incorrect-answer"),
    titleFinalIncorrectAnswer: t("global.options.title-final-incorrect-answer"),
    textFinalIncorrectAnswer: t("global.options.text-final-incorrect-answer"),
    ...props.taskOptions,
  });
}
