const query = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }`;

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;
export type ContributionDay = { date: string; count: number; level: ContributionLevel };
export type Contributions = { total: number; weeks: ContributionDay[][] };

const levels: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// Fetched at build time. Without GITHUB_TOKEN (or on any failure) returns null so the section is omitted.
export async function getContributions(login: string): Promise<Contributions | null> {
  const token = (globalThis as any).process?.env?.GITHUB_TOKEN ?? import.meta.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[contributions] GITHUB_TOKEN not set; skipping contribution graph.');
    return null;
  }
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'portfolio-build' },
      body: JSON.stringify({ query, variables: { login } }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) throw new Error(JSON.stringify(json.errors ?? json));
    return {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((week: any) =>
        week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: levels[day.contributionLevel] ?? 0,
        })),
      ),
    };
  } catch (error) {
    console.warn('[contributions] Could not fetch contributions:', error);
    return null;
  }
}
