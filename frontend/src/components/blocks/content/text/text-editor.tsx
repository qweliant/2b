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
  CodeBlockExtension,
  ImageExtension,
} from "remirror/extensions";
import { CodeMirrorExtension } from "@remirror/extension-codemirror6";
import {
  ReactExtensions,
  ReactFrameworkOutput,
  Remirror,
  useRemirror,
} from "@remirror/react";
import "remirror/styles/all.css";
import "../../../../remirror.css";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import useDebounce from "../../../../lib/use-debounce";
import { ThemeProvider } from "@remirror/react";
import { cn } from "../../../../lib/utils";
import { EditorState, ExtensionPriority } from "remirror";

const extensions = () => [
  new PlaceholderExtension({
    placeholder: "Get me lit...",
    // emptyNodeClass: "my-custom-placeholder",
  }),
  new BoldExtension({}),
  new ItalicExtension(),
  new CalloutExtension({ defaultType: "warn" }), // Override defaultType: 'info'
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
  new CodeExtension({}),
  new MarkdownExtension({}),
  new HardBreakExtension(),
  new FontFamilyExtension({}),
  new PositionerExtension({}),
  new UnderlineExtension(),
  new ImageExtension({}),
  new LinkExtension({ autoLink: false }),
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
  | ListItemExtension
  | CalloutExtension
  | CodeBlockExtension
  | ImageExtension
  | CodeMirrorExtension
  | LinkExtension
>;
interface TextEditorProps {
  mutate: (newState: string) => void;
  content: string;
  defaultFont: string;
  freeDrag: boolean;
}

const TextEditor = forwardRef<
  ReactFrameworkOutput<Extensions>,
  TextEditorProps
>(({ mutate, content, defaultFont, freeDrag }, ref) => {
  const { manager, getContext, state, setState } = useRemirror({
    extensions: extensions,
    content: content,
    stringHandler: "markdown",
    builtin: {
      exitMarksOnArrowPress: false,
    },
  });

  const [markdown, setMarkdown] = useState<string>(
    getContext()?.helpers?.getMarkdown() ?? content
  );
  const debouncedMarkdown = useDebounce(markdown, 300);
  useEffect(() => {
    mutate(debouncedMarkdown);
  }, [debouncedMarkdown]);

  //@ts-expect-error - This is a hack to get the context
  useImperativeHandle(ref, () => getContext(), [getContext]);

  const handleEditorChange = ({ state }: { state: EditorState }) => {
    const newMarkdown = getContext()?.helpers?.getMarkdown(state) ?? "";
    console.log(newMarkdown);
    setMarkdown(newMarkdown);
    setState(state);
  };

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
              onChange={handleEditorChange}
              state={state}
            ></Remirror>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
});

export default TextEditor;
