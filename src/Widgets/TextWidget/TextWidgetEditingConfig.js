import * as Scrivito from "scrivito";
import textWidgetIcon from "../../assets/images/text_widget.svg";

Scrivito.provideEditingConfig("TextWidget", {
  title: "Text",
  thumbnail: textWidgetIcon,
  attributes: {
    alignment: {
      title: "Alignment",
      description: "Default: Left",
      values: [
        { value: "left", title: "Left" },
        { value: "center", title: "Center" },
        { value: "right", title: "Right" },
      ],
    },
    text: {
      title: "Text",
      description: "The actual source code of this text",
    },
  },
  properties: ["alignment", "text"],
  initialContent: {
    alignment: "left",
  },
  validations: [["text", validateAndFixSemanticHtml]],
});

let validateTagsTimeoutId;

function validateAndFixSemanticHtml(html, { widget }) {
  if (html !== semanticHtml(html)) {
    // prevent update flood in case of many changes:
    clearTimeout(validateTagsTimeoutId);

    // autofix workaround:
    validateTagsTimeoutId = setTimeout(() => {
      widget.update({ text: semanticHtml(widget.get("text")) });
    }, 0);

    // safety net: if autofixing misses an instance, still output a warning:
    return {
      severity: "warning",
      message: "The HTML contains a non-semantic tag.",
    };
  }
}

function semanticHtml(html) {
  return html
    .replace("<b>", "<strong>")
    .replace("</b>", "</strong>")
    .replace("<i>", "<em>")
    .replace("</i>", "</em>");
}
