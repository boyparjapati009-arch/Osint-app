import React from 'react';
import { PincodeResponse } from '../types';

interface PincodeResultsCardProps {
  details: PincodeResponse;
}

const PincodeResultsCard: React.FC<PincodeResultsCardProps> = ({ details }) => {
  // PostOffice is guaranteed to be non-null by the API service logic
  const postOffices = details.PostOffice!;
  const commonDetails = postOffices[0];

  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-green-500/50 to-lime-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-shadow duration-500 animate-result-appear">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-lime-400">
          Pincode Details for {commonDetails.Pincode}
        </h2>
        <p className="text-lg text-slate-300 mb-6">{commonDetails.District}, {commonDetails.State}</p>
        
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Post Offices</h3>
        <div className="space-y-4">
          {postOffices.map((office, index) => (
            <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="font-semibold text-green-400">{office.Name}</p>
              <p className="text-sm text-slate-400">Block: {office.Block} ({office.BranchType})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PincodeResultsCard;