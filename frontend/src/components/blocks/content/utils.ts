import {
  ObjectInstance,
  ObjectContent,
  PropertyValueSchema,
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
    includeExportDate = true,
    indentSize = 2,
    includeToc = false,
    escapeSpecialChars = true,
  } = options;

  const indent = " ".repeat(indentSize);

  // Helper function to escape special characters
  const escape = (text: string): string => {
    if (!escapeSpecialChars) return text;
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
  };

  // Helper function to format dates
  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toISOString();
  };

  // Generate YAML frontmatter with proper escaping
  const generateFrontmatter = (): string => {
    const frontmatterObj = {
      title: escape(object.title),
      date: formatDate(new Date()),
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
    };

    const formatValue = (value: any): string => {
      if (typeof value === "object") {
        return (
          "\n" +
          Object.entries(value)
            .map(([k, v]) => `${indent}${k}: ${formatValue(v)}`)
            .join("\n")
        );
      }
      return typeof value === "string" ? `"${value}"` : `${value}`;
    };

    const frontmatter = Object.entries(frontmatterObj)
      .map(([key, value]) => `${key}: ${formatValue(value)}`)
      .join("\n");

    return `---\n${frontmatter}\n---\n\n`;
  };

  // Format content based on type
  const formatContent = (content: ObjectContent): string => {
    switch (content.type) {
      case "text":
        return `${content.content}\n\n`;
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

  // Format properties
  const formatProperties = (
    properties: Record<string, z.infer<typeof PropertyValueSchema>>
  ): string => {
    let result = "## Properties\n\n";

    Object.entries(properties).forEach(([id, prop]) => {
      result += `- **Property ID**: \`${id}\`\n`;
      result += `${indent}- Object ID: \`${prop.objectId}\`\n`;

      if (prop.value !== undefined)
        result += `${indent}- Value: ${escape(prop.value)}\n`;
      if (prop.valueBoolean !== undefined)
        result += `${indent}- Boolean Value: ${prop.valueBoolean}\n`;
      if (prop.valueNumber !== undefined)
        result += `${indent}- Number Value: ${prop.valueNumber}\n`;
      if (prop.valueDate)
        result += `${indent}- Date: ${formatDate(prop.valueDate)}\n`;
      if (prop.referencedObjectId)
        result += `${indent}- Referenced Object ID: \`${prop.referencedObjectId}\`\n`;
    });

    return result + "\n";
  };

  // Build the complete markdown
  let markdown = generateFrontmatter();

  // Add title
  markdown += `# ${escape(object.title)}\n\n`;

  // Add description if present
  if (object.description) {
    markdown += `${escape(object.description)}\n\n`;
  }

  // Add contents
  if (object.contents && Object.keys(object.contents).length > 0) {
    markdown += "## Contents\n\n";
    Object.entries(object.contents).forEach(([id, content]) => {
      markdown += `### Content ID: \`${id}\`\n\n`;
      markdown += formatContent(content);
      markdown += `Position: x=${content.x}, y=${content.y}, w=${content.w}, h=${content.h}\n\n`;
    });
  }

  // Add properties
  if (object.properties && Object.keys(object.properties).length > 0) {
    markdown += formatProperties(object.properties);
  }

  // Add export date if enabled
  if (includeExportDate) {
    markdown += `---\nExported on ${formatDate(new Date())}`;
  }

  return markdown;
};

export default objectToMarkdown;
