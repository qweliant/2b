import {
  ObjectInstance,
  ObjectContent,
  PropertyValueSchema,
  PropertyValue,
} from "@/store/objectsStore";
import { z } from "zod";

interface FormattingOptions {
  includeExportDate?: boolean;
  dateFormat?: string;
  indentSize?: number;
  includeToc?: boolean;
  escapeSpecialChars?: boolean;
}

/**
 * Converts an object instance to formatted MDX markdown
 * @param object - The object instance to convert
 * @param options - Formatting options
 * @returns Formatted MDX string
 */
const objectToMarkdown = (
  object: ObjectInstance,
  options: FormattingOptions = {}
): string => {
  const {
    includeExportDate = false,
    indentSize = 3,
    escapeSpecialChars = true,
  } = options;

  const indent = " ".repeat(indentSize);

  const escape = (text: string): string =>
    escapeSpecialChars ? text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&") : text;

  // Helper to format dates
  const formatDate = (date: string | Date): string =>
    new Date(date).toISOString();

  // Recursive function to format frontmatter values
  const formatValue = (value: any, depth = 0): string => {
    if (typeof value === "object" && value !== null) {
      const isArray = Array.isArray(value);
      const entries = Object.entries(value)
        .map(
          ([k, v]) =>
            `${indent.repeat(depth + 1)}${k}: ${formatValue(v, depth + 1)}`
        )
        .join("\n");
      return isArray
        ? `[\n${entries}\n${indent.repeat(depth)}]`
        : `\n${entries}`;
    }
    return typeof value === "string" ? `"${value}"` : `${value}`;
  };

  // Generate YAML frontmatter
  const generateFrontmatter = (): string => {
    // Find the first `valueDate` in properties
    const firstDate = Object.values(object.properties)
      .map((prop) => prop.valueDate) // Extract the valueDate field
      .find((date) => date !== undefined); // Find the first defined date
    const frontmatterObj = {
      title: object.title.replace(/["`']/g, ""),
      date: firstDate ? formatDate(firstDate) : formatDate(new Date()),
      type: object.type,
      pinned: object.pinned,
      ...(object.description && { description: escape(object.description) }),
      ...(object.aiReady !== undefined && { aiReady: object.aiReady }),
      pageCustomization: {
        backgroundColor: object.pageCustomization.backgroundColor,
        backgroundImage: object.pageCustomization.backgroundImage,
        defaultFont: object.pageCustomization.defaultFont,
        freeDrag: object.pageCustomization.freeDrag,
      },
      properties: Object.entries(object.properties).reduce(
        (acc: Record<string, Omit<PropertyValue, "id">>, [id, prop]) => {
          acc[id] = {
            objectId: prop.objectId,
            ...(prop.value !== undefined && { value: prop.value }),
            ...(prop.valueBoolean !== undefined && {
              boolean: prop.valueBoolean,
            }),
            ...(prop.valueNumber !== undefined && { number: prop.valueNumber }),
            ...(prop.valueDate && { date: formatDate(prop.valueDate) }),
            ...(prop.referencedObjectId && {
              referencedObjectId: prop.referencedObjectId,
            }),
          };
          return acc;
        },
        {} as Record<string, Omit<PropertyValue, "id">>
      ),
    };

    return (
      "---\n" +
      Object.entries(frontmatterObj)
        .filter(([_, value]) => value !== undefined) // Remove undefined fields
        .map(([key, value]) => `${key}: ${formatValue(value)}`)
        .join("\n") +
      "\n---\n\n"
    );
  };

  // Format content based on type
  const formatContent = (content: ObjectContent): string => {
    switch (content.type) {
      case "text":
        return `${escape(content.content as string)}\n\n`;
      case "image":
        return `![Image](${content.content})\n\n`;
      case "file":
        return `[File Link](${content.content})\n\n`;
      case "drawing":
        return `![Drawing](${content.content})\n\n`;
      case "bookmark":
        return `[Bookmark](${content.content})\n\n`;
      default:
        return `<!-- Unsupported content type: ${content.type} -->\n\n`;
    }
  };

  // Build the complete markdown
  let markdown = generateFrontmatter();

  // Add title
  markdown += `# ${escape(object.title)}\n\n`;

  // Add description if present
  if (object.description) markdown += `${escape(object.description)}\n\n`;

  // Add contents
  if (object.contents && Object.keys(object.contents).length > 0) {
    Object.values(object.contents).forEach((content) => {
      markdown += formatContent(content);
    });
  }

  console.log("CLIENT SIDE MD", markdown);
  return markdown;
};

export default objectToMarkdown;
