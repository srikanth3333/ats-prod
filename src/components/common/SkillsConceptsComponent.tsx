import {
  BulbOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
}

interface Concept {
  id: string;
  name: string;
  difficulty: number;
  suggestions: string[];
  originalSuggestions: string[]; // Add this to track original suggestions
}

interface SkillsConceptsProps {
  availableSkills?: Skill[];
  defaultSelectedSkills?: Skill[];
  defaultAddedConcepts?: {
    // Add this new prop
    conceptName: string;
    parentConceptId: string;
    skill?: string;
  }[];
  skillSuggestions?: Record<string, string[]>;
  minSkills?: number;
  maxSkills?: number;
  onSkillsChange?: (skills: Skill[]) => void;
  onConceptsChange?: (
    concepts: Concept[],
    addedConcepts: {
      conceptName: string;
      parentConceptId: string;
      skill?: string;
    }[]
  ) => void;
  className?: string;
}

// Function to fetch AI suggestions from OpenAI
const fetchAISuggestions = async (skillName: string): Promise<string[]> => {
  try {
    const response = await fetch("/api/generate-suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skillName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch (error) {
    console.error("Error in fetchAISuggestions:", error);
    return getFallbackSuggestions(skillName);
  }
};

// Fallback suggestions when API fails
const getFallbackSuggestions = (skillName: string): string[] => {
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
    default: ["Basics", "Practice", "Projects", "Testing", "Documentation"],
  };

  const key = skillName.toLowerCase();
  return fallbackMap[key] || fallbackMap["default"];
};

