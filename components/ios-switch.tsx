import React from "react";
import styled from "styled-components";

interface IOSSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const IOSSwitch: React.FC<IOSSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <StyledIOSSwitch>
      <label className={`ios-switch ${disabled ? "disabled" : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="slider" />
      </label>
    </StyledIOSSwitch>
  );
};

export default IOSSwitch;

const StyledIOSSwitch = styled.div`
  .ios-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 30px;
  }

  .ios-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .ios-switch .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #e5e5ea;
    border-radius: 999px;
    transition: 0.3s;
  }

  .ios-switch .slider::before {
    content: "";
    position: absolute;
    height: 26px;
    width: 26px;
    left: 2px;
    top: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .ios-switch input:checked + .slider {
    background-color: #34c759; /* xanh iOS */
  }

  .ios-switch input:checked + .slider::before {
    transform: translateX(20px);
  }

  .ios-switch.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ios-switch.disabled .slider {
    cursor: not-allowed;
  }
`;
