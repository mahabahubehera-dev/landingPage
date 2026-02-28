document.getElementById("shortsForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const topic = document.getElementById("topic").value;
    const format = document.getElementById("format").value;
    const category = document.getElementById("category").value;
    const refUrl = document.getElementById("refUrl").value;

    if (!topic) return alert("Please enter a core topic");

    const btn = e.target.querySelector("button");
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Analyzing & Generating...";

    try {
        const data = await window.AI_ENGINE.generateViralScript(topic, format, category, refUrl);
        displayResults(data);

        const taskPromises = data.segments.map(async (seg) => {
            const res = await window.AI_ENGINE.createVideoTask(seg.prompt, topic);
            return { id: seg.id, taskId: res.data?.taskId || res.taskId };
        });

        const taskInfos = await Promise.all(taskPromises);

        taskInfos.forEach(info => {
            if (info.taskId) {
                pollStatus(info.taskId, info.id);
            } else {
                updateStatusText(`Part ${info.id} failed to queue.`, info.id);
            }
        });

    } catch (err) {
        alert("Generation failed: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
});

async function pollStatus(taskId, segmentId) {
    let videoUrl = null;

    const poll = async () => {
        const res = await window.AI_ENGINE.getTaskResult(taskId);
        if (res.data?.successFlag === 1) {
            videoUrl = res.data.response?.resultUrls?.[0];
        } else if (res.data?.successFlag === 2 || res.data?.successFlag === 3) {
            updateStatusText("Failed", segmentId);
            return;
        }

        if (videoUrl) {
            updateGeneratedContent(videoUrl, segmentId);
        } else {
            setTimeout(poll, 5000);
        }
    };

    poll();
}

function updateStatusText(text, segmentId) {
    const statusMsg = document.querySelector(`#status-${segmentId}`);
    if (statusMsg) statusMsg.innerText = text;
}

function updateGeneratedContent(videoUrl, segmentId) {
    const container = document.querySelector(`#video-container-${segmentId}`);
    if (container) {
        container.innerHTML = `<video src="${videoUrl}" controls class="w-full h-full object-cover rounded-lg"></video>`;
    }
    const btn = document.querySelector(`#download-part-${segmentId}`);
    if (btn) {
        btn.onclick = () => window.open(videoUrl);
        btn.disabled = false;
        btn.innerText = "Download Part " + segmentId;
        btn.classList.remove("bg-zinc-800");
        btn.classList.add("bg-purple-600");
    }
}

function displayResults(data) {
    const results = document.getElementById("results");
    results.classList.remove("hidden");
    results.innerHTML = `
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl animate-slide-up">
            <h3 class="text-xl font-bold mb-4">🚀 Script Blueprint (32s)</h3>
            <div class="mb-6 pb-6 border-b border-zinc-800">
                <span class="text-xs text-purple-400 font-bold uppercase tracking-wider">Title (CTR Optimized)</span>
                <div class="flex justify-between items-center mt-1">
                    <p class="text-white font-medium">${data.title}</p>
                    <button onclick="navigator.clipboard.writeText('${data.title}')" class="text-xs text-zinc-500 hover:text-white">Copy</button>
                </div>
            </div>
            <div class="space-y-4">
                ${data.segments.map(seg => `
                    <div>
                        <span class="text-xs text-purple-400 font-bold uppercase tracking-wider">Part ${seg.id} (8s)</span>
                        <p class="text-zinc-300 mt-1 text-sm leading-relaxed">${seg.script}</p>
                    </div>
                `).join('')}
                <div class="pt-4 border-t border-zinc-800">
                    <span class="text-xs text-purple-400 font-bold uppercase tracking-wider">Caption & Hashtags</span>
                    <p class="text-zinc-400 mt-1 text-sm">${data.caption}</p>
                </div>
            </div>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl animate-slide-up" style="animation-delay: 0.1s">
            <h3 class="text-xl font-bold mb-4">🎬 4-Part Video Rendering</h3>
            <div class="grid grid-cols-2 gap-3 mb-6">
                ${data.segments.map(seg => `
                    <div class="flex flex-col gap-2">
                        <div id="video-container-${seg.id}" class="aspect-[9/16] bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800/50 overflow-hidden">
                            <div class="text-center p-2">
                                <div class="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p id="status-${seg.id}" class="text-zinc-500 transition-all text-[10px]">Part ${seg.id} Rendering...</p>
                            </div>
                        </div>
                        <button id="download-part-${seg.id}" disabled class="w-full bg-zinc-800 text-white font-bold py-2 rounded-lg text-xs transition-all opacity-50 cursor-not-allowed">Wait...</button>
                    </div>
                `).join('')}
            </div>
            <p class="text-zinc-500 text-xs text-center">Merge these 4 clips in CapCut or Premiere for the full 32s Short.</p>
        </div>
    `;
    results.scrollIntoView({ behavior: "smooth" });
}
