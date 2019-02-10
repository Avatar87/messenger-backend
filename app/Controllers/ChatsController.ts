import Validator from "../../src/HttpServer/Validator";
import Joi from "../../src/Joi/Joi";
import { DB } from "../index";
import { IUser, IUserModel } from "../Models/User.d";
import { IUserChat, IUserChatModel } from "../Models/UserChat.d";
import UserChatCollectionResource from "../Resources/UserChatCollectionResource";
import UserChatResource from "../Resources/UserChatResource";

const UserChat = DB.getModel<IUserChat, IUserChatModel>("UserChat");
const User = DB.getModel<IUser, IUserModel>("User");

export default class UserChatController {

    public static async getChats(req: any, res: any, next: any) {
        try {
            const { offset } = Validator(req.query, { offset: Joi.number() });

            const chats = await UserChat.getChats(req.user);

           next(new UserChatCollectionResource(chats, { offset }));
        } catch (err) {
            next(err);
        }
    }

    public static async getChat(req: any, res: any, next: any) {
        try {
            const chat = await UserChat.findChatById(req.params.chatId);

            next(new UserChatResource(chat));
        } catch (err) {
            next(err);
        }
    }

    public static async getChatByuserGroupId(req: any, res: any, next: any) {
        try {
            const chat = await UserChat.findChatByUserGroupId(req.user, req.body.id);

            next(new UserChatResource(chat));
        } catch (err) {
            next(err);
        }
    }

    public static async addChat(req: any, res: any, next: any) {
        try {
            const chat = await UserChat.addChat(req.user, req.body.isGroup, req.body.id, req.user, req.body.preview);

            next(new UserChatResource(chat));
        } catch (err) {
            next(err);
        }
    }

    public static async updateChat(req: any, res: any, next: any) {
        try {
            const chat = await UserChat.updateChat(req.user, req.body.id, req.user, req.body.preview);

            next(new UserChatResource(chat));
        } catch (err) {
            next(err);
        }
    }

    public static async deleteChat(req: any, res: any, next: any) {
        try {
            await UserChat.deleteChatById(req.params.chatId);

            res.status(200).json({ message: "successfully" });
        } catch (err) {
            next(err);
        }
    }

}
