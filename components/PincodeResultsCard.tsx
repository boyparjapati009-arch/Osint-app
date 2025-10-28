import React from 'react';
import { PincodeResponse } from '../types';

interface PincodeResultsCardProps {
  details: PincodeResponse;
  query: string;
}

const PincodeResultsCard: React.FC<PincodeResultsCardProps> = ({ details, query }) => {
  if (details.Status !== 'Success' || !details.PostOffice || details.PostOffice.length === 0) {
    return (
      <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-yellow-500/50 to-orange-500/50 animate-result-appear">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
            API Response
          </h2>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-lg font-mono text-slate-300">
              {details.Message || `Could not find details for pincode "${query}".`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const postOffices = details.PostOffice;
  const commonDetails = postOffices[0];

  const DetailItem: React.FC<{ label: string; value: string | null }> = ({ label, value }) => {
    // Add spaces before capital letters (e.g., BranchType -> Branch Type) for better readability
    const formattedLabel = label.replace(/([A-Z])/g, ' $1').trim();
    return (
      <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-700/50 last:border-b-0 text-sm">
        <p className="text-slate-400">{formattedLabel}</p>
        <p className="font-medium text-slate-100 break-words">{value || '-'}</p>
      </div>
    );
  };

  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-green-500/50 to-lime-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-shadow duration-500 animate-result-appear">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-lime-400">
          Pincode Details for {commonDetails.Pincode}
        </h2>
        <p className="text-lg text-slate-300 mb-6">{commonDetails.District}, {commonDetails.State}</p>
        
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Post Offices ({postOffices.length} found)</h3>
        <div className="space-y-6">
          {postOffices.map((office, index) => (
            <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-lg text-green-400 mb-3 border-b border-slate-700 pb-2">{office.Name}</h4>
              <div>
                {Object.entries(office).map(([key, value]) => {
                  // Don't repeat details already shown in headers
                  if (['Name', 'Pincode', 'District', 'State'].includes(key)) {
                    return null;
                  }
                  // Don't show fields that have no value
                  if (value === null || value === '') {
                    return null;
                  }
                  return <DetailItem key={key} label={key} value={String(value)} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PincodeResultsCard;