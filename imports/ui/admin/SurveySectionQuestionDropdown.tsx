import React from 'react';
import Select from 'react-select';

export interface QuestionOption {
  value: string;
  label: string;
  sectionName?: string; // Optional section name for preview mode
}

interface SurveySectionQuestionDropdownProps {
  sectionLabel: string;
  options: QuestionOption[];
  selected: QuestionOption[];
  onChange: (selected: QuestionOption[]) => void;
}

const SurveySectionQuestionDropdown: React.FC<SurveySectionQuestionDropdownProps> = ({
  sectionLabel,
  options,
  selected,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 600, color: '#28211e', marginBottom: 8, display: 'block' }}>{sectionLabel} - Select Questions</label>
      <Select
        isMulti
        options={options}
        value={selected}
        onChange={opts => onChange(opts as QuestionOption[])}
        placeholder={`Select questions for ${sectionLabel}`}
        styles={{
          control: (base) => ({ ...base, borderColor: '#e5d6c7', minHeight: 44, fontSize: 15 }),
          multiValue: (base) => ({ ...base, background: '#f9f4f7' }),
          option: (base, state) => ({ ...base, background: state.isSelected ? '#552a47' : '#fff', color: state.isSelected ? '#fff' : '#28211e' }),
        }}
      />
    </div>
  );
};

export default SurveySectionQuestionDropdown;