const SkillsConceptsComponent: React.FC<SkillsConceptsProps> = ({
  availableSkills = [],
  defaultSelectedSkills = [],
  defaultAddedConcepts = [], // Add this
  skillSuggestions = {},
  minSkills = 1,
  maxSkills = 10,
  onSkillsChange,
  onConceptsChange,
  className = "",
}) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [addedConcepts, setAddedConcepts] = useState<any[]>([]);
  const [newConceptInputs, setNewConceptInputs] = useState<{
    [key: string]: string;
  }>({});
  const [initialized, setInitialized] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<{
    [key: string]: boolean;
  }>({});

  // Helper function to notify parent of all changes
  const notifyParent = useCallback(
    (
      newSkills?: Skill[],
      newConcepts?: Concept[],
      newAddedConcepts?: any[]
    ) => {
      const skillsToSend = newSkills !== undefined ? newSkills : selectedSkills;
      const conceptsToSend = newConcepts !== undefined ? newConcepts : concepts;
      const addedConceptsToSend =
        newAddedConcepts !== undefined ? newAddedConcepts : addedConcepts;

      if (onSkillsChange) {
        onSkillsChange(skillsToSend);
      }
      if (onConceptsChange) {
        onConceptsChange(conceptsToSend, addedConceptsToSend);
      }
    },
    [selectedSkills, concepts, addedConcepts, onSkillsChange, onConceptsChange]
  );

  // Function to fetch and update suggestions for a skill
  const fetchAndUpdateSuggestions = async (skill: Skill) => {
    setLoadingSuggestions((prev) => ({ ...prev, [skill.id]: true }));

    try {
      const aiSuggestions = await fetchAISuggestions(skill.name);

      if (aiSuggestions && aiSuggestions.length > 0) {
        // Update the concept with AI suggestions
        setConcepts((prevConcepts) =>
          prevConcepts.map((concept) =>
            concept.id === skill.id
              ? {
                  ...concept,
                  suggestions: [
                    ...concept.suggestions,
                    ...aiSuggestions.filter(
                      (suggestion) => !concept.suggestions.includes(suggestion)
                    ),
                  ],
                  originalSuggestions: [
                    ...concept.originalSuggestions,
                    ...aiSuggestions.filter(
                      (suggestion) =>
                        !concept.originalSuggestions.includes(suggestion)
                    ),
                  ],
                }
              : concept
          )
        );
      }
    } catch (error) {
      console.error(`Failed to fetch suggestions for ${skill.name}:`, error);
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [skill.id]: false }));
    }
  };

  // Initialize with default values
  useEffect(() => {
    if (!initialized && defaultSelectedSkills.length > 0) {
      setSelectedSkills(defaultSelectedSkills);

      // Create initial concepts for default selected skills
      const initialConcepts = defaultSelectedSkills.map((skill) => {
        const initialSuggestions = skillSuggestions[skill.name] || [];

        // Filter out suggestions that are already in defaultAddedConcepts
        const defaultConceptsForThisSkill = defaultAddedConcepts
          .filter((concept) => concept.parentConceptId === skill.id)
          .map((concept) => concept.conceptName);

        const filteredSuggestions = initialSuggestions.filter(
          (suggestion) => !defaultConceptsForThisSkill.includes(suggestion)
        );

        return {
          id: skill.id,
          name: skill.name,
          difficulty: 2,
          suggestions: [...filteredSuggestions],
          originalSuggestions: [...initialSuggestions], // Store original suggestions
        };
      });

      setConcepts(initialConcepts);
      setAddedConcepts(defaultAddedConcepts); // Set default added concepts
      setInitialized(true);

      // Notify parent immediately with default values
      setTimeout(() => {
        if (onSkillsChange) {
          onSkillsChange(defaultSelectedSkills);
        }
        if (onConceptsChange) {
          onConceptsChange(initialConcepts, defaultAddedConcepts); // Pass default added concepts
        }
      }, 0);

      // Fetch AI suggestions for default skills after a short delay
      setTimeout(() => {
        defaultSelectedSkills.forEach(async (skill) => {
          if (
            !skillSuggestions[skill.name] ||
            skillSuggestions[skill.name].length === 0
          ) {
            await fetchAndUpdateSuggestions(skill);
          }
        });
      }, 1000);
    }
  }, [
    defaultSelectedSkills,
    defaultAddedConcepts, // Add this dependency
    skillSuggestions,
    initialized,
    onSkillsChange,
    onConceptsChange,
  ]);

  const handleSkillAdd = async (skill: Skill): Promise<void> => {
    if (selectedSkills.length >= maxSkills) {
      alert(`You can select maximum ${maxSkills} skills`);
      return;
    }

    if (!selectedSkills.find((s) => s.id === skill.id)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);

      // Add concept for this skill if it doesn't exist
      const conceptExists = concepts.find((c) => c.name === skill.name);
      if (!conceptExists) {
        const initialSuggestions = skillSuggestions[skill.name] || [];
        const newConcept: Concept = {
          id: skill.id,
          name: skill.name,
          difficulty: 2,
          suggestions: [...initialSuggestions],
          originalSuggestions: [...initialSuggestions], // Store original suggestions
        };
        const newConcepts = [...concepts, newConcept];
        setConcepts(newConcepts);

        // Notify parent immediately
        notifyParent(newSkills, newConcepts, addedConcepts);

        // Fetch AI suggestions for the new skill after a short delay
        setTimeout(() => {
          fetchAndUpdateSuggestions(skill);
        }, 500);
      } else {
        // Notify parent of skills change only
        notifyParent(newSkills, concepts, addedConcepts);
      }
    }
  };

  const handleSkillRemove = (skillId: string): void => {
    const skillToRemove = selectedSkills.find((s) => s.id === skillId);
    const newSkills = selectedSkills.filter((s) => s.id !== skillId);
    setSelectedSkills(newSkills);

    if (skillToRemove) {
      const newConcepts = concepts.filter((c) => c.name !== skillToRemove.name);
      setConcepts(newConcepts);

      const skillSuggestionsToRemove =
        skillSuggestions[skillToRemove.name] || [];
      const newAddedConcepts = addedConcepts.filter(
        (concept) => !skillSuggestionsToRemove.includes(concept.conceptName)
      );
      setAddedConcepts(newAddedConcepts);

      setLoadingSuggestions((prev) => {
        const updated = { ...prev };
        delete updated[skillId];
        return updated;
      });

      notifyParent(newSkills, newConcepts, newAddedConcepts);
    } else {
      notifyParent(newSkills, concepts, addedConcepts);
    }
  };

  const handleConceptAdd = (conceptId: string, name: string): void => {
    const conceptName = newConceptInputs[conceptId];
    if (!conceptName || !conceptName.trim()) {
      alert("Please enter a concept name");
      return;
    }

    const existingConcept = addedConcepts.find(
      (c) => c.conceptName === conceptName.trim()
    );
    if (!existingConcept) {
      const newAddedConcepts = [
        ...addedConcepts,
        {
          conceptName: conceptName.trim(),
          parentConceptId: conceptId,
          skill: name,
        },
      ];
      setAddedConcepts(newAddedConcepts);
      notifyParent(selectedSkills, concepts, newAddedConcepts);
    }

    setNewConceptInputs((prev) => ({
      ...prev,
      [conceptId]: "",
    }));
  };

  const handleConceptRemove = (conceptId: string): void => {
    const conceptToRemove = concepts.find((c) => c.id === conceptId);
    const newConcepts = concepts.filter((c) => c.id !== conceptId);
    setConcepts(newConcepts);

    let newAddedConcepts = addedConcepts;
    let newSkills = selectedSkills;

    if (conceptToRemove) {
      const conceptSuggestionsToRemove =
        skillSuggestions[conceptToRemove.name] || [];
      newAddedConcepts = addedConcepts.filter(
        (concept) =>
          !conceptSuggestionsToRemove.includes(concept.conceptName) &&
          concept.parentConceptId !== conceptId
      );
      setAddedConcepts(newAddedConcepts);

      const relatedSkill = selectedSkills.find(
        (skill) => skill.name === conceptToRemove.name
      );
      if (relatedSkill) {
        newSkills = selectedSkills.filter(
          (skill) => skill.id !== relatedSkill.id
        );
        setSelectedSkills(newSkills);
      }
    }

    notifyParent(newSkills, newConcepts, newAddedConcepts);
  };

  const handleDifficultyChange = (conceptId: string, value: number): void => {
    const newConcepts = concepts.map((c) =>
      c.id === conceptId ? { ...c, difficulty: value } : c
    );
    setConcepts(newConcepts);
    notifyParent(selectedSkills, newConcepts, addedConcepts);
  };

  const handleSuggestionAdd = (
    conceptId: string,
    suggestion: string,
    name: string
  ): void => {
    // Remove suggestion from available suggestions
    const newConcepts = concepts.map((c) =>
      c.id === conceptId
        ? { ...c, suggestions: c.suggestions.filter((s) => s !== suggestion) }
        : c
    );
    setConcepts(newConcepts);

    // Add to added concepts
    const newAddedConcepts = [
      ...addedConcepts,
      { conceptName: suggestion, parentConceptId: conceptId, skill: name },
    ];
    setAddedConcepts(newAddedConcepts);

    notifyParent(selectedSkills, newConcepts, newAddedConcepts);
  };

  // FIXED: This function now properly restores suggestions
  const handleAddedConceptRemove = (conceptName: string): void => {
    const conceptToRemove = addedConcepts.find(
      (c) => c.conceptName === conceptName
    );

    // Remove from added concepts
    const newAddedConcepts = addedConcepts.filter(
      (c) => c.conceptName !== conceptName
    );
    setAddedConcepts(newAddedConcepts);

    let newConcepts = concepts;

    if (conceptToRemove) {
      const parentConcept = concepts.find(
        (c) => c.id === conceptToRemove.parentConceptId
      );

      if (parentConcept) {
        // Check if this concept was originally in suggestions (either from skillSuggestions or AI)
        const wasOriginalSuggestion =
          parentConcept.originalSuggestions.includes(conceptName);

        if (
          wasOriginalSuggestion &&
          !parentConcept.suggestions.includes(conceptName)
        ) {
          // Restore the suggestion back to available suggestions
          newConcepts = concepts.map((c) =>
            c.id === conceptToRemove.parentConceptId
              ? { ...c, suggestions: [...c.suggestions, conceptName] }
              : c
          );
          setConcepts(newConcepts);
        }
      }
    }

    notifyParent(selectedSkills, newConcepts, newAddedConcepts);
  };

  const getDifficultyLabel = (value: number): string => {
    const labels = ["Beginner", "Easy", "Moderate", "Hard", "Expert"];
    return labels[value - 1] || "Moderate";
  };

  const getDifficultyColor = (value: number): string => {
    const colors = ["#52c41a", "#73d13d", "#faad14", "#ff7a45", "#ff4d4f"];
    return colors[value - 1] || "#faad14";
  };

  const handleInputChange = (conceptId: string, value: string): void => {
    setNewConceptInputs((prev) => ({
      ...prev,
      [conceptId]: value,
    }));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    conceptId: string,
    name: string
  ): void => {
    if (e.key === "Enter") {
      handleConceptAdd(conceptId, name);
    }
  };

  const handleRangeChange = (
    conceptId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    handleDifficultyChange(conceptId, parseInt(e.target.value));
  };

  const availableSkillsToShow = availableSkills.filter(
    (skill) => !selectedSkills.find((s) => s.id === skill.id)
  );

  if (availableSkills.length === 0 && selectedSkills.length === 0) {
    return (
      <div className={`max-w-4xl mx-auto p-6 bg-white ${className}`}>
        <div className="text-center text-gray-500">
          No skills available. Please configure skills first.
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 bg-white ${className}`}>
      {/* Skills Selection Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BulbOutlined
            className="text-green-500"
            style={{ fontSize: "20px" }}
          />
          <h2 className="text-lg font-semibold text-gray-800">
            Select skills{" "}
            <span className="text-gray-500 font-normal">
              (Min. {minSkills}, Max. {maxSkills})
            </span>
          </h2>
        </div>

        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full text-sm"
              >
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>{skill.name}</span>
                {loadingSuggestions[skill.id] && (
                  <LoadingOutlined className="text-white ml-1" />
                )}
                <CloseOutlined
                  style={{ fontSize: "16px" }}
                  className="cursor-pointer hover:text-red-300 transition-colors ml-1"
                  onClick={() => handleSkillRemove(skill.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Available Skills */}
        {availableSkillsToShow.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {availableSkillsToShow.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSkillAdd(skill)}
              >
                <span>{skill.name}</span>
                <PlusOutlined style={{ fontSize: "16px" }} />
              </div>
            ))}
          </div>
        )}

        {selectedSkills.length < minSkills && (
          <p className="text-red-500 text-sm">
            Select at least {minSkills} skills
          </p>
        )}
      </div>

      {/* Add Concepts Section */}
      {concepts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Add Concepts
            </h2>
          </div>

          {/* Concept Cards */}
          <div className="space-y-4">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">
                      {concept.name}
                    </h3>
                    {loadingSuggestions[concept.id] && (
                      <div className="flex items-center gap-1 text-sm text-blue-500">
                        <LoadingOutlined />
                        <span>Getting AI suggestions...</span>
                      </div>
                    )}
                  </div>
                  <CloseOutlined
                    style={{ fontSize: "20px" }}
                    className="cursor-pointer text-gray-400 hover:text-red-500"
                    onClick={() => handleConceptRemove(concept.id)}
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Difficulty level:
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: getDifficultyColor(concept.difficulty) }}
                    >
                      {getDifficultyLabel(concept.difficulty)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={concept.difficulty}
                      onChange={(e) => handleRangeChange(concept.id, e)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${getDifficultyColor(
                          concept.difficulty
                        )} 0%, ${getDifficultyColor(concept.difficulty)} ${
                          (concept.difficulty - 1) * 25
                        }%, #e5e7eb ${
                          (concept.difficulty - 1) * 25
                        }%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add Concept"
                    value={newConceptInputs[concept.id] || ""}
                    onChange={(e) =>
                      handleInputChange(concept.id, e.target.value)
                    }
                    onKeyPress={(e) =>
                      handleKeyPress(e, concept.id, concept.name)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleConceptAdd(concept.id, concept.name)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <PlusOutlined style={{ fontSize: "16px" }} />
                    Add
                  </button>
                </div>

                {concept.suggestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      SUGGESTIONS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {concept.suggestions.map((suggestion) => (
                        <div
                          key={suggestion}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() =>
                            handleSuggestionAdd(
                              concept.id,
                              suggestion,
                              concept.name
                            )
                          }
                        >
                          <span>{suggestion}</span>
                          <PlusOutlined style={{ fontSize: "14px" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Added Concepts Section */}
                {(() => {
                  const relatedAddedConcepts = addedConcepts.filter(
                    (conceptObj) => conceptObj.parentConceptId === concept.id
                  );

                  return (
                    relatedAddedConcepts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          ADDED CONCEPTS
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {relatedAddedConcepts.map((conceptObj) => (
                            <div
                              key={conceptObj.conceptName}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
                            >
                              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  width="8"
                                  height="6"
                                  viewBox="0 0 8 6"
                                  fill="none"
                                >
                                  <path
                                    d="M1 3L2.5 4.5L7 0"
                                    stroke="white"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span>{conceptObj.conceptName}</span>
                              <CloseOutlined
                                style={{ fontSize: "14px" }}
                                className="cursor-pointer hover:text-red-300 transition-colors"
                                onClick={() =>
                                  handleAddedConceptRemove(
                                    conceptObj.conceptName
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsConceptsComponent;
