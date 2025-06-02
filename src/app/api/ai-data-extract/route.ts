// app/api/extract-jd/route.ts

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { jd } = await req.json();

  if (!jd) {
    return NextResponse.json(
      { error: "Job description is required" },
      { status: 400 }
    );
  }

  const prompt = `
                    You are a helpful AI that extracts structured data from job descriptions.

                    Extract the following fields from the given job description. If a field is not found, leave it as an empty string or null. 
                    Also return a skills array with gieven job description related job field.
                    For "job_description_ai", return the following content and always share as string dont share as object:
                    - A summary paragraph of the role.
                    - A section titled **"Roles and Responsibilities"** in a bullet list.
                    - A section titled **"Requirements"** in a bullet list (if applicable).
                    Return data in the following JSON format, without markdown or code block:

                    {
                      "role": "",
                      "experience": "",
                      "seniority_level": "",
                      "emplyment_type": "",
                      "workplace_type": "",
                      "country": "",
                      "city": "",
                      "currency": "",
                      "from_salary": "",
                      "to_salary": "",
                      "frequency": "",
                      "compensation": "",
                      "job_description_ai": "",
                      "skills_required": []
                    }

                    Job Description:
                    """ 
                    ${jd}
                    """
                    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  let result = completion.choices[0]?.message?.content || "";
  result = result.trim();
  if (result.startsWith("```")) {
    result = result
      .replace(/```(?:json)?\n?/, "")
      .replace(/```$/, "")
      .trim();
  }

  try {
    const json = JSON.parse(result);
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse JSON", raw: result },
      { status: 500 }
    );
  }
}
