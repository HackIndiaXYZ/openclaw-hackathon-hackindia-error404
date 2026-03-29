import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// Model configuration
export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are 'Nexus AI' — the official intelligent assistant for EduSync, a peer-to-peer skill-sharing platform for Indian university students.
  
  CONTEXT:
  - We operate on a 'Karma Economy' (no money).
  - Users earn Karma by teaching skills or uploading verified academic resources.
  - Users spend Karma to learn from mentors or unlock files in the 'Vault'.
  - We have a 'Nexus Mode' for inter-campus discovery across 5 partner nodes: NIT-N, DEU, VCST, ITU, and SIAS.
  - You help users find mentors, resources, and explain platform mechanics.

  UNRESTRICTED MISSION:
  - Be supportive, knowledgeable, and proactive.
  - If a user asks for a recommendation, and you have mock data context (passed in prompts), prioritize recommending those specific skills/resources.
  - Always encourage institutional integrity and the 'Honor Code'.
  - Use college-appropriate, professional yet friendly tone (Engineering/Campus vibes).

  IMPORTANT:
  - If the user's VITE_GEMINI_API_KEY is missing, gracefully inform them that the 'Nexus Neural Link' is currently offline.`,
});

/**
 * Get AI-powered recommendations for a user
 * @param {Object} userProfile - The current user's profile
 * @param {Array} skills - List of available skills
 * @param {Array} resources - List of available resources
 */
export async function getRecommendations(userProfile, skills, resources) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return { error: "API Key missing" };
  }

  const prompt = `Analyze this student profile and recommend exactly 2 skills and 1 source from the lists provided.
  
  STUDENT PROFILE:
  - Name: ${userProfile.full_name}
  - Major: ${userProfile.department}
  - Learning Goals: ${userProfile.skills_to_learn?.join(', ')}
  - Current Karma: ${userProfile.karma_balance}
  
  AVAILABLE SKILLS:
  ${JSON.stringify(skills)}
  
  AVAILABLE RESOURCES:
  ${JSON.stringify(resources)}
  
  Return your response in this EXACT JSON format (no other text):
  {
    "recommendations": [
      { "type": "skill", "id": "...", "reason": "why this matches their goals" },
      { "type": "resource", "id": "...", "reason": "why this helps their major" }
    ],
    "brief_insight": "A 1-sentence motivational insight based on their specific goals."
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Pre-process in case Gemini adds markdown blocks
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return { error: "Failed to generate AI recommendations." };
  }
}
