import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN!;

const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

// GET /api/github/repos/:owner/:repo - Get repository information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'info';

    const { owner, repo } = await params;

    switch (endpoint) {
      case 'info':
        const { data: repoData } = await octokit.repos.get({
          owner,
          repo,
        });
        return NextResponse.json(repoData);

      case 'releases':
        const { data: releases } = await octokit.repos.listReleases({
          owner,
          repo,
          per_page: 10,
        });
        return NextResponse.json(releases);

      case 'issues':
        const { data: issues } = await octokit.issues.listForRepo({
          owner,
          repo,
          state: 'open',
          per_page: 20,
        });
        return NextResponse.json(issues);

      case 'contributors':
        const { data: contributors } = await octokit.repos.listContributors({
          owner,
          repo,
          per_page: 10,
        });
        return NextResponse.json(contributors);

      case 'readme':
        try {
          const { data: readme } = await octokit.repos.getReadme({
            owner,
            repo,
          });
          // Decode base64 content
          const content = Buffer.from(readme.content, 'base64').toString('utf-8');
          return NextResponse.json({
            ...readme,
            content,
          });
        } catch {
          return NextResponse.json({ error: 'README not found' }, { status: 404 });
        }

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('GitHub API error:', error);

    const errorObj = error as { status?: number }; // Type assertion for error handling

    if (errorObj?.status === 404) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    if (errorObj?.status === 403) {
      return NextResponse.json({ error: 'Access forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'GitHub API error' }, { status: 500 });
  }
}
