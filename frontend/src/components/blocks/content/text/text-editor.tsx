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
} from "remirror/extensions";
import {
  ReactExtensions,
  ReactFrameworkOutput,
  Remirror,
  useHelpers,
  useRemirror,
} from "@remirror/react";
import { ExtensionPriority, htmlToProsemirrorNode } from "remirror";
import "remirror/styles/all.css";
import "../../../../remirror.css";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ObjectInstance } from "../../../../store/objectsStore";
import debounce from "lodash/debounce";
import { prosemirrorNodeToHtml } from "remirror";
import useDebounce from "../../../../lib/use-debounce";
import { ThemeProvider } from "@remirror/react";
import { Button } from "../../../ui/button";
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
}

const TextEditor = forwardRef<
  ReactFrameworkOutput<Extensions>,
  TextEditorProps
>(({ mutate, content, defaultFont }, ref) => {
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
    <div className="h-full rounded-md hover:border-border bg-background border border-transparent ">
      <div className="h-full overflow-y-scroll">
        <div className="remirror-theme cursor-text overflow-y-scroll">
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
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
});

export default TextEditor;
