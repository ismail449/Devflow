"use client";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  codeMirrorPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  Separator,
  imagePlugin,
  codeBlockPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  CodeToggle,
  BlockTypeSelect,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

type Props = {
  value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
};

const Editor = ({ value, fieldChange, editorRef, ...props }: Props) => {
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border"
      onChange={fieldChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        thematicBreakPlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            sql: "SQL",
            ts: "TypeScript",
            html: "HTML",
            json: "JSON",
            xml: "XML",
            python: "Python",
            java: "Java",
            c: "C",
            cpp: "C++",
            csharp: "C#",
            go: "Go",
            ruby: "Ruby",
            php: "PHP",
            swift: "Swift",
            kotlin: "Kotlin",
            rust: "Rust",
            scala: "Scala",
            perl: "Perl",
            shell: "Shell",
            bash: "Bash",
            powershell: "PowerShell",
            yaml: "YAML",
            markdown: "Markdown",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarContents() {
            return (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />

                        <BoldItalicUnderlineToggles />
                        <Separator />

                        <ListsToggle />
                        <Separator />

                        <CreateLink />
                        <InsertImage />
                        <Separator />

                        <InsertTable />
                        <InsertThematicBreak />
                        <Separator />

                        <InsertCodeBlock />

                        <Separator />
                        <DiffSourceToggleWrapper>
                          Rich mode
                        </DiffSourceToggleWrapper>

                        <Separator />
                        <CodeToggle />

                        <Separator />
                        <BlockTypeSelect />
                      </>
                    ),
                  },
                ]}
              />
            );
          },
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
};

export default Editor;
