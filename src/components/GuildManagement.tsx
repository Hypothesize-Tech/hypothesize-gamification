import { Castle, X, Send } from "lucide-react";
import { CORE_ROLES, PERMISSION_ROLES } from "../utils/constant";
import { useState } from "react";
import { createInviteLink, generateGuildInviteEmail, sendEmail } from "../utils/email";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/config";
import { v4 as uuidv4 } from 'uuid';

export const GuildManagement = ({
    guildData,
    onClose,
    setGuildData
}: {
    guildData: any;
    onClose: () => void;
    setGuildData: (data: any) => void;
}) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    const members = guildData?.members ?? [];
    const isFounder = guildData?.isFounder ?? false;
    const filledRoles = new Set(members.map((m: any) => m.role));
    console.log("members", members)
    const handleRoleChange = async (memberUid: string, newRole: string) => {
        if (!guildData || !isFounder) {
            alert("Only the Guild Leader can change roles.");
            return;
        }

        const updatedMembers = members.map((m: any) => {
            if (m.uid === memberUid) {
                return { ...m, permissionRole: newRole };
            }
            return m;
        });

        try {
            const guildRef = doc(db, 'guilds', guildData.guildId);
            await updateDoc(guildRef, { members: updatedMembers });
            setGuildData({ ...guildData, members: updatedMembers });
            alert("Member role updated successfully.");
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update member role.");
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail || !guildData || !isFounder) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsInviting(true);
        try {
            const inviteToken = uuidv4();
            const inviteLink = createInviteLink(guildData, inviteToken);
            const { subject, body } = generateGuildInviteEmail({
                guildName: guildData.guildName,
                founderName: guildData.onboardingData?.name || 'the Founder',
                ventureIdea: guildData.vision,
                inviteLink,
            });

            // Add invite to Firestore
            const guildRef = doc(db, 'guilds', guildData.guildId);
            await updateDoc(guildRef, {
                invitesSent: arrayUnion({ email: inviteEmail, token: inviteToken, status: 'pending', sentAt: new Date().toISOString() })
            });

            sendEmail(inviteEmail, subject, body);
            alert(`Invitation sent to ${inviteEmail}!`);
            setInviteEmail('');
        } catch (error) {
            console.error("Error sending invite:", error);
            alert("Failed to send invitation. Please try again.");
        }
        setIsInviting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="parchment rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Castle className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold">Guild Management</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-yellow-100">Core Roles</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(CORE_ROLES).map(([key, role]) => {
                                const member = members.find((m: any) => m.role === key);

                                return (
                                    <div
                                        key={key}
                                        className={`parchment p-4 ${member ? 'magic-border' : 'opacity-50'}`}
                                    >
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-2xl">{role.icon}</span>
                                            <div>
                                                <p className="font-bold text-yellow-100">{role.name}</p>
                                                <p className="text-xs text-gray-300">{role.description}</p>
                                            </div>
                                        </div>
                                        {member ? (
                                            <div className="mt-2">
                                                <p className="text-sm text-green-400">{member.name}</p>
                                                <p className="text-xs text-gray-400">{member.email}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 mt-2">Position Open</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {guildData && filledRoles.size >= 6 && (
                            <div className="mt-4 parchment p-3 magic-border">
                                <p className="text-green-400 font-medium">All core roles filled! +30% XP on all quests</p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-yellow-100">Current Members</h3>
                        <div className="space-y-3">
                            {members.map((member: any) => {
                                // member: { user: { _id, name, picture }, role, _id, ... }
                                const coreRole = CORE_ROLES[member.role as keyof typeof CORE_ROLES];
                                const permissionRole = PERMISSION_ROLES[member.permissionRole as keyof typeof PERMISSION_ROLES];
                                const isFounderMember = member.user?._id === guildData?.founderId;

                                return (
                                    <div key={member._id} className="parchment p-3 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {member.user?.picture && (
                                                <img
                                                    src={member.user.picture}
                                                    alt={member.user.name}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-yellow-100">{member.user?.name || "Unknown"}</p>
                                                <p className="text-sm text-gray-300">{member.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {coreRole && (
                                                <div className="flex items-center space-x-2" title={`Core Role: ${coreRole.name}`}>
                                                    <span className="text-xl">{coreRole.icon}</span>
                                                    <span className="text-sm text-gray-300">{coreRole.name}</span>
                                                </div>
                                            )}
                                            {permissionRole && (
                                                <div className="flex items-center space-x-2">
                                                    {isFounderMember ? (
                                                        <div className="flex items-center space-x-2" title={`Permission Role: ${permissionRole.name}`}>
                                                            <span className="text-xl">{permissionRole.icon}</span>
                                                            <span className="text-sm text-gray-300">{permissionRole.name}</span>
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={member.permissionRole}
                                                            onChange={(e) => handleRoleChange(member.user._id, e.target.value)}
                                                            disabled={!isFounder}
                                                            className="bg-gray-700/50 text-white p-1 rounded-md text-sm cursor-pointer disabled:cursor-not-allowed"
                                                            title={`Permission Role: ${permissionRole?.name || ''}`}
                                                        >
                                                            <option value="knight">{PERMISSION_ROLES.knight.name}</option>
                                                            <option value="scout">{PERMISSION_ROLES.scout.name}</option>
                                                        </select>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {isFounder && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 text-yellow-100">Invite New Members</h3>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="Enter email to invite"
                                    className="flex-1 p-3 bg-gray-700 rounded-lg text-white"
                                    disabled={!guildData}
                                />
                                <button
                                    onClick={handleInvite}
                                    disabled={isInviting || !guildData}
                                    className="px-4 py-3 bg-purple-800 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {isInviting ? 'Sending...' : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};