import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  CalloutExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  FontFamilyExtension,
  PositionerExtension,
  UnderlineExtension,
  CodeBlockExtension,
  DocExtension,
} from "remirror/extensions";
import {
  ReactExtensions,
  ReactFrameworkOutput,
  Remirror,
  useHelpers,
  useRemirror,
  UseRemirrorReturn,
} from "@remirror/react";
import { ExtensionPriority, getThemeVar } from "remirror";
import "remirror/styles/all.css";
import "../../../../remirror.css";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import useDebounce from "../../../../lib/use-debounce";
import { ThemeProvider } from "@remirror/react";
import { cn } from "../../../../lib/utils";
import { MarkdownEditor } from "@remirror/react-editors/markdown";
import { MarkdownToolbar } from "@remirror/react-ui";
import typescript from "refractor/lang/typescript.js";
import { createContextState } from "create-context-state";

const extensions = () => [
  new PlaceholderExtension({
    placeholder: "Type here...",
  }),
  new BoldExtension({}),
  new ItalicExtension(),
  new LinkExtension({ autoLink: true }),
  new MarkdownExtension({ copyAsMarkdown: true }),
  // new CodeBlockExtension({ supportedLanguages: [] }),
  new StrikeExtension(),
  new ItalicExtension(),
  new HeadingExtension({}),
  new BlockquoteExtension(),
  new BulletListExtension({}),
  new OrderedListExtension(),
  new ListItemExtension({
    priority: ExtensionPriority.High,
    enableCollapsible: true,
  }),
  new CodeExtension(),
  new HardBreakExtension(),
  new FontFamilyExtension({}),
  new PositionerExtension({}),
  new UnderlineExtension(),
  new DocExtension({ content: "codeBlock" }),
  new CodeBlockExtension({
    supportedLanguages: [typescript],
    defaultLanguage: "markdown",
    syntaxTheme: "base16_ateliersulphurpool_light",
    defaultWrap: true,
  }),
];

export type Extensions = ReactExtensions<
  | PlaceholderExtension
  | BoldExtension
  | ItalicExtension
  | StrikeExtension
  | HeadingExtension
  | BlockquoteExtension
  | BulletListExtension
  | OrderedListExtension
  | CodeExtension
  | HardBreakExtension
  | FontFamilyExtension
  | PositionerExtension
  | UnderlineExtension
  | MarkdownExtension
  | CodeBlockExtension
  | LinkExtension
>;
interface TextEditorProps {
  mutate: (newState: string) => void;
  content: string;
  defaultFont: string;
  freeDrag: boolean;
}

function MarkdownPreview() {
  const { getMarkdown } = useHelpers(true);

  return (
    <pre>
      <code>{getMarkdown()}</code>
    </pre>
  );
}

export const Basic: React.FC = () => (
  <MarkdownEditor placeholder="Start typing..." initialContent={basicContent}>
    <MarkdownPreview />
  </MarkdownEditor>
);

interface Props {
  visual: UseRemirrorReturn<
    ReactExtensions<ReturnType<typeof extensions>[number]>
  >;
  markdown: UseRemirrorReturn<
    ReactExtensions<DocExtension | CodeBlockExtension>
  >;
}
interface Context extends Props {
  setMarkdown: (markdown: string) => void;
  setVisual: (markdown: string) => void;
}

const [DualEditorProvider, useDualEditor] = createContextState<Context, Props>(
  ({ props }) => ({
    ...props,

    setMarkdown: (text: string) =>
      props.markdown.getContext()?.setContent({
        type: "doc",
        content: [
          {
            type: "codeBlock",
            attrs: { language: "markdown" },
            content: text ? [{ type: "text", text }] : undefined,
          },
        ],
      }),
    setVisual: (markdown: string) =>
      props.visual.getContext()?.setContent(markdown),
  })
);

