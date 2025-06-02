"use client";
import { updateRecord } from "@/app/dashboard/actions/common/update/action";
import {
  cities,
  countries,
  currency,
  employmentType,
  frequency,
  seniorityLevel,
  workplaceType,
} from "@/utils/constants";
import { DBName } from "@/utils/db-tables-names";
import { getLabel } from "@/utils/helpers";
import {
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const InterviewModal = ({ isOpen, onClose, interviewLink }: any) => {
  const router = useRouter();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(interviewLink);
  };

  const handleTryNow = () => {
    router.push(interviewLink);
  };

  const handleSendInvite = () => {
    console.log("Send invite clicked");
  };

  const handleViewInterview = () => {
    router.push("/dashboard/job-postings");
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width={500} centered>
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckOutlined className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          AI Interviewer is live!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Congratulations! Your interview is live now. You can now share
          <br />
          this interview with your candidates
        </p>
      </div>

      {/* Action Cards */}
      <div className="space-y-4 mb-8">
        {/* Try Interview Card */}
        {/* <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                <PlayCircleOutlined className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Try Interview</h3>
                <p className="text-sm text-gray-500">
                  Try this interview individually
                </p>
              </div>
            </div>
            <Button size="small" onClick={handleTryNow}>
              Try Now
            </Button>
          </div>
        </div> */}

        {/* Invite Candidates Card */}
        {/* <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                <SendOutlined className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Invite Candidates</h3>
                <p className="text-sm text-gray-500">
                  Invite your candidates to take this interview
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="small"
              onClick={handleSendInvite}
              className="bg-green-500 hover:bg-green-600 border-green-500"
            >
              Send Invite
            </Button>
          </div>
        </div> */}
      </div>

      {/* Interview Link Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Interview link</h3>
        <div className="flex items-center gap-2">
          <Input
            value={`http://localhost:3000/${interviewLink}`}
            readOnly
            className="flex-1 bg-gray-50"
          />
          <Button icon={<CopyOutlined />} onClick={handleCopyLink} />
        </div>
      </div>

      {/* View Interview Button */}
      <div className="flex justify-center">
        <Button
          type="text"
          onClick={handleViewInterview}
          className="text-gray-600 hover:text-gray-900"
          icon={<ArrowRightOutlined />}
        >
          View Interview
        </Button>
      </div>
    </Modal>
  );
};

const Review = ({ data, setCurrent, current, id }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = async (values: Record<string, any>) => {
    if (!id) {
      return;
    }
    const result: any = await updateRecord(DBName.jobs, id, {
      job_status: "draft",
    });
    console.log(result);
    if (result?.success) {
      setIsOpen(!isOpen);
    }
    return {
      ...result,
      error: result.error
        ? typeof result.error === "string"
          ? result.error
          : result.error.message || "Unknown error"
        : undefined,
    };
  };
  return (
    <div className="pb-20">
      <div className="flex gap-2 mt-4 items-start">
        <div className="bg-white shadow-md flex-3 rounded-xl">
          {/* Header */}
          <div className="bg-green-700 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{data?.role}</h1>
                <span className="bg-green-600 px-3 py-1 rounded text-sm font-medium">
                  FD123456
                </span>
                <div className="flex gap-3 mt-4">
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {/* <BriefcaseOutlined /> */}
                    {data?.experience} years
                  </span>
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                    {getLabel(seniorityLevel, data?.seniority_level)}
                  </span>
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                    {getLabel(employmentType, data?.emplyment_type)}
                  </span>
                </div>
              </div>
              <div className="text-green-200">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 9h6v6H9z" />
                  <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M1 15h6M17 9h6M17 15h6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="px-4 py-4 space-y-4 bg-gray-50 ">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  {/* <BriefcaseOutlined /> */}
                  <span className="text-sm">Workplace Type</span>
                </div>
                <p className="font-semibold">
                  {getLabel(workplaceType, data?.workplace_type)}
                </p>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <EnvironmentOutlined />
                  <span className="text-sm">Job Location</span>
                </div>
                <p className="font-semibold">
                  {getLabel(cities, data?.city)},{" "}
                  {getLabel(countries, data?.country)}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <DollarOutlined />
                  <span className="text-sm">Salary Range</span>
                </div>
                <p className="font-semibold">
                  {getLabel(currency, data?.currency)}
                  {data?.from_salary} - ₹{data?.to_salary} (
                  {getLabel(frequency, data?.frequency)})
                </p>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <ClockCircleOutlined />
                  <span className="text-sm">Assessment Expiry</span>
                </div>
                <p className="font-semibold">No Expiry</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">Job description</h2>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {data?.job_description}
            </p>

            {/* Skills Required */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Skills required</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {data?.skills_required?.map((record: any) => (
                  <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                    {record?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                {/* <BellOutlined className="text-yellow-500" /> */}
                <h3 className="text-lg font-bold">Notification</h3>
              </div>

              <div className="mb-4">
                <p className="font-medium mb-1">New candidate response</p>
                <p className="text-gray-600 text-sm">
                  Every time a candidate submits an assessment
                </p>
              </div>

              <div className="flex gap-6">
                <Checkbox disabled checked>
                  Email
                </Checkbox>
                <Checkbox disabled>Whatsapp</Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-xl p-4 mt-4 fixed bottom-0 left-0 right-0">
        <div className="flex justify-end gap-4 mt-4">
          <Button size="middle" onClick={() => setCurrent(current - 1)}>
            Previous
          </Button>
          <Button
            type="primary"
            size="middle"
            className="bg-green-500 border-green-500 hover:bg-green-600"
            onClick={handleSubmit}
          >
            Save Interview
          </Button>
        </div>
      </div>
      <InterviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        interviewLink={`/jobseeker/ai-interview/preview?interviewId=123`}
      />
    </div>
  );
};

export default Review;
