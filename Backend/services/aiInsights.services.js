const formatPeriodForAI = require("../utils/formatPeriodForAI")
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini (ensure env var GOOGLE_API_KEY is set)
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



function extractAIMessages(messages) {
    return messages.map(m => m.text);
}

function buildAIInput(systemInsights) {
    try {
        return {
            budgets: systemInsights.map(b => ({
                name: b.budgetName,
                period: formatPeriodForAI(b.periodStart, b.periodEnd),
                status: b.status,
                trend: b.trend,
                daysRemaining: b.daysRemaining,
                messages: extractAIMessages(b.messages)

            }))
        };
    } catch (error) {
        console.error("Failed to process data:", error);
        throw error;
    }

}

function buildUserPrompt(aiInput) {
    try {
        return `
Below are system-generated budget insights.

You are a financial assistant helping users understand their spending.

Below are system-generated budget insights.

Your task:
1. Write a short overall summary
2. Combine key insights across budgets
3. Suggest practical, non-judgmental tips

Rules:
- Use ONLY the information provided.
- Do NOT invent numbers, dates, or categories.
- Do NOT repeat messages verbatim.
- Combine similar insights into one.
- Be concise, calm, and supportive.
- Do not judge or scold the user.
- Tips must be optional suggestions, not commands.

You must respond ONLY in valid JSON
and strictly follow the given output schema.


Data:
${JSON.stringify(aiInput, null, 2)}

Respond strictly in the following JSON schema:
{
  "summary": "string",
  "highlights": ["string"],
  "tips": ["string"],
  "tone": "positive | neutral | warning"
}
`;
    } catch (error) {
        console.error("Failed to process data: ", error)
        throw (error)
    }

}

async function aiResponse(userPrompt) {
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash", // ✅ valid model
        });

        const result = await model.generateContent(userPrompt);
        let text = result.response.text();
        console.log('ai text', text)
        // ✅ Remove markdown fences if Gemini adds them
        text = text.replace(/```json|```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI response error:", error);
        return null; // graceful fallback
    }
}

module.exports.generateAIInsights = async (systemInsights) => {
    try {
        const aiInput = buildAIInput(systemInsights);
        const userPrompt = buildUserPrompt(aiInput);
        const aiInsight = await aiResponse(userPrompt)

        return aiInsight;
    } catch (error) {
        console.error("Failed to generate AI Insight: ", error)
        return null
    }


}