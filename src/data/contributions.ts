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

const dayMs = 86_400_000;

export function summarize({ weeks }: Contributions) {
  const days = weeks.flat();
  const dayNumber = (date: string) => Math.round(Date.parse(date) / dayMs);
  let longest = 0;
  let run = 0;
  let previous = -Infinity;
  for (const day of days) {
    const n = dayNumber(day.date);
    run = day.count > 0 ? (n - previous === 1 && run > 0 ? run + 1 : 1) : 0;
    if (day.count > 0) previous = n;
    longest = Math.max(longest, run);
  }
  // Current streak: walk back from the latest day; today may still be empty.
  let current = 0;
  let index = days.length - 1;
  if (days[index] && days[index].count === 0) index -= 1;
  while (index >= 0 && days[index].count > 0) {
    current += 1;
    index -= 1;
  }
  const busiest = days.reduce((best, day) => (day.count > best.count ? day : best), days[0]);
  const activeDays = days.filter((day) => day.count > 0).length;
  // Month labels sit above the first week that starts in a new month.
  const months: { column: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, column) => {
    const date = new Date(`${week[0].date}T00:00:00Z`);
    const month = date.getUTCMonth();
    if (month !== lastMonth && column < weeks.length - 1) {
      months.push({ column, label: date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) });
    }
    lastMonth = month;
  });
  return { current, longest, busiest, activeDays, months };
}
