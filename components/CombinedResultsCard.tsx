import React from 'react';
import { CombinedDetails } from '../types';

interface CombinedResultsCardProps {
  details: CombinedDetails;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="py-3 border-b border-slate-700/50 break-words">
    <p className="text-sm text-slate-400">{label.replace(/[\u{1F600}-\u{1F64F}]/gu, '').trim()}</p>
    <p className="text-md font-medium text-slate-100">{value || '-'}</p>
  </div>
);

const CombinedResultsCard: React.FC<CombinedResultsCardProps> = ({ details }) => {
  const { numberDetails, aadhaarDetails } = details;

  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-emerald-500/50 to-teal-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-shadow duration-500 animate-result-appear">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        
        {/* Number Details Section */}
        <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
                Number Details for {numberDetails.number}
            </h2>
            <div className="space-y-2">
                {Object.entries(numberDetails.data).map(([key, value]) => (
                    <DetailItem key={key} label={key} value={value} />
                ))}
            </div>
        </div>

        {/* Aadhaar Details Section */}
        <div>
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                Linked Aadhaar Details
            </h2>
            <div className="space-y-2">
                <DetailItem label="Address" value={aadhaarDetails.address} />
                <DetailItem label="District Name" value={aadhaarDetails.homeDistName} />
                <DetailItem label="State Name" value={aadhaarDetails.homeStateName} />
                <DetailItem label="Scheme Name" value={aadhaarDetails.schemeName} />
                <DetailItem label="Allowed On ORC" value={aadhaarDetails.allowed_onorc} />
            </div>
            
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-slate-200">Member Details</h3>
                <div className="space-y-4">
                    {aadhaarDetails.members && aadhaarDetails.members.length > 0 ? (
                    aadhaarDetails.members.map((member, index) => (
                        <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <p className="font-semibold text-cyan-400">{member.memName}</p>
                        <p className="text-sm text-slate-400">Relationship: {member.relation}</p>
                        </div>
                    ))
                    ) : (
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <p className="text-slate-400">No member details available.</p>
                    </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedResultsCard;