import type { GuildDataWithEnergy } from "../components/EnergySystem";

export const APP_NAME = "The Startup Quest";
export const APP_URL = window.location.origin;

interface GuildInviteEmailProps {
    guildName: string;
    founderName: string;
    ventureIdea: string;
    inviteLink: string;
}

export const generateGuildInviteEmail = (props: GuildInviteEmailProps) => {
    const { guildName, founderName, ventureIdea, inviteLink } = props;

    const subject = `You're Invited to Join ${guildName} on ${APP_NAME}!`;

    const body = `
Hello,

You have been invited by ${founderName} to join their guild, "${guildName}", on ${APP_NAME}!

Their venture, "${ventureIdea}", is just beginning, and they want you to be a part of their founding team.

Click the link below to accept your invitation and start your journey:
${inviteLink}

Welcome to the quest!

Best,
The ${APP_NAME} Team
    `;

    return { subject, body: encodeURIComponent(body.trim()) };
};

export const createInviteLink = (guildData: GuildDataWithEnergy, inviteToken: string): string => {
    const params = new URLSearchParams({
        invite: inviteToken,
        guildId: guildData.guildId,
        guildName: guildData.guildName,
        founderName: guildData.onboardingData?.name || 'the Founder',
        ventureIdea: guildData.vision,
        founderRole: guildData.onboardingData?.role || 'Founder',
        currentStage: 'Fundamentals',
        currentTask: 'Getting Started',
    });
    return `${APP_URL}?${params.toString()}`;
};

export const sendEmail = (to: string, subject: string, body: string) => {
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.open(mailtoLink, '_blank');
}; 