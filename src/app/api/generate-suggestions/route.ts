// app/api/generate-suggestions/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback suggestions function
function getFallbackSuggestions(skillName: string): string[] {
  const fallbackMap: Record<string, string[]> = {
    javascript: [
      "Variables",
      "Functions",
      "DOM Events",
      "Async/Await",
      "Objects",
    ],
    react: ["Components", "JSX", "Hooks", "State", "Props"],
    python: ["Syntax", "Functions", "Lists", "Loops", "Classes"],
    nodejs: ["Express", "NPM", "Modules", "HTTP", "File System"],
    css: ["Selectors", "Flexbox", "Grid", "Animations", "Responsive"],
    html: ["Tags", "Forms", "Semantic", "Attributes", "DOM"],
    typescript: ["Types", "Interfaces", "Generics", "Classes", "Modules"],
    sql: ["Queries", "Joins", "Tables", "Indexes", "Functions"],
    git: ["Commits", "Branches", "Merge", "Push", "Pull"],
    java: ["Classes", "Objects", "Methods", "Inheritance", "Collections"],
    "c++": ["Pointers", "Classes", "STL", "Memory", "Templates"],
    php: ["Syntax", "Arrays", "Functions", "Classes", "Database"],
    swift: ["Variables", "Functions", "Classes", "Protocols", "Optionals"],
    kotlin: [
      "Classes",
      "Functions",
      "Coroutines",
      "Null Safety",
      "Collections",
    ],
    go: ["Goroutines", "Channels", "Structs", "Interfaces", "Packages"],
    rust: ["Ownership", "Borrowing", "Structs", "Enums", "Traits"],
    default: ["Basics", "Practice", "Projects", "Testing", "Documentation"],
  };

  const key = skillName.toLowerCase();
  return fallbackMap[key] || fallbackMap["default"];
}

// Helper function to clean suggestions
const cleanSuggestion = (suggestion: string): string => {
  return (
    suggestion
      .trim()
      // Remove all types of quotes
      .replace(/^["'`""'']+|["'`""'']+$/g, "")
      .replace(/["""'''```]/g, "")
      // Remove dots and commas
      .replace(/^\.|\.$/g, "")
      .replace(/,$/g, "")
      // Remove any remaining special characters at start/end
      .replace(/^[^\w\s]+|[^\w\s]+$/g, "")
      .trim()
  );
};

export async function POST(request: NextRequest) {
  try {
    const { skillName }: { skillName: string } = await request.json();

    if (!skillName) {
      return Response.json(
        { message: "Skill name is required" },
        { status: 400 }
      );
    }

    console.log("Fetching suggestions for skill:", skillName);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates short learning topics for technical skills. Generate exactly 5 very short and simple learning topics (maximum 2-3 words each) that someone should focus on to learn the given skill. Return only a clean JSON array of strings without any quotes around the individual items, no additional explanation.",
        },
        {
          role: "user",
          content: `Generate exactly 5 short learning topics for the skill: ${skillName}. Each topic should be maximum 2-3 words. Return as: ["Variables", "Functions", "Loops", "Events", "APIs"] - clean words without extra quotes or punctuation.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    console.log("OpenAI response:", content);

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Try to parse the JSON response
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(content);

      if (!Array.isArray(suggestions)) {
        throw new Error("Response is not an array");
      }

      // Clean and filter suggestions
      suggestions = suggestions
        .map((suggestion: string) => cleanSuggestion(suggestion))
        .filter((suggestion: string) => {
          const wordCount = suggestion
            .split(" ")
            .filter((word) => word.length > 0).length;
          return wordCount <= 3 && suggestion.length > 0 && suggestion !== "";
        })
        .slice(0, 5);
    } catch (parseError) {
      console.log(
        "JSON parsing failed, trying to extract from text:",
        parseError
      );

      suggestions = content
        .split(/[\n,]/) // Split by newlines or commas
        .map((line: string) => cleanSuggestion(line))
        .filter((line: string) => {
          const wordCount = line
            .split(" ")
            .filter((word) => word.length > 0).length;
          return wordCount <= 3 && line.length > 0 && line !== "";
        })
        .slice(0, 5);
    }

    // If we don't have 5 suggestions, fill with fallbacks
    if (suggestions.length < 5) {
      const fallbacks = getFallbackSuggestions(skillName);
      suggestions = [...suggestions, ...fallbacks].slice(0, 5);
    }

    console.log("Final suggestions:", suggestions);

    return Response.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);

    // Return fallback suggestions on error
    const fallbackSuggestions = getFallbackSuggestions(
      typeof error === "object" && error !== null && "skillName" in error
        ? (error as any).skillName
        : "default"
    );

    return Response.json({
      suggestions: fallbackSuggestions,
      message: "Using fallback suggestions due to API error",
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
