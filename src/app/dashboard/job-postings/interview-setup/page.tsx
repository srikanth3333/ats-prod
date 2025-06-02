"use client";
import Stepper from "@/components/common/Stepper";
import InterviewConfiguration from "@/components/features/job-postings/InterviewConfiguration";
import InterviewContext from "@/components/features/job-postings/InterviewContext";
import JobDescription from "@/components/features/job-postings/JobDescription";
import JobDetails from "@/components/features/job-postings/JobDetails";
import Review from "@/components/features/job-postings/Review";
import { useGetListById } from "@/hooks/use-get-list-by-id";
import { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const [current, setCurrent] = useState(0);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const { data, loading, error, refetch } = useGetListById<User>(
    "jobs",
    "*",
    search
  );

  const steps = [
    {
      title: "Job Description",
      content: (
        <JobDescription
          data={data}
          id={search}
          current={current}
          setCurrent={setCurrent}
          refetch={refetch}
        />
      ),
      description: "Add job description here",
    },
    {
      title: "Job Details",
      content: (
        <JobDetails
          data={data}
          id={search}
          current={current}
          setCurrent={setCurrent}
          loading={loading}
          refetch={refetch}
        />
      ),
      description: "Add job Details here",
    },
    {
      title: "Interview Context",
      content: (
        <InterviewContext
          data={data}
          id={search}
          current={current}
          setCurrent={setCurrent}
          loading={loading}
          refetch={refetch}
        />
      ),
      description: "Add Interview Context here",
    },
    {
      title: "Interview Configuration",
      content: (
        <InterviewConfiguration
          data={data}
          id={search}
          current={current}
          setCurrent={setCurrent}
          loading={loading}
          refetch={refetch}
        />
      ),
      description: "Add Interview Configuration here",
    },
    {
      title: "Review & Publish",
      content: (
        <Review
          data={data}
          id={search}
          current={current}
          setCurrent={setCurrent}
        />
      ),
      description: "Review and publish",
    },
  ];

  useEffect(() => {
    refetch();
  }, [current, setCurrent]);

  // if (loading) {
  //   return "loading please wait....";
  // }
  return (
    <div>
      <Stepper steps={steps} current={current} setCurrent={setCurrent} />
    </div>
  );
}

export default page;
