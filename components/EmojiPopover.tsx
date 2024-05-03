import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { MdEmojiEmotions } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmojiArray } from "@/constant/emoji";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { sendSnapMessage } from "@/actions";

export function EmojiPopover() {
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const id = params.id;
  
  const handleSendEmoji = async (srcUrl: string) => {
    setLoading(true);
    try {
      const blob = await fetch(srcUrl).then((res) => res.blob());
      const dataUrl = await readFileAsDataURL(blob);
      await sendSnapMessage(dataUrl, id, "image");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"icon"} className="rounded-full">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MdEmojiEmotions size="24px" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex gap-4 flex-wrap items-center">
            {EmojiArray.map((emoji, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => handleSendEmoji(emoji.src)}
                  className="cursor-pointer scale-90 hover:scale-110 transition-transform duration-100"
                >
                  <Image
                    className="mix-blend-multiply"
                    src={emoji.src}
                    alt={emoji.alt}
                    width={35}
                    height={35}
                  />
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
