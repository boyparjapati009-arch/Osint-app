import React from 'react';
import { SimInfoResponse } from '../types';

interface SimInfoResultsCardProps {
  details: SimInfoResponse;
}

const DetailItem: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => (
  <div className="py-3 border-b border-slate-700/50 break-words">
    <p className="text-sm text-slate-400">{label}</p>
    <div className="text-md font-medium text-slate-100">
      {Array.isArray(value) ? (
        <ul className="list-disc list-inside pl-2">
          {value.map((item, index) => item && <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <p>{value || '-'}</p>
      )}
    </div>
  </div>
);

const SimInfoResultsCard: React.FC<SimInfoResultsCardProps> = ({ details }) => {
  const { fields, iframe_src } = details;
  
  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-amber-500/50 to-orange-500/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-shadow duration-500 animate-result-appear">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
          SIM Details for {details.phone_number}
        </h2>
        <div className="space-y-2">
          {Object.entries(fields).map(([key, value]) => (
            <DetailItem key={key} label={key} value={value} />
          ))}
        </div>
        {iframe_src && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Location Map</h3>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-slate-700/50">
               <iframe
                 src={iframe_src}
                 width="100%"
                 height="300"
                 style={{ border: 0 }}
                 allowFullScreen={true}
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Location Map"
               ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimInfoResultsCard;
