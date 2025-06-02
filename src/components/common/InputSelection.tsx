import { CloseCircleOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Option {
  id: string;
  name: string;
  category?: string;
}

interface InputSelectionProps {
  availableOptions?: Option[];
  defaultSelectedOptions?: Option[];
  minOptions?: number;
  maxOptions?: number | null;
  placeholder?: string;
  allowCustomInput?: boolean;
  showCategories?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  className?: string;
  onSelectionChange?: (
    selectedOptions: Option[],
    customOptions: Option[]
  ) => void;
  showValidationError?: boolean;
  value?: { selectedOptions: Option[]; customOptions: Option[] };
  onChange?: (value: {
    selectedOptions: Option[];
    customOptions: Option[];
  }) => void;
}

const InputSelection: React.FC<InputSelectionProps> = ({
  availableOptions = [],
  defaultSelectedOptions = [],
  minOptions = 0,
  maxOptions = null,
  placeholder = "Please select",
  allowCustomInput = false,
  showCategories = false,
  searchable = true,
  multiple = true,
  className = "w-full",
  onSelectionChange,
  showValidationError = true,
  value,
  onChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [customOptions, setCustomOptions] = useState<Option[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  const prevValueRef = useRef<string>("");
  const isInternalChangeRef = useRef(false);

  // Stable callback for notifying parent
  const notifyParent = useCallback(
    (newSelected: Option[], newCustom: Option[]) => {
      const newValue = {
        selectedOptions: newSelected,
        customOptions: newCustom,
      };
      const valueString = JSON.stringify(newValue);

      if (prevValueRef.current !== valueString) {
        prevValueRef.current = valueString;

        if (onSelectionChange) {
          onSelectionChange(newSelected, newCustom);
        }

        if (onChange) {
          isInternalChangeRef.current = true;
          onChange(newValue);
        }
      }
    },
    [onSelectionChange, onChange]
  );

  // Initialize from props only once
  useEffect(() => {
    if (!initialized) {
      let initialSelected: Option[] = [];
      let initialCustom: Option[] = [];

      if (value) {
        initialSelected = value.selectedOptions || [];
        initialCustom = value.customOptions || [];
      } else if (defaultSelectedOptions.length > 0) {
        initialSelected = defaultSelectedOptions;
      }

      setSelectedOptions(initialSelected);
      setCustomOptions(initialCustom);
      setInitialized(true);

      const initialValue = {
        selectedOptions: initialSelected,
        customOptions: initialCustom,
      };
      prevValueRef.current = JSON.stringify(initialValue);

      // Notify parent immediately with initial values
      if (initialSelected.length > 0 || initialCustom.length > 0) {
        setTimeout(() => {
          notifyParent(initialSelected, initialCustom);
        }, 0);
      }
    }
  }, [initialized, value, defaultSelectedOptions, notifyParent]);

  // Handle external form value changes
  useEffect(() => {
    if (initialized && value && !isInternalChangeRef.current) {
      const newValueString = JSON.stringify(value);
      if (prevValueRef.current !== newValueString) {
        setSelectedOptions(value.selectedOptions || []);
        setCustomOptions(value.customOptions || []);
        prevValueRef.current = newValueString;
      }
    }
    isInternalChangeRef.current = false;
  }, [value, initialized]);

  // Validation effect
  useEffect(() => {
    if (initialized) {
      validateSelection();
    }
  }, [
    selectedOptions.length,
    customOptions.length,
    minOptions,
    maxOptions,
    initialized,
  ]);

  const validateSelection = (): boolean => {
    const totalSelected = selectedOptions.length + customOptions.length;
    let error = "";

    if (totalSelected < minOptions) {
      error = `Please select at least ${minOptions} option${
        minOptions > 1 ? "s" : ""
      }`;
    } else if (maxOptions && totalSelected > maxOptions) {
      error = `You can select maximum ${maxOptions} option${
        maxOptions > 1 ? "s" : ""
      }`;
    }

    setValidationError(error);
    return error === "";
  };

  const handleOptionSelect = (optionId: string): void => {
    const option = availableOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    const isAlreadySelected = selectedOptions.some(
      (item) => item.id === option.id
    );
    if (isAlreadySelected) return;

    const totalSelected = selectedOptions.length + customOptions.length;

    if (!maxOptions || totalSelected < maxOptions) {
      const newSelected = [...selectedOptions, option];
      setSelectedOptions(newSelected);
      notifyParent(newSelected, customOptions);
    } else {
      setValidationError(`Maximum ${maxOptions} selections allowed`);
    }
  };

  const handleCustomAdd = (): void => {
    if (!allowCustomInput || !customInput.trim()) return;

    // Check if custom option already exists
    const exists = customOptions.some(
      (opt) => opt.name.toLowerCase() === customInput.trim().toLowerCase()
    );
    if (exists) {
      setValidationError("This option already exists");
      return;
    }

    const customOption: Option = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: customInput.trim(),
      category: "Custom",
    };

    const totalSelected = selectedOptions.length + customOptions.length;

    if (!maxOptions || totalSelected < maxOptions) {
      const newCustom = [...customOptions, customOption];
      setCustomOptions(newCustom);
      setCustomInput("");
      setValidationError(""); // Clear any validation errors
      notifyParent(selectedOptions, newCustom);
    } else {
      setValidationError(`Maximum ${maxOptions} selections allowed`);
    }
  };

  const handleRemove = (optionId: string, isCustom: boolean = false): void => {
    const totalSelected = selectedOptions.length + customOptions.length;

    // Check if we can remove (must maintain minimum)
    if (totalSelected <= minOptions) {
      setValidationError(
        `Minimum ${minOptions} selection${minOptions > 1 ? "s" : ""} required`
      );
      return;
    }

    if (isCustom) {
      const newCustomOptions = customOptions.filter(
        (item) => item.id !== optionId
      );
      setCustomOptions(newCustomOptions);
      setValidationError(""); // Clear validation error when successfully removing
      notifyParent(selectedOptions, newCustomOptions);
    } else {
      const newSelectedOptions = selectedOptions.filter(
        (item) => item.id !== optionId
      );
      setSelectedOptions(newSelectedOptions);
      setValidationError(""); // Clear validation error when successfully removing
      notifyParent(newSelectedOptions, customOptions);
    }
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  const selectOptions = availableOptions
    .filter(
      (option) => !selectedOptions.some((selected) => selected.id === option.id)
    )
    .map((option) => ({
      value: option.id,
      label: showCategories && option.category ? `${option.name}` : option.name,
    }));

  const totalSelected = selectedOptions.length + customOptions.length;
  const isMaxReached = maxOptions && totalSelected >= maxOptions;

  if (availableOptions.length === 0 && totalSelected === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500 p-4 border border-dashed border-gray-300 rounded-md">
          No options available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        {availableOptions.length > 0 && (
          <Select
            className={className}
            showSearch={searchable}
            placeholder={
              isMaxReached
                ? `Maximum ${maxOptions} selections reached`
                : placeholder
            }
            onChange={handleOptionSelect}
            options={selectOptions}
            value={null} // Changed from undefined to null
            disabled={!!isMaxReached}
            filterOption={(input, option) =>
              searchable
                ? (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : true
            }
            key={`select-${selectedOptions.length}-${customOptions.length}`} // Add this key to force re-render
          />
        )}

        {allowCustomInput && !isMaxReached && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCustomAdd()}
              placeholder="Add new skill..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleCustomAdd}
              disabled={!customInput.trim()}
              className="px-4 cursor-pointer py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Add Skill
            </button>
          </div>
        )}

        {showValidationError && validationError && (
          <div className="text-red-500 text-sm mt-1">{validationError}</div>
        )}

        <div className="text-gray-500 text-sm mt-1">
          Selected: {totalSelected}
          {minOptions > 0 && ` (min: ${minOptions})`}
          {maxOptions && ` (max: ${maxOptions})`}
        </div>
      </div>

      {totalSelected > 0 && (
        <div className="space-y-2">
          {selectedOptions.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected Options:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map((option) => (
                  <div
                    className="bg-blue-100 text-blue-800 flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                    key={option.id}
                  >
                    <span>{option.name}</span>
                    {/* {showCategories && option.category && (
                      <span className="text-xs opacity-75">
                        ({option.category})
                      </span>
                    )} */}
                    <span
                      className="cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => handleRemove(option.id, false)}
                    >
                      <CloseCircleOutlined style={{ fontSize: "14px" }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customOptions.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Custom Options:
              </div>
              <div className="flex flex-wrap gap-2">
                {customOptions.map((option) => (
                  <div
                    className="bg-green-100 text-green-800 flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                    key={option.id}
                  >
                    <span>{option.name}</span>
                    <span className="text-xs opacity-75">(Custom)</span>
                    <span
                      className="cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => handleRemove(option.id, true)}
                    >
                      <CloseCircleOutlined style={{ fontSize: "14px" }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputSelection;
