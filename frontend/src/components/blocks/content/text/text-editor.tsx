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
} from "remirror/extensions";
import {
  ReactExtensions,
  ReactFrameworkOutput,
  Remirror,
  useHelpers,
  useRemirror,
} from "@remirror/react";
import "remirror/styles/all.css";
import "../../../../remirror.css";
import { forwardRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { ThemeProvider } from "@remirror/react";
import { Button } from "../../../ui/button";
import { cn } from "../../../../lib/utils";
// import { WysiwygEditor } from '@remirror/react-editors/wysiwyg';
const extensions = () => [
  new PlaceholderExtension({
    placeholder: "Type here...",
    // emptyNodeClass: "my-custom-placeholder",
  }),
  new BoldExtension({}),
  new ItalicExtension(),
  // new CalloutExtension({ defaultType: "warn" }), // Override defaultType: 'info'
  // new LinkExtension({ autoLink: true }),

  new StrikeExtension(),
  new ItalicExtension(),
  new HeadingExtension({}),
  new BlockquoteExtension(),
  new BulletListExtension({}),
  new OrderedListExtension(),
  // new ListItemExtension({
  //   priority: ExtensionPriority.High,
  //   enableCollapsible: true,
  // }),
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
  const { manager, state, setState } = useRemirror({
    extensions: extensions,
    content: content,
    stringHandler: "markdown",
  });
  const debouceFn = useCallback(
    debounce((newState: string) => {
      mutate(newState);
    }, 300),
    [mutate]
  );

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
              onChange={({ helpers, state }) => {
                const markdown = helpers.getMarkdown(state);
                debouceFn(markdown);
                setState(state);
              }}
              state={state}
            ></Remirror>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
});

export default TextEditor;