const VisualEditor = () => {
  const { visual, setMarkdown } = useDualEditor();

  return (
    <Remirror
      autoFocus
      manager={visual.manager}
      autoRender="end"
      onChange={({ helpers, state }) => setMarkdown(helpers.getMarkdown(state))}
      initialContent={visual.state}
      // classNames={[
      //   css`
      //     &.ProseMirror {
      //       p,
      //       h3,
      //       h4 {
      //         margin-top: ${getThemeVar("space", 2)};
      //         margin-bottom: ${getThemeVar("space", 2)};
      //       }

      //       h1,
      //       h2 {
      //         margin-bottom: ${getThemeVar("space", 3)};
      //         margin-top: ${getThemeVar("space", 3)};
      //       }
      //     }
      //   `,
      // ]}
    >
      <MarkdownToolbar />
    </Remirror>
  );
};
const MarkdownTextEditor = () => {
  const { markdown, setVisual } = useDualEditor();

  return (
    <Remirror
      manager={markdown.manager}
      autoRender="end"
      onChange={({ helpers, state }) => {
        const text = helpers.getText({ state });
        return setVisual(text);
      }}
      // classNames={[
      //   css`
      //     &.ProseMirror {
      //       padding: 0;

      //       pre {
      //         height: 100%;
      //         padding: ${getThemeVar("space", 3)};
      //         margin: 0;
      //       }
      //     }
      //   `,
      // ]}
    >
      {/* <Toolbar items={toolbarItems} refocusEditor label='Top Toolbar' /> */}
    </Remirror>
  );
};

export const DualEditor: React.FC = () => {
  const visual = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: "**Markdown** content is the _best_",
  });
  const markdown = useRemirror({
    extensions: () => [
      new DocExtension({ content: "codeBlock" }),
      new CodeBlockExtension({
        supportedLanguages: [typescript],
        defaultLanguage: "markdown",
        syntaxTheme: "base16_ateliersulphurpool_light",
        defaultWrap: true,
      }),
    ],
    builtin: {
      exitMarksOnArrowPress: false,
    },

    stringHandler: "html",
  });

  return (
    <DualEditorProvider visual={visual} markdown={markdown}>
      <ThemeProvider>
        <VisualEditor />
        <MarkdownTextEditor />
      </ThemeProvider>
    </DualEditorProvider>
  );
};

const TextEditor = forwardRef<
  ReactFrameworkOutput<Extensions>,
  TextEditorProps
>(({ mutate, content, defaultFont, freeDrag }, ref) => {
  const { manager, getContext, state, setState } = useRemirror({
    extensions: extensions,
    content: content,
    stringHandler: "markdown",
  });
  const [value, setValue] = useState<string>(
    getContext()?.helpers?.getMarkdown() ?? ""
  );
  const debouncedValue = useDebounce(value, 300);
  useEffect(() => {
    mutate(debouncedValue);
  }, [debouncedValue]);

  //@ts-expect-error - This is a hack to get the context
  useImperativeHandle(ref, () => getContext(), [getContext]);

  return (
    <div
      className={cn(
        "h-full rounded-lg bg-background border border-transparent ",
        freeDrag && "border-border/80 hover:border-border"
      )}
    >
      <div className="h-full overflow-y-scroll">
        <div className="remirror-theme cursor-text">
          <ThemeProvider
            theme={{
              fontFamily: {
                default: defaultFont,
              },
            }}
          >
            <Remirror
              manager={manager}
              onChange={({ state }) => {
                const markdown = getContext()?.helpers?.getMarkdown();
                setValue(markdown ?? "");
                setState(state);
              }}
              state={state}
            ></Remirror>
            <Basic />
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
});

export default TextEditor;

const basicContent = `
**Markdown** content is the _best_

<br>

# Heading 1

<br>

## Heading 2

<br>

### Heading 3

<br>

#### Heading 4

<br>

##### Heading 5

<br>

###### Heading 6

<br>

> Blockquote

\`\`\`ts
const a = 'asdf';
\`\`\`

playtime is just beginning

## List support

- an unordered
  - list is a thing
    - of beauty

1. As is
2. An ordered
3. List
`;
