import {Model, Mongoose, Schema} from "mongoose";
import {IGroup} from "./Group.d";
import {IGroupMember, IGroupMemberModel} from "./GroupMember.d";
import {IUser} from "./User.d";

let GroupMember: IGroupMemberModel;

const GroupSchema = new Schema({
    creator: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    description: {type: String, default: null, trim: true},
    invitingCode: {type: String, default: null},
    }, {
    timestamps: {createdAt: "created_at", updatedAt: false},
});

GroupSchema.method("isCreator", function(user: string | IUser) {
    if (typeof user !== "string") user = user._id.toString();

    return this.creator === user;
});

GroupSchema.method("isMember", async function(user: string | IUser) {
    return await GroupMember.isMember(this, user);
});

GroupSchema.method("addMember", async function(user: string | IUser) {
    return await GroupMember.addMemberTo(this, user);
});

GroupSchema.method("deleteMember", async function(member: string | IUser) {
    return await GroupMember.deleteMemberFrom(this, member);
});

GroupSchema.method("getMembers", async function(offset?: number, limit?: number) {
    return await GroupMember.getMembersFor(this, offset, limit);
});

GroupSchema.static("getGroup", async function(id: string) {
    return await this.findById(id);
});

GroupSchema.static("addGroup", async function(user: IUser, name: string, description?: string) {
    return await this.create({name, description, creator: user._id});
});

GroupSchema.method("updateGroup", function(name?: string, description?: string) {
    this.name = name || this.name;
    this.description = description || this.description;
    return;
});

export default function(mongoose: Mongoose) {
    this.on("registeredAllModels", () => GroupMember = this.getModel("GroupMember"));
    return mongoose.model("Group", GroupSchema);
}
