const LEETCODE_API = "https://alfa-leetcode-api.onrender.com";

const fetchJson = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`LeetCode API request failed: ${response.status}`);
    }

    return response.json();
};

export const fetchUserSubmissions = async (username) => {
    const data = await fetchJson(`${LEETCODE_API}/${username}/acSubmission`);
    return Array.isArray(data?.submission) ? data.submission : [];
};

export const fetchProblemDetails = async (titleSlug) => {
    const data = await fetchJson(`${LEETCODE_API}/select?titleSlug=${titleSlug}`);
    return data;
};

export const fetchAllStats = async (username) => {
    const [profile, solved, badges] = await Promise.all([
        fetchJson(`${LEETCODE_API}/${username}`).catch(() => null),
        fetchJson(`${LEETCODE_API}/${username}/solved`).catch(() => null),
        fetchJson(`${LEETCODE_API}/${username}/badges`).catch(() => []),
    ]);

    return {
        profile,
        stats: solved,
        badges,
    };
};
