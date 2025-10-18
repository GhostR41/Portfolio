import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Plus, Trash2, Github, Code2 } from "lucide-react";
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface GitHubData {
  month: string;
  repos: number;
}

interface CodingData {
  platform: string;
  questions: number;
}

const defaultGitHubData: GitHubData[] = [
  { month: "Oct 2023", repos: 2 },
  { month: "Jan 2024", repos: 3 },
  { month: "Apr 2024", repos: 4 },
  { month: "Jul 2024", repos: 5 },
  { month: "Oct 2024", repos: 6 },
  { month: "Jan 2025", repos: 8 },
  { month: "Apr 2025", repos: 10 },
  { month: "Jul 2025", repos: 12 },
];

const defaultCodingData: CodingData[] = [
  { platform: "LeetCode", questions: 23 },
  { platform: "GeeksForGeeks", questions: 4 },
  { platform: "HackerRank", questions: 20 },
  { platform: "InterviewBit", questions: 0 },
];

export function EditableChart() {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [githubData, setGithubData] = useState<GitHubData[]>(defaultGitHubData);
  const [codingData, setCodingData] = useState<CodingData[]>(defaultCodingData);

  useEffect(() => {
    const savedGithub = localStorage.getItem('github_chart_data');
    const savedCoding = localStorage.getItem('coding_chart_data');
    if (savedGithub) setGithubData(JSON.parse(savedGithub));
    if (savedCoding) setCodingData(JSON.parse(savedCoding));
  }, []);

  useEffect(() => {
    localStorage.setItem('github_chart_data', JSON.stringify(githubData));
    syncContent('github_chart_data', githubData);
    setHasUnsavedChanges(true);
  }, [githubData, setHasUnsavedChanges, syncContent]);

  useEffect(() => {
    localStorage.setItem('coding_chart_data', JSON.stringify(codingData));
    syncContent('coding_chart_data', codingData);
    setHasUnsavedChanges(true);
  }, [codingData, setHasUnsavedChanges, syncContent]);

  const updateGithubPoint = (index: number, field: 'month' | 'repos', value: string) => {
    const newData = [...githubData];
    if (field === 'repos') {
      newData[index][field] = parseInt(value) || 0;
    } else {
      newData[index][field] = value;
    }
    setGithubData(newData);
  };

  const updateCodingPoint = (index: number, field: 'platform' | 'questions', value: string) => {
    const newData = [...codingData];
    if (field === 'questions') {
      newData[index][field] = parseInt(value) || 0;
    } else {
      newData[index][field] = value;
    }
    setCodingData(newData);
  };

  const addGithubPoint = () => {
    setGithubData([...githubData, { month: 'New', repos: 0 }]);
  };

  const addCodingPoint = () => {
    setCodingData([...codingData, { platform: 'New', questions: 0 }]);
  };

  const removeGithubPoint = (index: number) => {
    setGithubData(githubData.filter((_, i) => i !== index));
  };

  const removeCodingPoint = (index: number) => {
    setCodingData(codingData.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GitHub Timeline Chart */}
      <div className="tactical-border rounded bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">GITHUB REPO TIMELINE (2 YEARS)</h3>
          </div>
          {isEditMode && (
            <Button onClick={addGithubPoint} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Point
            </Button>
          )}
        </div>

        {isEditMode && (
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {githubData.map((point, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={point.month}
                  onChange={(e) => updateGithubPoint(index, 'month', e.target.value)}
                  className="flex-1"
                  placeholder="Month"
                />
                <Input
                  type="number"
                  value={point.repos}
                  onChange={(e) => updateGithubPoint(index, 'repos', e.target.value)}
                  className="w-24"
                  placeholder="Repos"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGithubPoint(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={githubData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))" 
              style={{ fontSize: '10px', fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              style={{ fontSize: '12px', fontFamily: 'monospace' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="repos" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Coding Platform Questions Chart */}
      <div className="tactical-border rounded bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">CODING PLATFORM QUESTIONS</h3>
          </div>
          {isEditMode && (
            <Button onClick={addCodingPoint} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Platform
            </Button>
          )}
        </div>

        {isEditMode && (
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {codingData.map((point, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={point.platform}
                  onChange={(e) => updateCodingPoint(index, 'platform', e.target.value)}
                  className="flex-1"
                  placeholder="Platform"
                />
                <Input
                  type="number"
                  value={point.questions}
                  onChange={(e) => updateCodingPoint(index, 'questions', e.target.value)}
                  className="w-24"
                  placeholder="Questions"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCodingPoint(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={codingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.1)" />
            <XAxis 
              dataKey="platform" 
              stroke="hsl(var(--muted-foreground))" 
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              style={{ fontSize: '12px', fontFamily: 'monospace' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="questions" 
              fill="hsl(var(--primary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
