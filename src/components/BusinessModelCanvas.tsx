import React from 'react';

interface CanvasData {
    keyPartners: string;
    keyActivities: string;
    valuePropositions: string;
    customerRelationships: string;
    customerSegments: string;
    keyResources: string;
    channels: string;
    costStructure: string;
    revenueStreams: string;
}

interface BusinessModelCanvasProps {
    data: CanvasData;
}


/**
 * A component that renders Business Model Canvas data as formatted markdown.
 * It takes a data object and converts each section into a heading with a bulleted list.
 */
const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({ data }) => {

    return (
        <div className="prose prose-sm old-paper-text p-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Key Partners</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.keyPartners.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Key Activities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.keyActivities.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Value Propositions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.valuePropositions.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Customer Relationships</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.customerRelationships.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Customer Segments</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.customerSegments.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Key Resources</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.keyResources.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Channels</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.channels.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Cost Structure</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {data.costStructure.split(',').map((item, i) => (
                                    <li key={i}>{item.trim()}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-amber-50/30 p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg border-b border-amber-800/30 pb-2 mb-3">Revenue Streams</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {data.revenueStreams.split(',').map((item, i) => (
                                    <li key={i}>{item.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessModelCanvas;
