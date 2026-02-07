const formatPeriodForAI = require("../utils/formatPeriodForAI")
const {aiResponse} = require("../utils/aiResponse")

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