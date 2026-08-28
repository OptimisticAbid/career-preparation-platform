import { eq } from "drizzle-orm"
import { db } from "../../db/index.js"
import { profiles } from "../../db/schema/profiles.schema.js"

export const githubSyncService = async (userId) => {
    if(!userId) {
        throw new Error("user Id does not exist")
    }

    const [profile] = await db.select({
            githubUsername : profiles.githubUsername
    })
        .from(profiles).where(eq(profiles.userId, userId))

    if(!profile?.githubUsername) {
        throw new Error("Github username not linked")
    }

    const response = await fetch(
        `https://api.github.com/users/${profile.githubUsername}`
    )

    const githubData = await response.json()

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
    if(!userId) {
        throw new Error("user Id does not exist")
    }

    const [profile] = await db.select({
            githubUsername : profiles.githubUsername
    })
        .from(profiles).where(eq(profiles.userId, userId))

    if(!profile?.githubUsername) {
        throw new Error("Github username not linked")
    }

    const response = await fetch(
        `https://api.github.com/users/${profile.githubUsername}`
    )

   const githubData = await response.json()

   return {
        username: githubData.login,
        public_repos: githubData.public_repos,
        followers: githubData.followers,
        following: githubData.following,
        url: githubData.html_url
   }
}
