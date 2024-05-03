import connectDB from "@/db";
import { Message, MessageDocument } from "@/db/models/message.model";
import { User, UserDocument } from "@/db/models/user.model";
import { Chat } from "@/db/models/chat.model";

export const getUserProfile = async (userId: string) => {
  try {
    await connectDB();
    const user: UserDocument | null = await User.findOne({ _id: userId });
    if (!user) {
      return "User not found";
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSidebarUsers = async (authUserId: string) => {
  try {
    const otherUsers: UserDocument[] = await User.find({
      _id: { $ne: authUserId },
    });
    const userInfo = await Promise.all(
      otherUsers.map(async (user) => {
        const lastMessage: MessageDocument | null = await Message.findOne({
          $or: [
            { senderId: user._id, receiverId: authUserId },
            { senderId: authUserId, receiverId: user._id },
          ],
        })
          .sort({ createdAt: -1 })
          .populate("senderId", "fullname avatar _id")
          .populate("receiverId", "fullname, avatar, _id")
          .exec();

        return {
          _id: user._id,
          participants: [user],
          lastMessage: lastMessage
            ? {
                ...lastMessage.toJSON(),
                senderId: lastMessage.senderId,
                receiverId: lastMessage.receiverId,
              }
            : null,
        };
      })
    );
    return userInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMessages = async (
  loggedInUserId: string,
  otherUserId: string
) => {
  try {
    await connectDB();
    const chatMessage = await Chat.findOne({
      participants: { $all: [loggedInUserId, otherUserId] },
    }).populate({
      path: "messages",
      populate: {
        path: "senderId",
        model: "User",
        select: "fullname",
      },
    });
    if (!chatMessage) return [];
    return JSON.parse(JSON.stringify(chatMessage.messages));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
