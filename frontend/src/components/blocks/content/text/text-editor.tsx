import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  FontFamilyExtension,
  PositionerExtension,
  UnderlineExtension,
  CalloutExtension,
  LinkExtension,
  ListItemExtension,
} from "remirror/extensions";
import { MarkdownEditor } from "@remirror/react-editors/markdown";
import {
  ReactExtensions,
  ReactFrameworkOutput,
  Remirror,
  useHelpers,
  useRemirror,
} from "@remirror/react";
import "remirror/styles/all.css";
import "../../../../remirror.css";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import useDebounce from "../../../../lib/use-debounce";
import { ThemeProvider } from "@remirror/react";
import { cn } from "../../../../lib/utils";
import { marked } from "marked";
import { ExtensionPriority } from "remirror";
// import { WysiwygEditor } from '@remirror/react-editors/wysiwyg';
const extensions = () => [
  new PlaceholderExtension({
    placeholder: "Type here...",
    // emptyNodeClass: "my-custom-placeholder",
  }),
  new BoldExtension({}),
  new ItalicExtension(),
  new CalloutExtension({ defaultType: "warn" }), // Override defaultType: 'info'
  new LinkExtension({ autoLink: true }),

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
  new MarkdownExtension({}),
  new HardBreakExtension(),
  new FontFamilyExtension({}),
  new PositionerExtension({}),
  new UnderlineExtension(),
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
  | LinkExtension
  | ListItemExtension
  | CalloutExtension
>;
interface TextEditorProps {
  mutate: (newState: string) => void;
  content: string;
  defaultFont: string;
  freeDrag: boolean;
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-sm max-w-none p-4 border-l">
      <div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
    </div>
  );
}

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
    getContext()?.helpers?.getMarkdown() ?? content
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
            >
              {" "}
              <MarkdownEditor
                placeholder="Start typing..."
                initialContent={debouncedValue}
              />
            </Remirror>

            <MarkdownPreview markdown={value} />
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
});

export default TextEditor;
