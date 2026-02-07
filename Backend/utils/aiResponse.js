const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini (ensure env var GOOGLE_API_KEY is set)
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function aiResponse(userPrompt) {
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash", // ✅ valid model
        });

        const result = await model.generateContent(userPrompt);
        let text = result.response.text();
        
        // ✅ Remove markdown fences if Gemini adds them
        text = text.replace(/```json|```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI response error:", error);
        return null; // graceful fallback
    }
}

module.exports = {aiResponse}