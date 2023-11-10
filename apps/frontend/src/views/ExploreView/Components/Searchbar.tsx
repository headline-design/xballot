import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BaseSearch from './BaseSearchbar';
import BaseMenu from './BaseMenu';
import { ChevronDown } from 'icons/ChevronDown';

type Option = {
  text: string;
  action: string;
  extras: { selected: boolean };
};

type SearchbarProps = {
  searchOptions: Option[];
  onChange: (newValue: string) => void;
  loading: any;
  setSelectedType: (newValue: Option) => void;
  clearUrl?: boolean;
  onClearUrl?: () => void;
};

const Searchbar: React.FC<SearchbarProps> = ({
  searchOptions,
  onChange,
  setSelectedType,
  loading,
  clearUrl,
  onClearUrl,
}) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get('q') || '';
  const filter = params.get('filter');

  const [input, setInput] = useState<string>(query);
  const [selectedFilter, setSelectedFilter] = useState<Option | null>(
    searchOptions.find((option) => option.action === filter) || null
  );

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    setSelectedFilter(searchOptions.find((option) => option.action === filter) || null);
  }, [filter, searchOptions]);

  const selectedOptionText = selectedFilter?.text || 'Spaces';

  const handleSelectFilter = (action: string) => {
    const selectedOption = searchOptions.find((option) => option.action === action);
    navigate(`?q=${input}&filter=${action}`);
    setSelectedFilter(selectedOption);
    setSelectedType(selectedOption);
  };

  const handleUpdateSearch = (newValue: string) => {
    setInput(newValue);
    navigate(`?q=${newValue}${filter ? `&filter=${filter}` : ''}`);
    onChange(newValue); // call the passed in onChange function
  };

  const handleClearUrl = () => {
    if (onClearUrl) {
      onClearUrl();
    }
  };

  return (
    <div className="flex rounded-full border pl-3 pr-0 focus-within:border-skin-text">
      <BaseSearch
        value={input}
        placeholder={'Search'}
        onChange={handleUpdateSearch}
        loading={loading}
        clearUrl={clearUrl}
        onClearUrl={handleClearUrl}
      />
      <div className="flex items-center border-l text-skin-link" style={{ height: 44 }}>
        <BaseMenu items={searchOptions} onSelect={handleSelectFilter}>
          <span className="flex h-full flex-grow items-center">
            <span className="ml-3">{selectedOptionText}</span>
            <ChevronDown className="ml-1 mr-[12px] text-xs text-skin-text" />
          </span>
        </BaseMenu>
      </div>
    </div>
  );
};

export default Searchbar;
