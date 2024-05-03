import React from "react";
import Link from "next/link";

import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { IoSend, IoSendOutline } from "react-icons/io5";

import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDate } from "@/lib/utils";

const Friend = ({ user }: { user: any }) => {
  const lastMessage = user.lastMessage;
  const lastMessageType = lastMessage?.messageType;
  const formattedDate = lastMessage
    ? formatDate(lastMessage?.createdAt)
    : formatDate(new Date());
  const amISender =
    lastMessage && lastMessage?.senderId?._id !== user.participants[0]._id;
  const isMessageSeen = lastMessage?.seen;
  let messageStatus: string;
  let icon: JSX.Element;

  if (amISender) {
    messageStatus = isMessageSeen ? "Seen" : "Sent";
    icon =
      lastMessageType === "text" ? (
        isMessageSeen ? (
          <IoSend size={"16px"} className="text-[#00b4d8]" />
        ) : (
          <IoSendOutline size={"16px"} className="text-[#00b4d8]" />
        )
      ) : isMessageSeen ? (
        <RiCheckboxBlankFill size={"16px"} className="text-red-500" />
      ) : (
        <MdCheckBoxOutlineBlank size={"16px"} className="text-red-500" />
      );
  } else {
    if (!lastMessage) {
      icon = <RiCheckboxBlankFill />;
      messageStatus = "New Snap";
    } else {
      messageStatus = isMessageSeen ? "Received" : "Show Message";
      icon =
        lastMessageType === "text" ? (
          !isMessageSeen ? (
            <RiCheckboxBlankFill />
          ) : (
            <MdCheckBoxOutlineBlank />
          )
        ) : !isMessageSeen ? (
          <RiCheckboxBlankFill />
        ) : (
          <MdCheckBoxOutlineBlank />
        );
    }
  }

  return (
    <Link
      href={`/chat/${user._id}`}
      className="flex justify-between items-center border-b-2 cursor-pointer border-[#E3E6E8] hover:bg-[#E3E6E8] p-3 rounded-sm my-2"
    >
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={user.participants[0].profilePhoto} alt="@shadcn" />
        </Avatar>
        <div>
          <h1 className="font-medium">{user.participants[0].fullname}</h1>
          <p
            className={`${
              messageStatus === "New Snap" ? "text-purple-600" : null
            } flex gap-1 text-xs font-bold text-gray-500`}
          >
            <span
              className={`${messageStatus === "New Snap" ? "hidden" : null}`}
            >
              {icon}
            </span>
            {messageStatus === "New Snap" ? (
              <span className="font-bold">{messageStatus} 🔥</span>
            ) : (
              <span>
                {messageStatus} - {formattedDate}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Friend;
