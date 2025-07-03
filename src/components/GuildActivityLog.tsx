import React, { useState, useEffect, useCallback } from 'react';
import { getGuildActivityLogs } from '../services/api';
import {
    Scroll,
    UserPlus,
    UserMinus,
    Award,
    Target,
    FileEdit,
    Upload,
    Coins,
    Calendar,
    ArrowUp,
    MessageSquare,
    Shield,
    RefreshCw
} from 'lucide-react';
import '../styles/GuildActivityLog.css';

interface ActivityLog {
    _id: string;
    guildId: string;
    userId?: string;
    activityType: string;
    description: string;
    metadata: any;
    questKey?: string;
    rating?: number;
    timestamp: Date;
}

interface GuildActivityLogProps {
    guildId: string;
    className?: string;
    refreshInterval?: number; // Time in milliseconds between auto-refreshes (default: 60000ms = 1 minute)
    updateTrigger?: number; // External trigger to refresh data
}

const GuildActivityLog: React.FC<GuildActivityLogProps> = ({
    guildId,
    className,
    refreshInterval = 60000,
    updateTrigger = 0
}) => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [totalActivities, setTotalActivities] = useState<number>(0);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

    const activityTypes = [
        { value: '', label: 'All Activities' },
        { value: 'guild_created', label: 'Guild Creation' },
        { value: 'member_joined', label: 'Member Joined' },
        { value: 'member_left', label: 'Member Left' },
        { value: 'member_kicked', label: 'Member Kicked' },
        { value: 'quest_completed', label: 'Quest Completed' },
        { value: 'quest_assigned', label: 'Quest Assigned' },
        { value: 'guild_level_up', label: 'Guild Level Up' },
        { value: 'daily_bonus', label: 'Daily Bonus' },
        { value: 'achievement_unlocked', label: 'Achievement' },
        { value: 'document_upload', label: 'Document Upload' },
        { value: 'custom', label: 'Other' }
    ];

    const fetchActivities = useCallback(async (pageNum = page, activityType = filter, refresh = false) => {
        if (refresh) {
            setIsRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const { data } = await getGuildActivityLogs(guildId, pageNum, 10, activityType);
            if (pageNum === 1) {
                setActivities(data.activities);
            } else {
                setActivities(prev => [...prev, ...data.activities]);
            }
            setTotalActivities(data.totalCount);
            setHasMore(data.activities.length === 10);
            setError(null);
            if (refresh) {
                setLastRefreshTime(new Date());
            }
        } catch (err) {
            setError('Failed to load guild activities');
            console.error('Failed to fetch activities:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [guildId, page, filter]);

    // Initial data fetch
    useEffect(() => {
        if (guildId) {
            setPage(1);
            fetchActivities(1, filter);
        }
    }, [guildId, filter, fetchActivities]);

    // Auto-refresh on interval
    useEffect(() => {
        if (!guildId || refreshInterval <= 0) return;

        const intervalId = setInterval(() => {
            fetchActivities(1, filter, true);
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [guildId, filter, refreshInterval, fetchActivities]);

    // External trigger for refresh (e.g. after actions that create new activities)
    useEffect(() => {
        if (updateTrigger > 0 && guildId) {
            fetchActivities(1, filter, true);
        }
    }, [updateTrigger, guildId, filter, fetchActivities]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchActivities(nextPage, filter);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilter(value || undefined);
    };

    const handleManualRefresh = () => {
        if (!isRefreshing) {
            setPage(1);
            fetchActivities(1, filter, true);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'guild_created':
                return <Shield className="activity-icon shield" />;
            case 'member_joined':
                return <UserPlus className="activity-icon user-plus" />;
            case 'member_left':
            case 'member_kicked':
                return <UserMinus className="activity-icon user-minus" />;
            case 'quest_completed':
                return <Target className="activity-icon target" />;
            case 'quest_assigned':
                return <Scroll className="activity-icon scroll" />;
            case 'guild_level_up':
                return <ArrowUp className="activity-icon level-up" />;
            case 'daily_bonus':
                return <Calendar className="activity-icon calendar" />;
            case 'achievement_unlocked':
                return <Award className="activity-icon award" />;
            case 'document_upload':
                return <Upload className="activity-icon upload" />;
            case 'document_edit':
                return <FileEdit className="activity-icon file-edit" />;
            case 'gold_transaction':
                return <Coins className="activity-icon coins" />;
            default:
                return <MessageSquare className="activity-icon message-square" />;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format time since last refresh
    const formatTimeSince = () => {
        const now = new Date();
        const diffMs = now.getTime() - lastRefreshTime.getTime();
        const diffSecs = Math.floor(diffMs / 1000);

        if (diffSecs < 60) return `${diffSecs}s ago`;
        if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
        return `${Math.floor(diffSecs / 3600)}h ago`;
    };

    return (
        <div className={`guild-activity-log ${className || ''}`}>
            <div className="activity-log-header">
                <h2>Guild Activity Log</h2>
                <div className="activity-filter">
                    <select onChange={handleFilterChange} value={filter || ''}>
                        {activityTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="activity-count">
                <span>{totalActivities} activities recorded</span>
                <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing || loading}
                    className="refresh-button"
                    title="Refresh activities"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="refresh-time">{formatTimeSince()}</span>
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="activity-list">
                {activities.length === 0 && !loading ? (
                    <div className="no-activities">No activities recorded yet</div>
                ) : (
                    activities.map(activity => (
                        <div key={activity._id} className="activity-item">
                            <div className="activity-icon-container">
                                {getActivityIcon(activity.activityType)}
                            </div>
                            <div className="activity-content">
                                <p className="activity-description">{activity.description}</p>
                                <span className="activity-timestamp">{formatDate(activity.timestamp)}</span>
                            </div>
                        </div>
                    ))
                )}

                {loading && <div className="loading-message">Loading...</div>}

                {hasMore && !loading && (
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuildActivityLog;
