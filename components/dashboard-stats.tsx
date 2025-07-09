import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Eye, Mail } from "lucide-react";

const stats = [
  {
    label: "Website Traffic",
    value: "12,345",
    icon: Eye,
  },
  {
    label: "Newsletter Subscribers",
    value: "1,234",
    icon: Mail,
  },
  {
    label: "Blog Readers",
    value: "3,210",
    icon: Users,
  },
  {
    label: "Featured Posts",
    value: "5",
    icon: Star,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 