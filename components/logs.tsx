'use client'

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createHighlighter } from "shiki";

export default function Logs() {
  const [tokens, setTokens] = useState<string>('')




  useEffect(() => {

    async function getCodeTokens() {

      const highlighter = await createHighlighter({
        themes: ['vitesse-dark'],
        langs: ['javascript'],
      })

      const code = highlighter.codeToHtml('const a = 1', {
        theme: 'vitesse-dark',
        lang: 'javascript',
      })

      setTokens(code)
    }
    getCodeTokens()
  }, [])



  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="aspect-video flex flex-col h-auto  items-center justify-start py-6 rounded-xl bg-muted/50">

            <div className="flex flex-col gap-4 px-4 w-full h-auto rounded-lg">
              <div className="flex w-full items-start justify-start flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <Badge className="text-xs" variant={'secondary'}>SNIPPET</Badge>

                  <div className="items-end">
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>


                <h3 className="text-[2.7rem] font-regular">Title</h3>

              </div>

              <div className="flex items-start flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>

                <div
                  className="flex items-start justify-start gap-2 w-full overflow-x-hidden [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: tokens }}
                />
              </div>
            </div>
          </div>




          {/**ITEM 2 */}
          <div className="aspect-video flex flex-col h-auto items-center justify-start py-6 rounded-xl bg-muted/50">

            <div className="flex flex-col gap-4 px-4 w-full h-auto rounded-lg">
              <div className="flex w-full items-start justify-start flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <Badge className="text-xs" variant={'secondary'}>SNIPPET</Badge>

                  <div className="items-end">
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>


                <h3 className="text-[2.7rem] font-regular">Title</h3>

              </div>

              <div className="flex items-start flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>

                <div
                  className="flex items-start justify-start gap-2 w-full overflow-x-hidden [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: tokens }}
                />
              </div>
            </div>
          </div>




          {/**ITEM 3 */}

          <div className="aspect-video flex flex-col h-auto items-center justify-start py-6 rounded-xl bg-muted/50">

            <div className="flex flex-col gap-4 px-4 w-full h-auto rounded-lg">
              <div className="flex w-full items-start justify-start flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <Badge className="text-xs" variant={'secondary'}>SNIPPET</Badge>

                  <div className="items-end">
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>


                <h3 className="text-[2.7rem] font-regular">Title</h3>

              </div>

              <div className="flex items-start flex-col justify-center gap-2">
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>

                <div
                  className="flex items-start justify-start gap-2 w-full overflow-x-hidden [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: tokens }}
                />
              </div>
            </div>
          </div>



        </div>

      </div>
    </div>
  )

}