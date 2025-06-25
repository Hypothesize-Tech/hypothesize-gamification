import { Castle, X } from "lucide-react";
import { GUILD_ROLES } from "../utils/constant";

export const GuildManagement = ({
    guildData,
    onClose,
}: {
    guildData: any;
    onClose: () => void;
}) => {
    const filledRoles = new Set(guildData.members?.map((m: any) => m.role) || []);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="parchment rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Castle className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold">Guild Hall</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-yellow-100">Guild Positions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(GUILD_ROLES).map(([key, role]) => {
                                const member = guildData.members?.find((m: any) => m.role === key);

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
                                            <p className="text-sm text-gray-400 mt-2">Seeking Worthy Soul</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {filledRoles.size >= 6 && (
                            <div className="mt-4 parchment p-3 magic-border">
                                <p className="text-green-400 font-medium">⚔️ Full Guild Assembled! +30% XP on all quests</p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-yellow-100">Current Members</h3>
                        <div className="space-y-2">
                            {guildData.members?.map((member: any) => (
                                <div key={member.uid} className="parchment p-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-yellow-100">{member.name}</p>
                                        <p className="text-sm text-gray-300">{member.email}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">{GUILD_ROLES[member.role as keyof typeof GUILD_ROLES]?.icon}</span>
                                        <span className="text-sm text-gray-300">
                                            {GUILD_ROLES[member.role as keyof typeof GUILD_ROLES]?.name || 'Guild Member'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};