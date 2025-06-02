"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Define interfaces for filter field configuration
interface FilterField {
  name: string;
  label: string;
  inputType: "text" | "select" | "date" | "number" | "rangeDate";
  placeholder?: string;
  colSpan?: string;
  options?: { value: string | number; label: string }[]; // For select input
  disabled?: boolean;
}

interface FiltersFormProps {
  fields: FilterField[];
  onFilterChange: (values: Record<string, any>) => void;
  liveUpdate?: boolean;
  submitButton?: boolean;
  defaultValues?: Record<string, any>;
}

// Main FiltersForm component
const FiltersForm: React.FC<FiltersFormProps> = ({
  fields,
  onFilterChange,
  liveUpdate = false,
  submitButton = true,
  defaultValues = {},
}) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] =
    useState<Record<string, any>>(defaultValues);
  const isInitializedRef = useRef(false);

  // Memoize the cleaned default values to prevent unnecessary re-initialization
  const cleanedDefaultValues = useMemo(() => {
    return Object.fromEntries(
      Object.entries(defaultValues).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
  }, [defaultValues]);

  // Initialize form with defaultValues only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      form.setFieldsValue(defaultValues);
      setFormValues(defaultValues);
      isInitializedRef.current = true;

      // Only trigger onFilterChange if liveUpdate is enabled and there are actual values
      if (liveUpdate && Object.keys(cleanedDefaultValues).length > 0) {
        onFilterChange(cleanedDefaultValues);
      }
    }
  }, []); // Empty dependency array - run only once

  // Handle form values change for live updates
  const handleValuesChange = useCallback(
    (changedValues: Record<string, any>, allValues: Record<string, any>) => {
      setFormValues(allValues);

      if (liveUpdate) {
        // Clean up empty or undefined values
        const cleanedValues = Object.fromEntries(
          Object.entries(allValues).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        );
        onFilterChange(cleanedValues);
      }
    },
    [liveUpdate, onFilterChange]
  );

  // Handle form submission
  const handleSubmit = useCallback(() => {
    const cleanedValues = Object.fromEntries(
      Object.entries(formValues).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    onFilterChange(cleanedValues);
  }, [formValues, onFilterChange]);

  // Render input based on inputType
  const renderInput = useCallback((field: FilterField) => {
    switch (field.inputType) {
      case "text":
        return (
          <Input
            placeholder={field.placeholder || `Enter ${field.label}`}
            allowClear
            prefix={<SearchOutlined />}
            disabled={field.disabled}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder || `Enter ${field.label}`}
            allowClear
            disabled={field.disabled}
          />
        );
      case "select":
        return (
          <Select
            placeholder={field.placeholder || `Select ${field.label}`}
            allowClear
            options={field.options}
            disabled={field.disabled}
            showSearch
          />
        );
      case "date":
        return (
          <DatePicker
            placeholder={field.placeholder || `Select ${field.label}`}
            style={{ width: "100%" }}
            disabled={field.disabled}
          />
        );
      case "rangeDate":
        return (
          <DatePicker.RangePicker
            placeholder={[`Start ${field.label}`, `End ${field.label}`]}
            style={{ width: "100%" }}
            disabled={field.disabled}
          />
        );
      default:
        return null;
    }
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      onValuesChange={handleValuesChange}
      onFinish={handleSubmit}
      size="large"
      preserve={false}
    >
      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              field.colSpan || "col-span-12 sm:col-span-6 lg:col-span-4"
            }
          >
            <Form.Item name={field.name} label={field.label}>
              {renderInput(field)}
            </Form.Item>
          </div>
        ))}
      </div>
      {submitButton && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Apply Filters
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default FiltersForm;
