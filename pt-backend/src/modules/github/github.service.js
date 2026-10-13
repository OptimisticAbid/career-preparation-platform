import { findUsernameByUserId } from "./github.repository.js"

const getGithubUsername = async (userId) => {
    if (!userId) throw new Error("User ID is required");

    const username = await findUsernameByUserId(userId);
    if (!username) throw new Error("GitHub username not linked");
    return username;
};

const fetchGithubUser = async (username) => {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error(`GitHub API request failed: ${response.status}`);
    return response.json();
};

export const githubSyncService = async (userId) => {
    const username = await getGithubUsername(userId);
    const githubData = await fetchGithubUser(username);

    return {
        username: githubData.login,
        name: githubData.name,
        avatar_url: githubData.avatar_url,
        bio: githubData.bio,
        blog: githubData.blog,
        location: githubData.location,
        email: githubData.email,
        public_repos: githubData.public_repos,
        followers: githubData.followers,
        following: githubData.following
    }
}

export const githubStatsService = async (userId) => {
    const username = await getGithubUsername(userId);
    const githubData = await fetchGithubUser(username);

   return {
        username: githubData.login,
        public_repos: githubData.public_repos,
        followers: githubData.followers,
        following: githubData.following,
        url: githubData.html_url
   }
}
