const KIE_API_KEY = "90679e35c5dbf452cbe5aae8caff6469";
const KIE_VEO_GENERATE_ENDPOINT = "https://api.kie.ai/api/v1/veo/generate";
const KIE_VEO_RECORD_ENDPOINT = "https://api.kie.ai/api/v1/veo/record-info";

async function generateViralScript(topic, format, category, refUrl) {
    // 32-Second Retention Formula (Split into 4x8s)
    return {
        title: "HOW " + topic.toUpperCase() + " CHANGES EVERYTHING IN 2024",
        segments: [
            { id: 1, prompt: `Part 1: Hook. [0-8s] Stop scrolling. If you care about ${topic}, you need to hear this. Visual: Captivating opening.`, script: `Stop scrolling. If you care about ${topic}, you need to hear this.` },
            { id: 2, prompt: `Part 2: Problem. [8-16s] Most people think it is about luck, but the truth is far more interesting. Visual: Data points and frustration.`, script: `Most people think it is about luck, but the truth is far more interesting.` },
            { id: 3, prompt: `Part 3: Value. [16-24s] Here is the step-by-step breakdown. First, you notice the pattern. Then, you exploit it. Visual: Success formula.`, script: `Here is the step-by-step breakdown. First, you notice the pattern. Then, you exploit it.` },
            { id: 4, prompt: `Part 4: Loop. [24-32s] This is why 1% succeed. Check the link for the full secret. Watch this again. Visual: Loop transition.`, script: `This is why 1% succeed. Check the link for the full secret. Watch this again.` }
        ],
        caption: "#" + category.split("&")[0].trim() + " #Success #LongerShorts"
    };
}

async function createVideoTask(segmentPrompt, topic) {
    try {
        const response = await fetch(KIE_VEO_GENERATE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${KIE_API_KEY}`
            },
            body: JSON.stringify({
                "prompt": `Cinematic YouTube Shorts clip. ${segmentPrompt}. High retention visuals. Fast cuts. 9:16 aspect ratio.`,
                "model": "veo3_fast",
                "aspectRatio": "9:16",
                "generationType": "TEXT_2_VIDEO",
                "enableFallback": false,
                "enableTranslation": true
            })
        });
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
            throw new Error(result.msg || result.message || "API Error");
        }
        return result;
    } catch (e) {
        console.error("Veo Video Task Error:", e);
        return { error: e.message };
    }
}

async function getTaskResult(taskId) {
    try {
        const response = await fetch(`${KIE_VEO_RECORD_ENDPOINT}?taskId=${taskId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${KIE_API_KEY}`
            }
        });
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
            throw new Error(result.msg || result.message || "API Error");
        }
        return result;
        /* 
        Expected format: 
        { 
            code: 200, 
            data: { 
                successFlag: 1 (1: Success, 0: Generating, 2/3: Failed),
                response: { resultUrls: [...] }
            } 
        }
        */
    } catch (e) {
        console.error("Veo Poll Error:", e);
        return { error: e.message };
    }
}

window.AI_ENGINE = { generateViralScript, createVideoTask, getTaskResult };
