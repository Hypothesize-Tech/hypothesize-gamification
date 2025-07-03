import { Castle, X, Send, AlertTriangle } from "lucide-react";
import { CORE_ROLES, PERMISSION_ROLES } from "../utils/constant";
import { useState } from "react";
// Remove direct email imports, use API instead
import { createInviteLink } from "../utils/email";
import { db } from "../config/config";
import { v4 as uuidv4 } from 'uuid';
import { leaveGuild, kickMember, sendGuildInviteEmail } from "../services/api";

// Import background images for roles
import ceoBg from '../assets/wallpaper_1.png';
import ctoBg from '../assets/wallpaper_3.png';
import paperBg from '../assets/wallpaper_2.jpg';
import cfoBg from '../assets/wallpaper_4.png';
import cooBg from '../assets/wallpaper_5.png';
import cmoBg from '../assets/wallpaper_6.png';
import croBg from '../assets/wallpaper_7.png';

const roleBackgrounds: { [key: string]: string } = {
    ceo: ceoBg,
    cto: ctoBg,
    cfo: cfoBg,
    coo: cooBg,
    cmo: cmoBg,
    cro: croBg,
};

export const GuildManagement = ({
    guildData,
    onClose,
    setGuildData,
    onResetGuild,
    showModal,
}: {
    guildData: any;
    onClose: () => void;
    setGuildData: (data: any) => void;
    onResetGuild: () => Promise<void>;
    showModal: (title: string, message: string) => void;
}) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
    const [showKickConfirmation, setShowKickConfirmation] = useState(false);
    const [memberToKick, setMemberToKick] = useState<any>(null);

    const members = guildData?.members ?? [];
    const isFounder = guildData?.isFounder ?? false;
    const filledRoles = new Set(members.map((m: any) => m.role));

    const handleRoleChange = async (memberUid: string, newRole: string) => {
        if (!guildData || !isFounder) {
            showModal("Permission Denied", "Only the Guild Leader can change roles.");
            return;
        }

        const updatedMembers = members.map((m: any) => {
            if (m.uid === memberUid) {
                return { ...m, permissionRole: newRole };
            }
            return m;
        });

        try {
            setGuildData({ ...guildData, members: updatedMembers });
            showModal("Success", "Member role updated successfully.");
        } catch (error) {
            console.error("Error updating role:", error);
            showModal("Error", "Failed to update member role.");
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) {
            showModal("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (!guildData) {
            showModal("Error", "Guild data is missing. Please refresh the page and try again.");
            return;
        }

        if (!isFounder) {
            showModal("Permission Denied", "Only the Guild Leader can send invites.");
            return;
        }

        setIsInviting(true);
        try {
            const inviteToken = uuidv4();
            const inviteLink = createInviteLink(guildData, inviteToken);


            // Send email through backend API instead of directly
            await sendGuildInviteEmail(
                inviteEmail,
                guildData.guildName || "Guild",
                guildData.onboardingData?.name || 'the Founder',
                guildData.vision || "Our venture",
                inviteLink
            );

            showModal("Invite Sent", `Invitation sent to ${inviteEmail}!`);
            setInviteEmail('');
        } catch (error) {
            console.error("Error sending invite:", error);
            showModal("Error", "Failed to send invitation. Please try again.");
        } finally {
            setIsInviting(false);
        }
    };

    const handleResetGuild = async () => {
        try {
            await onResetGuild();
            setShowResetConfirmation(false);
            showModal('Success', 'Guild has been reset successfully.');
            onClose();
        } catch (error) {
            console.error("Error resetting guild:", error);
            showModal('Error', "Failed to reset guild. Please try again.");
        }
    };

    const handleLeaveGuild = async () => {
        try {
            await leaveGuild();
            setShowLeaveConfirmation(false);
            showModal('Success', 'You have successfully left the guild.');
            onClose();
            window.location.reload(); // Refresh to update guild state
        } catch (error) {
            console.error("Error leaving guild:", error);
            showModal('Error', "Failed to leave guild. Please try again.");
        }
    };

    const handleKickMember = async () => {
        if (!memberToKick) return;

        try {
            const updatedGuild = await kickMember(memberToKick.user._id);
            setGuildData(updatedGuild.data);
            setShowKickConfirmation(false);
            setMemberToKick(null);
            showModal('Success', `${memberToKick.user.name} has been kicked from the guild.`);
        } catch (error: any) {
            console.error("Error kicking member:", error);
            const errorMessage = error.response?.data?.message || "Failed to kick member. Please try again.";
            showModal('Error', errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
            <div className="parchment rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{
                backgroundImage: `url(${paperBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.8,
            }}>
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
                                const background = roleBackgrounds[key];

                                return (
                                    <div
                                        key={key}
                                        className={`relative rounded-lg overflow-hidden p-4 flex flex-col justify-between h-40 ${member ? 'magic-border' : 'opacity-70'}`}
                                        style={{
                                            backgroundImage: `url(${background})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black/60"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-2xl">{role.icon}</span>
                                                <div>
                                                    <p className="font-bold text-yellow-100">{role.name}</p>
                                                    <p className="text-xs text-gray-300">{role.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 mt-auto">
                                            {member ? (
                                                <div>
                                                    <p className="text-sm text-green-400 font-semibold">{member.name}</p>
                                                    <p className="text-xs text-gray-400">{member.email}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-400 font-semibold">Position Open</p>
                                                    <p className="text-xs text-gray-500 italic">Invite a member to fill this role</p>
                                                </div>
                                            )}
                                        </div>
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
                                const isFounderMember = member.user?._id === guildData?.founder;

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
                                            {isFounder && member.user?._id !== guildData?.founder && (
                                                <button
                                                    onClick={() => {
                                                        setMemberToKick(member);
                                                        setShowKickConfirmation(true);
                                                    }}
                                                    className="px-3 py-1 bg-red-800 rounded-lg hover:bg-red-700 text-white text-xs font-bold"
                                                >
                                                    Kick
                                                </button>
                                            )}
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
                    {isFounder && (
                        <div className="mt-8 pt-4 border-t border-red-500/30">
                            <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center"><AlertTriangle className="mr-2" /> Danger Zone</h3>
                            <div className="parchment p-4 bg-red-900/20">
                                <p className="text-red-300 mb-2">Resetting the guild will permanently delete all progress, levels, gold, and achievements. Members will be kept. This action cannot be undone.</p>
                                <button
                                    onClick={() => setShowResetConfirmation(true)}
                                    className="px-4 py-2 bg-red-800 rounded-lg hover:bg-red-700 text-white font-bold"
                                >
                                    Reset Guild
                                </button>
                            </div>
                        </div>
                    )}
                    {!isFounder && (
                        <div className="mt-8 pt-4 border-t border-red-500/30">
                            <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center"><AlertTriangle className="mr-2" /> Danger Zone</h3>
                            <div className="parchment p-4 bg-red-900/20">
                                <p className="text-red-300 mb-2">Leaving the guild is a permanent action. You will lose your role and access to its resources.</p>
                                <button
                                    onClick={() => setShowLeaveConfirmation(true)}
                                    className="px-4 py-2 bg-red-800 rounded-lg hover:bg-red-700 text-white font-bold"
                                >
                                    Leave Guild
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showLeaveConfirmation && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="parchment p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Are you sure?</h3>
                        <p className="text-gray-300 mb-6">You are about to leave the guild. This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowLeaveConfirmation(false)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancel</button>
                            <button onClick={handleLeaveGuild} className="px-4 py-2 bg-red-800 rounded-lg hover:bg-red-700">Confirm Leave</button>
                        </div>
                    </div>
                </div>
            )}
            {showKickConfirmation && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="parchment p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Kick Member?</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to kick {memberToKick?.user?.name}? This will cost 5 gold and cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowKickConfirmation(false)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancel</button>
                            <button onClick={handleKickMember} className="px-4 py-2 bg-red-800 rounded-lg hover:bg-red-700">Confirm Kick</button>
                        </div>
                    </div>
                </div>
            )}
            {showResetConfirmation && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="parchment p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Reset Guild?</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to reset the guild? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowResetConfirmation(false)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancel</button>
                            <button onClick={handleResetGuild} className="px-4 py-2 bg-red-800 rounded-lg hover:bg-red-700">Confirm Reset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};