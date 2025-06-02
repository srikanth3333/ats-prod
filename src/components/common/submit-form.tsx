import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Upload,
} from "antd";
import React, { useEffect } from "react";
import SkillsConceptsComponent from "./SkillsConceptsComponent";

const { TextArea } = Input;
const { Option } = Select;

interface SubmitFormProps {
  fields: any[];
  onSubmit: (values: any) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  defaultValues?: any;
  submitButtonText?: string;
  className?: string;
  form?: any;
  btns?: any[];
}

const SubmitForm: React.FC<SubmitFormProps> = ({
  fields,
  onSubmit,
  onValuesChange,
  defaultValues = {},
  submitButtonText = "Submit",
  className = "",
  form: externalForm,
  btns,
}) => {
  const [form] = Form.useForm(externalForm);

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      form.setFieldsValue(defaultValues);
    }
  }, [form, defaultValues]);

  const renderField = (field: any) => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled: field.disabled,
      style: field.style,
    };

    switch (field.type) {
      case "text":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
              ...(field.rules || []),
            ]}
          >
            <Input {...commonProps} />
          </Form.Item>
        );

      case "textarea":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
              ...(field.rules || []),
            ]}
          >
            <TextArea
              {...commonProps}
              rows={field.rows || 4}
              maxLength={field.maxLength}
            />
          </Form.Item>
        );
      case "password":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
              ...(field.rules || []),
            ]}
          >
            <Input.Password {...commonProps} />
          </Form.Item>
        );

      case "select":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Select
              {...commonProps}
              mode={field.mode}
              allowClear={field.allowClear}
              showSearch={field.showSearch}
            >
              {field.options?.map((option: any) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case "combobox":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Select
              {...commonProps}
              mode="multiple"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {field.options?.map((option: any) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case "date":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <DatePicker
              {...commonProps}
              format={field.format || "YYYY-MM-DD"}
              showTime={field.showTime}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );

      case "time":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <TimePicker
              {...commonProps}
              format={field.format || "HH:mm"}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
              {
                type: "number",
                min: field.min,
                max: field.max,
                message:
                  field.errorMsg ||
                  `Value must be between ${field.min} and ${field.max}`,
              },
            ]}
          >
            <InputNumber
              {...commonProps}
              min={field.min}
              max={field.max}
              step={field.step}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );

      case "upload":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Upload
              name={field.name}
              action={field.action || "/upload"}
              listType={field.listType || "text"}
              multiple={field.multiple}
              accept={field.accept}
              maxCount={field.maxCount}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        );

      case "slider":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Slider
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              marks={field.marks}
              range={field.range}
              included={field.included}
            />
          </Form.Item>
        );

      case "rate":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Rate
              count={field.count || 5}
              allowHalf={field.allowHalf}
              allowClear={field.allowClear}
            />
          </Form.Item>
        );

      case "checkbox":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            valuePropName="checked"
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Checkbox>{field.checkboxLabel}</Checkbox>
          </Form.Item>
        );

      case "checkboxGroup":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Checkbox.Group options={field.options} />
          </Form.Item>
        );

      case "radio":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Radio.Group>
              {field.options?.map((option: any) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );

      case "switch":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            valuePropName="checked"
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
              },
            ]}
          >
            <Switch
              checkedChildren={field.checkedChildren}
              unCheckedChildren={field.unCheckedChildren}
            />
          </Form.Item>
        );

      case "dynamic":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            className={field.colSpan}
          >
            <Form.List name={field.name}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="grid grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg mb-4"
                    >
                      {field.nestedFields?.map((nestedField: any) => (
                        <Form.Item
                          key={`${name}-${nestedField.name}`}
                          {...restField}
                          name={[name, nestedField.name]}
                          label={nestedField.label}
                          className={nestedField.colSpan}
                          // Add valuePropName for file uploads
                          valuePropName={
                            nestedField.type === "upload"
                              ? "fileList"
                              : undefined
                          }
                          getValueFromEvent={
                            nestedField.type === "upload"
                              ? (e) => {
                                  if (Array.isArray(e)) {
                                    return e;
                                  }
                                  return e?.fileList;
                                }
                              : undefined
                          }
                          rules={[
                            {
                              required: nestedField.required,
                              message:
                                nestedField.errorMsg ||
                                `${nestedField.label} is required`,
                            },
                            ...(nestedField.rules || []),
                          ]}
                        >
                          {nestedField.type === "text" ? (
                            <Input placeholder={nestedField.placeholder} />
                          ) : nestedField.type === "textarea" ? (
                            <TextArea
                              placeholder={nestedField.placeholder}
                              rows={nestedField.rows || 4}
                            />
                          ) : nestedField.type === "number" ? (
                            <InputNumber
                              placeholder={nestedField.placeholder}
                              min={nestedField.min}
                              max={nestedField.max}
                              style={{ width: "100%" }}
                            />
                          ) : nestedField.type === "select" ? (
                            <Select placeholder={nestedField.placeholder}>
                              {nestedField.options?.map((option: any) => (
                                <Option key={option.value} value={option.value}>
                                  {option.label}
                                </Option>
                              ))}
                            </Select>
                          ) : nestedField.type === "upload" ? (
                            <Upload
                              name={nestedField.name}
                              action={nestedField.action || "/upload"}
                              listType={nestedField.listType || "text"}
                              multiple={nestedField.multiple}
                              accept={nestedField.accept}
                              maxCount={nestedField.maxCount}
                            >
                              <Button icon={<UploadOutlined />}>
                                {nestedField.uploadText || "Click to Upload"}
                              </Button>
                            </Upload>
                          ) : (
                            <Input placeholder={nestedField.placeholder} />
                          )}
                        </Form.Item>
                      ))}
                      <div className="col-span-12 flex justify-end">
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Form.Item className="col-span-12">
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add {field.label}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        );
      case "skillsConcepts":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={[
              {
                required: field.required,
                message: field.errorMsg || `${field.label} is required`,
                validator: (_, value) => {
                  if (
                    field.required &&
                    (!value ||
                      !value.skills ||
                      value.skills.length < (field.minSkills || 1))
                  ) {
                    return Promise.reject(
                      new Error(
                        field.errorMsg ||
                          `Please select at least ${
                            field.minSkills || 1
                          } skills`
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <SkillsConceptsComponent
              availableSkills={field.availableSkills}
              defaultSelectedSkills={field.defaultSelectedSkills}
              skillSuggestions={field.skillSuggestions}
              minSkills={field.minSkills}
              maxSkills={field.maxSkills}
              onSkillsChange={(skills) => {
                const currentValue = form.getFieldValue(field.name) || {};
                const newValue = { ...currentValue, skills };
                form.setFieldsValue({ [field.name]: newValue });

                if (onValuesChange) {
                  onValuesChange(
                    { [field.name]: newValue },
                    form.getFieldsValue()
                  );
                }
              }}
              onConceptsChange={(concepts, addedConcepts) => {
                const currentValue = form.getFieldValue(field.name) || {};
                const newValue = { ...currentValue, concepts, addedConcepts };
                form.setFieldsValue({ [field.name]: newValue });

                if (onValuesChange) {
                  onValuesChange(
                    { [field.name]: newValue },
                    form.getFieldsValue()
                  );
                }
              }}
            />
          </Form.Item>
        );

      case "custom":
        const CustomComponent = field.component;
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            className={field.colSpan}
            rules={
              field.required
                ? [
                    {
                      required: true,
                      message: field.errorMsg || `${field.label} is required`,
                      validator: (_, value) => {
                        if (field.name === "inputSelection") {
                          if (
                            !value ||
                            (!value.selectedOptions?.length &&
                              !value.customOptions?.length)
                          ) {
                            return Promise.reject(
                              new Error(
                                field.errorMsg ||
                                  "Please select at least one option"
                              )
                            );
                          }
                          const totalSelected =
                            (value.selectedOptions?.length || 0) +
                            (value.customOptions?.length || 0);
                          const minOptions = field.props?.minOptions || 0;
                          const maxOptions = field.props?.maxOptions;

                          if (totalSelected < minOptions) {
                            return Promise.reject(
                              new Error(
                                `Please select at least ${minOptions} options`
                              )
                            );
                          }
                          if (maxOptions && totalSelected > maxOptions) {
                            return Promise.reject(
                              new Error(`Maximum ${maxOptions} options allowed`)
                            );
                          }
                        }
                        return Promise.resolve();
                      },
                    },
                  ]
                : []
            }
          >
            <CustomComponent
              {...field.props}
              onChange={(value: any) => {
                // Ensure we're setting the field value correctly
                form.setFieldsValue({ [field.name]: value });

                // Call the original onSelectionChange if provided
                if (field.props?.onSelectionChange) {
                  field.props.onSelectionChange(
                    value.selectedOptions || [],
                    value.customOptions || []
                  );
                }

                // Trigger form change with proper values
                if (onValuesChange) {
                  const currentFormValues = form.getFieldsValue();
                  const updatedValues = {
                    ...currentFormValues,
                    [field.name]: value,
                  };
                  onValuesChange({ [field.name]: value }, updatedValues);
                }
              }}
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${className}`}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={onValuesChange}
        initialValues={defaultValues}
        scrollToFirstError
      >
        <div className="grid grid-cols-12 gap-4">{fields.map(renderField)}</div>

        <Form.Item className="col-span-12">
          {(btns?.length ?? 0) > 0 ? (
            <div className="bg-white shadow-md absolute bottom-0 rounded-xl p-4 fixed bottom-0 left-0 right-0">
              <div className="flex justify-end gap-4">
                {btns?.map((btn: any) => (
                  <Button
                    type={btn.type}
                    htmlType={btn.htmlType}
                    size="middle"
                    className="w-full md:w-auto"
                    onClick={btn?.onClick}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              className="w-full md:w-auto"
            >
              {submitButtonText}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitForm;
