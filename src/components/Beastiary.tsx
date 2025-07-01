import React from 'react';
import { FANTASY_BEASTS } from '../config/beasts';
import { BeastChallenge } from './BeastChallenge';
import { BookOpen } from 'lucide-react';

export const Beastiary: React.FC = () => {
    // In the future, this could come from state or props,
    // including the status of each beast.
    const beasts = FANTASY_BEASTS;

    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-900/40">
            <div className="flex items-center gap-4 mb-8">
                <BookOpen className="w-10 h-10 text-yellow-400" />
                <div>
                    <h1 className="text-4xl font-bold text-yellow-100 medieval-font">The Beastiary</h1>
                    <p className="text-yellow-200">A catalog of the challenges that lie ahead.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {beasts.map(beast => (
                    <BeastChallenge key={beast.id} beast={beast} />
                ))}
            </div>
        </div>
    );
}; 