"use client";

export default function OptionItem({ groupName, option, onSelect, defaultChecked = false, currentSelected }) {
  return (
    <label className="option">
      <input
        type="radio"
        name={groupName}
        value={option.key}
        onClick={(e) => {
          if (currentSelected === option.key) onSelect(e.currentTarget.value);
        }}
        defaultChecked={defaultChecked}
        onChange={(e) => onSelect(e.target.value)}
      />
      {" "}
      {option.key}. {option.text}
    </label>
  );
}
