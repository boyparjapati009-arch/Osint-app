import React from 'react';

interface SearchCardProps {
  value: string;
  setValue: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  placeholder: string;
  maxLength: number;
  pattern: string;
  title: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  value,
  setValue,
  onSearch,
  isLoading,
  placeholder,
  maxLength,
  pattern,
  title
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const sanitizedValue = e.target.value.replace(/\D/g, '');
    setValue(sanitizedValue);
  };

  return (
    <div className="w-full max-w-lg p-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-purple-500/10">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="tel"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-grow w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300 outline-none shadow-inner shadow-black/20"
            disabled={isLoading}
            maxLength={maxLength}
            pattern={pattern}
            title={title}
            required
          />
          <button
            type="submit"
            disabled={isLoading || value.length === 0}
            className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400 focus:-translate-y-px focus:shadow-xl focus:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : 'Search'}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 mix-blend-soft-light"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchCard;
