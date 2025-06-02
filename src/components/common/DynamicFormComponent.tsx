import {
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  MonitorOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UpOutlined,
} from "@ant-design/icons";
import type { CollapseProps } from "antd";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

interface FieldOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

interface DynamicFieldConfig {
  key: string;
  title: string;
  description?: string;
  type: string;
  icon?: string;
  required?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  multiple?: boolean;
  showSearch?: boolean;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  defaultOpen?: boolean;
  options?: FieldOption[];
  children?: DynamicFieldConfig[];
  rules?: any[];
  preQualifyingConfig?: {
    responseTypes: FieldOption[];
    maxQuestions: number;
  };
}

interface PreQualifyingQuestionItem {
  id: string;
  question: string;
  responseType: string;
  answer: string;
  mustHaveQualification: boolean;
}

interface DynamicFormComponentProps {
  config?: DynamicFieldConfig[];
  onValuesChange?: (changedValues: any, allValues: any) => void;
  onSubmit?: (values: any) => void;
  initialValues?: Record<string, any>;
}

// Pre-qualifying questions field component
const PreQualifyingQuestionsField: React.FC<{
  config: DynamicFieldConfig;
  questions: PreQualifyingQuestionItem[];
  onAddQuestion: (question: Omit<PreQualifyingQuestionItem, "id">) => void;
  onDeleteQuestion: (id: string) => void;
}> = ({ config, questions, onAddQuestion, onDeleteQuestion }) => {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    responseType: "text",
    answer: "",
    mustHaveQualification: false,
  });

  const responseTypes = config.preQualifyingConfig?.responseTypes || [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Yes/No", value: "yes_no" },
    { label: "Multiple Choice", value: "multiple_choice" },
    { label: "Date", value: "date" },
  ];

  const getAnswerOptions = useCallback((responseType: string) => {
    switch (responseType) {
      case "yes_no":
        return [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Either Yes or No", value: "any" },
        ];
      default:
        return [{ label: "Any", value: "any" }];
    }
  }, []);

  const isAnswerRequired = newQuestion.mustHaveQualification;
  const maxQuestions = config.preQualifyingConfig?.maxQuestions || 5;

  const handleAdd = useCallback(() => {
    if (!newQuestion.question.trim()) {
      message.error("Please enter a question");
      return;
    }

    if (questions.length >= maxQuestions) {
      message.error(`Maximum ${maxQuestions} questions allowed`);
      return;
    }

    if (isAnswerRequired && !newQuestion.answer) {
      message.error(
        'Answer is required when "Must have qualification" is checked'
      );
      return;
    }

    onAddQuestion({
      question: newQuestion.question,
      responseType: newQuestion.responseType,
      answer: newQuestion.answer,
      mustHaveQualification: newQuestion.mustHaveQualification,
    });

    setNewQuestion({
      question: "",
      responseType: "text",
      answer: "",
      mustHaveQualification: false,
    });
  }, [
    newQuestion,
    isAnswerRequired,
    onAddQuestion,
    questions.length,
    maxQuestions,
  ]);

  const handleResponseTypeChange = useCallback((value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      responseType: value,
      answer: "",
    }));
  }, []);

  const handleMustHaveQualificationChange = useCallback((checked: boolean) => {
    setNewQuestion((prev) => ({
      ...prev,
      mustHaveQualification: checked,
    }));
  }, []);

  return (
    <div>
      {/* Add New Question */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <Title level={5} className="mb-3">
          Add New Pre-Qualifying Question
        </Title>
        <div className="space-y-4">
          <Input
            placeholder="Try asking 'What's your total years of experience?'"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, question: e.target.value }))
            }
          />

          <Row gutter={16}>
            <Col span={12}>
              <Text className="text-gray-500 text-sm mb-1 block">
                Response Type
              </Text>
              <Select
                placeholder="Response Type"
                value={newQuestion.responseType}
                onChange={handleResponseTypeChange}
                className="w-full"
              >
                {responseTypes.map((type) => (
                  <Option key={String(type.value)} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Text className="text-gray-500 text-sm mb-1 block">Answer</Text>
              <Select
                placeholder="Answer"
                value={newQuestion.answer}
                onChange={(value) =>
                  setNewQuestion((prev) => ({ ...prev, answer: value }))
                }
                className="w-full"
                allowClear
              >
                {getAnswerOptions(newQuestion.responseType).map((option) => (
                  <Option key={String(option.value)} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              {isAnswerRequired && !newQuestion.answer && (
                <Text className="text-red-500 text-sm mt-1">
                  Answer is required
                </Text>
              )}
            </Col>
          </Row>

          <div className="flex items-center justify-between">
            <Checkbox
              checked={newQuestion.mustHaveQualification}
              onChange={(e) =>
                handleMustHaveQualificationChange(e.target.checked)
              }
            >
              Must have qualification
            </Checkbox>
            <Button
              type="primary"
              className="bg-green-500 border-green-500 hover:bg-green-600"
              onClick={handleAdd}
              disabled={questions.length >= maxQuestions}
            >
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* Added Questions */}
      <div>
        <Title level={5} className="mb-3">
          Added Pre-Qualifying Questions ({questions.length}/{maxQuestions})
        </Title>
        {questions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No questions added yet. Add your first question above.
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Text className="font-medium">
                    {index + 1}. {question.question}
                  </Text>
                  <div className="flex items-center space-x-2 mt-1 flex-wrap">
                    <Text className="text-sm text-gray-600">
                      Answer:{" "}
                      <span className="font-medium">
                        {question.answer || "Any"}
                      </span>
                    </Text>
                    {question.mustHaveQualification && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        MUST HAVE QUALIFICATION
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    className="text-gray-600"
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => onDeleteQuestion(question.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DynamicFormComponent: React.FC<DynamicFormComponentProps> = ({
  config = [],
  onValuesChange,
  onSubmit,
  initialValues = {},
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [preQualifyingQuestions, setPreQualifyingQuestions] = useState<any[]>(
    []
  );
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [form] = Form.useForm();

  // Initialize form values and active keys only once
  useEffect(() => {
    if (!isInitialized && config.length > 0) {
      const defaultValues: Record<string, any> = {};
      const defaultActiveKeys: string[] = [];

      config.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaultValues[field.key] = field.defaultValue;
        }

        // Set default open state
        if (field.defaultOpen !== false) {
          defaultActiveKeys.push(field.key);
        }

        // Handle nested fields
        if (field.children) {
          field.children.forEach((childField) => {
            if (childField.defaultValue !== undefined) {
              if (!defaultValues[field.key]) {
                defaultValues[field.key] = {};
              }
              defaultValues[field.key][childField.key] =
                childField.defaultValue;
            }
          });
        }
      });

      const mergedValues = { ...defaultValues, ...initialValues };
      setFormValues(mergedValues);
      setActiveKeys(defaultActiveKeys);
      form.setFieldsValue(mergedValues);
      setIsInitialized(true);
    }
  }, [config, initialValues, form, isInitialized]);

  // Handle form value changes with useCallback to prevent infinite loops
  const handleValuesChange = useCallback(
    (changedValues: any, allValues: any) => {
      setFormValues(allValues);
      if (onValuesChange) {
        onValuesChange(changedValues, allValues);
      }
    },
    [onValuesChange]
  );

  // Handle form submission
  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const finalValues = {
          ...values,
          preQualifyingQuestions: preQualifyingQuestions,
        };
        if (onSubmit) {
          onSubmit(finalValues);
        }
        message.success("Form submitted successfully!");
      })
      .catch(() => {
        message.error("Please fix the errors in the form");
      });
  }, [form, preQualifyingQuestions, onSubmit]);

  // Get icon component
  const getIcon = useCallback((iconName?: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      clock: <ClockCircleOutlined className="text-green-500" />,
      question: <QuestionCircleOutlined className="text-green-500" />,
      chart: <BarChartOutlined className="text-green-500" />,
      calendar: <CalendarOutlined className="text-green-500" />,
      eye: <EyeOutlined className="text-green-500" />,
      bell: <BellOutlined className="text-green-500" />,
      lock: <LockOutlined className="text-green-500" />,
      setting: <SettingOutlined className="text-green-500" />,
      monitor: <MonitorOutlined className="text-green-500" />,
    };
    return iconName ? iconMap[iconName] : null;
  }, []);

  // Handle pre-qualifying questions
  const handleAddPreQualifyingQuestion = useCallback(
    (question: Omit<PreQualifyingQuestionItem, "id">) => {
      const newQuestion: PreQualifyingQuestionItem = {
        ...question,
        id: Date.now().toString(),
      };
      setPreQualifyingQuestions((prev) => [...prev, newQuestion]);
      message.success("Question added successfully");
    },
    []
  );

  const handleDeletePreQualifyingQuestion = useCallback((id: string) => {
    setPreQualifyingQuestions((prev) => prev.filter((q) => q.id !== id));
    message.success("Question deleted successfully");
  }, []);

  // Handle weight slider change
  const handleWeightChange = useCallback(
    (fieldKey: string, value: number) => {
      const newValues = {
        ...formValues,
        [fieldKey]: value,
        [`${fieldKey}_secondary`]: 100 - value,
      };
      setFormValues(newValues);
      form.setFieldsValue(newValues);
      handleValuesChange({ [fieldKey]: value }, newValues);
    },
    [formValues, form, handleValuesChange]
  );

  // Render different field types
  const renderField = useCallback(
    (field: DynamicFieldConfig) => {
      const commonProps = {
        placeholder: field.placeholder,
        allowClear: field.allowClear,
      };

      switch (field.type) {
        case "pre_qualifying_questions":
          return (
            <PreQualifyingQuestionsField
              config={field}
              questions={preQualifyingQuestions}
              onAddQuestion={handleAddPreQualifyingQuestion}
              onDeleteQuestion={handleDeletePreQualifyingQuestion}
            />
          );

        case "chips":
          return (
            <div className="flex flex-wrap gap-2">
              {field.options?.map((option) => (
                <Button
                  key={String(option.value)}
                  type={
                    formValues[field.key] === option.value
                      ? "primary"
                      : "default"
                  }
                  className={
                    formValues[field.key] === option.value
                      ? "bg-green-600 border-green-600 rounded-full"
                      : "rounded-full"
                  }
                  onClick={() => {
                    const newValues = {
                      ...formValues,
                      [field.key]: option.value,
                    };
                    setFormValues(newValues);
                    form.setFieldsValue(newValues);
                    handleValuesChange(
                      { [field.key]: option.value },
                      newValues
                    );
                  }}
                  disabled={option.disabled}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          );

        case "weight_slider":
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {field.options?.map((option, index) => (
                  <div
                    key={String(option.value)}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className={`w-4 h-4 rounded ${
                        index === 0 ? "bg-blue-400" : "bg-orange-400"
                      }`}
                    ></div>
                    <Text>{option.label}</Text>
                  </div>
                ))}
              </div>
              <div className="relative">
                <Slider
                  value={formValues[field.key] || field.defaultValue || 50}
                  onChange={(value) => handleWeightChange(field.key, value)}
                  className="mb-4"
                />
                <div className="flex justify-between">
                  <div className="bg-blue-400 text-white px-3 py-1 rounded">
                    {formValues[field.key] || field.defaultValue || 50}%
                  </div>
                  <div className="bg-orange-400 text-white px-3 py-1 rounded">
                    {100 - (formValues[field.key] || field.defaultValue || 50)}%
                  </div>
                </div>
              </div>
            </div>
          );

        case "expiry_options":
          return (
            <Radio.Group className="w-full">
              <Space direction="vertical" className="w-full" size="large">
                {field.options?.map((option) => (
                  <div
                    key={String(option.value)}
                    className="border rounded-lg p-4"
                  >
                    <Radio value={option.value}>{option.label}</Radio>
                    {formValues[field.key] === option.value &&
                      option.value === "date" && (
                        <div className="mt-3 ml-6">
                          <Form.Item
                            name={`${field.key}_date`}
                            className="mb-0"
                          >
                            <DatePicker
                              format="DD-MMM-YYYY"
                              placeholder="DD-MMM-YYYY"
                              className="w-full"
                            />
                          </Form.Item>
                        </div>
                      )}
                    {formValues[field.key] === option.value &&
                      option.value === "responses" && (
                        <div className="mt-3 ml-6">
                          <Form.Item
                            name={`${field.key}_count`}
                            className="mb-0"
                            rules={[
                              {
                                required: true,
                                message: "Responses count is required",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Responses Count"
                              className="w-full"
                              min={1}
                            />
                          </Form.Item>
                          {formValues[field.key] === "responses" &&
                            !formValues[`${field.key}_count`] && (
                              <Text className="text-red-500 text-sm mt-1">
                                Responses count is required
                              </Text>
                            )}
                        </div>
                      )}
                  </div>
                ))}
              </Space>
            </Radio.Group>
          );

        case "score_privacy":
          return (
            <div>
              <Text className="text-gray-700 mb-4 block">
                Do you want to reveal scores to candidates?
              </Text>
              <Space direction="vertical" size="large" className="w-full">
                {field.options?.map((option) => (
                  <div
                    key={String(option.value)}
                    className="flex items-center justify-between"
                  >
                    <Text>{option.label}</Text>
                    <Form.Item
                      name={`${field.key}_${option.value}`}
                      className="mb-0"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch defaultChecked />
                    </Form.Item>
                  </div>
                ))}
              </Space>
            </div>
          );

        case "retake_settings":
          return (
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium block">{field.title}</Text>
                <Text className="text-gray-600 text-sm">
                  {field.description}
                </Text>
              </div>
              <Form.Item
                name={field.key}
                className="mb-0"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch defaultChecked />
              </Form.Item>
            </div>
          );

        case "remote_proctoring":
          return (
            <Space direction="vertical" size="large" className="w-full">
              {field.children?.map((childField) => (
                <div
                  key={childField.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Text className="font-medium block">
                      {childField.title}
                    </Text>
                    {childField.description && (
                      <Text className="text-gray-600 text-sm">
                        {childField.description}
                      </Text>
                    )}
                  </div>
                  <Form.Item
                    name={childField.key}
                    className="mb-0"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch />
                  </Form.Item>
                </div>
              ))}
            </Space>
          );

        case "lock_interview":
          return (
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium block">{field.title}</Text>
                <Text className="text-gray-600 text-sm">
                  {field.description}
                </Text>
              </div>
              <Form.Item
                name={field.key}
                className="mb-0"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </div>
          );

        case "notifications":
          return (
            <div className="space-y-4">
              {field.children?.map((childField) => (
                <div key={childField.key}>
                  <Text className="font-medium">{childField.title}</Text>
                  {childField.description && (
                    <>
                      <br />
                      <Text className="text-gray-600 text-sm">
                        {childField.description}
                      </Text>
                    </>
                  )}
                  <div className="flex space-x-4 mt-2">
                    {childField.options?.map((option) => (
                      <Form.Item
                        key={String(option.value)}
                        name={`${field.key}_${childField.key}_${option.value}`}
                        className="mb-0"
                        valuePropName="checked"
                        initialValue={option.value === "email"}
                      >
                        <Checkbox defaultChecked={option.value === "email"}>
                          {option.label}
                        </Checkbox>
                      </Form.Item>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );

        default:
          return <Input {...commonProps} />;
      }
    },
    [
      formValues,
      handleAddPreQualifyingQuestion,
      handleDeletePreQualifyingQuestion,
      preQualifyingQuestions,
      handleWeightChange,
      form,
      handleValuesChange,
    ]
  );

  // Create collapse items using the new items prop
  const collapseItems: CollapseProps["items"] = config.map((field) => ({
    key: field.key,
    label: (
      <div className="flex items-center space-x-2">
        {getIcon(field.icon)}
        <span className="font-semibold text-lg">{field.title}</span>
      </div>
    ),
    children: (
      <div className="pt-4">
        {field.description && (
          <Text className="text-gray-600 mb-4 block">{field.description}</Text>
        )}

        <Form.Item
          name={field.key}
          rules={
            field.rules ||
            (field.required
              ? [{ required: true, message: `${field.title} is required` }]
              : [])
          }
          className="mb-0"
        >
          {renderField(field)}
        </Form.Item>
      </div>
    ),
  }));

  if (!isInitialized || config.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={formValues}
      >
        <Collapse
          activeKey={activeKeys}
          onChange={(keys) =>
            setActiveKeys(Array.isArray(keys) ? keys : [keys])
          }
          className="bg-white"
          expandIcon={({ isActive }) =>
            isActive ? <UpOutlined /> : <DownOutlined />
          }
          items={collapseItems}
        />

        {/* <div className="flex justify-end space-x-4 mt-6">
          <Button size="large">Cancel</Button>
          <Button
            type="primary"
            size="large"
            className="bg-green-500 border-green-500 hover:bg-green-600"
            onClick={handleSubmit}
          >
            Save Configuration
          </Button>
        </div> */}
      </Form>
    </div>
  );
};

export default DynamicFormComponent;
