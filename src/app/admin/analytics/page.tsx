import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { Separator } from "@/components/shadcnui/separator";
import {
  DailyTrafficChart,
  DevicesChart,
} from "@/components/admin/AnalyticsCharts";
import { getAnalytics, type RangeKey } from "@/server/analytics/stats";

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  BD: "Bangladesh",
  PK: "Pakistan",
  AE: "UAE",
  SG: "Singapore",
  JP: "Japan",
  CA: "Canada",
  AU: "Australia",
};

function countryLabel(code: string | null): string {
  if (!code) return "Unknown";
  if (code === "Local") return "Local network";
  return COUNTRY_NAMES[code] ?? code;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

export default async function AnalyticsPage({
  searchParams,
}: PageProps<"/admin/analytics">) {
  const params = await searchParams;
  const rangeParam = params.range;
  const range: RangeKey =
    rangeParam === "7d" || rangeParam === "90d" ? rangeParam : "30d";

  const data = await getAnalytics(range);

  const stats = [
    { label: "Unique visitors", value: String(data.uniqueVisitors) },
    { label: "Pageviews", value: String(data.pageviews) },
    { label: "Avg. time on site", value: formatDuration(data.avgDurationSec) },
    { label: "All-time visitors", value: String(data.totalVisitorsAllTime) },
  ];

  const ranges: RangeKey[] = ["7d", "30d", "90d"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Visitors, countries and time spent. Raw rows are pruned after 90
            days.
          </p>
        </div>
        <div className="border-border flex overflow-hidden rounded-md border">
          {ranges.map((key) => (
            <a
              key={key}
              href={`/admin/analytics?range=${key}`}
              className={
                key === range ?
                  "bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium"
                : "hover:bg-muted px-3 py-1.5 text-xs font-medium"
              }>
              {key === "7d" ?
                "Last 7 days"
              : key === "30d" ?
                "Last 30 days"
              : "Last 90 days"}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyTrafficChart data={data.daily} />
          <p className="text-muted-foreground mt-2 text-xs">
            Last {Math.min(30, data.daily.length)} days by pageviews and
            visitors
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {data.countries.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{countryLabel(row.name)}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                  </TableRow>
                ))}
                {data.countries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>No visits in range.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top pages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {data.pages.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="max-w-52 truncate">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                  </TableRow>
                ))}
                {data.pages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>No pageviews in range.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {data.referrers.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="max-w-52 truncate">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                  </TableRow>
                ))}
                {data.referrers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>No referrers yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <DevicesChart data={data.devices} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Landing page</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Time spent</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{countryLabel(session.country)}</TableCell>
                  <TableCell className="max-w-40 truncate">
                    {session.landingPath}
                  </TableCell>
                  <TableCell>{session.device ?? "unknown"}</TableCell>
                  <TableCell>{formatDuration(session.durationSec)}</TableCell>
                  <TableCell>
                    {new Date(session.startedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {data.recentSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    No sessions yet - visit the public site to see data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
