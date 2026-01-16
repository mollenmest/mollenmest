export const INSTAGRAM_HOSTNAME = "www.instagram.com";
export const UNFOLLOWERS_PER_PAGE = 50;
export const WHITELISTED_RESULTS_STORAGE_KEY = "iu_whitelisted-results";
export const WITHOUT_PROFILE_PICTURE_URL_ID = "44884218_345707102882519_2446069589734326272_n";

export const DEFAULT_TIMINGS = {
  timeBetweenSearchCycles: 1000,
  timeToWaitAfterFiveSearchCycles: 10000,
  timeBetweenUnfollows: 4000,
  timeToWaitAfterFiveUnfollows: 300000,
};

// Mock Data for Demo
const MOCK_USERS = Array.from({ length: 150 }).map((_, i) => ({
  id: `user-${i}`,
  username: `user_${i + 1}`,
  full_name: `User Name ${i + 1}`,
  profile_pic_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  is_verified: Math.random() > 0.9,
  is_private: Math.random() > 0.7,
  follows_viewer: Math.random() > 0.8, // 20% don't follow back (approx)
  followed_by_viewer: true,
}));

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCookie = (name) => {
  // Mock cookie for demo
  if (name === 'csrftoken') return 'mock-csrf-token';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Generator for fetching followers (Mocked)
export async function* fetchFollowersGenerator() {
    // In a real app, this would fetch pages from Instagram API
    const batchSize = 50;
    const total = MOCK_USERS.length;
    let fetched = 0;

    while (fetched < total) {
        await sleep(500); // Simulate network delay
        const batch = MOCK_USERS.slice(fetched, fetched + batchSize);
        fetched += batch.length;

        yield {
            data: {
                user: {
                    edge_follow: {
                        count: total,
                        page_info: {
                            has_next_page: fetched < total,
                            end_cursor: fetched < total ? "cursor" : null
                        },
                        edges: batch.map(u => ({ node: u }))
                    }
                }
            }
        };
    }
}

// Unfollow user (Mocked)
export async function unfollowUser(userId) {
    await sleep(1000); // Simulate network request
    // Randomly fail sometimes for realism
    if (Math.random() > 0.95) {
        throw new Error("Network error");
    }
    return { status: "ok" };
}

export const getUsersForDisplay = (results, whitelistedResults, currentTab, searchTerm, filter) => {
  const whitelistIds = new Set(whitelistedResults.map(u => u.id));

  return results.filter(user => {
    // Tab logic
    const isWhitelisted = whitelistIds.has(user.id);
    if (currentTab === "non_whitelisted" && isWhitelisted) return false;
    if (currentTab === "whitelisted" && !isWhitelisted) return false;

    // Filter logic
    if (!filter.showPrivate && user.is_private) return false;
    if (!filter.showVerified && user.is_verified) return false;
    if (!filter.showFollowers && user.follows_viewer) return false;
    if (!filter.showNonFollowers && !user.follows_viewer) return false;

    // Search logic
    const term = searchTerm.toLowerCase();
    const matchesSearch = user.username.toLowerCase().includes(term) ||
                          user.full_name.toLowerCase().includes(term);

    return matchesSearch;
  });
};

export const copyListToClipboard = async (users) => {
    const text = users.map(u => u.username).join('\n');
    await navigator.clipboard.writeText(text);
};
