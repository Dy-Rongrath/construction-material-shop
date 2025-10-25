import { NextRequest, NextResponse } from 'next/server';
import { Webhooks } from '@octokit/webhooks';

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

// Initialize webhooks with secret
const webhooks = new Webhooks({
  secret: GITHUB_WEBHOOK_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';
    const event = request.headers.get('x-github-event') || '';

    // Verify webhook signature
    const verified = await webhooks.verify(body, signature);

    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Handle different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(payload);
        break;

      case 'pull_request':
        await handlePullRequestEvent(payload);
        break;

      case 'release':
        await handleReleaseEvent(payload);
        break;

      case 'issues':
        await handleIssueEvent(payload);
        break;

      case 'deployment':
        await handleDeploymentEvent(payload);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Webhook event handlers - using 'any' for payload since GitHub webhook payloads have complex, varying structures
/* eslint-disable @typescript-eslint/no-explicit-any */

async function handlePushEvent(payload: any) {
  console.log('Push event received:', {
    repository: payload.repository.full_name,
    branch: payload.ref.replace('refs/heads/', ''),
    commits: payload.commits.length,
    pusher: payload.pusher.name,
  });

  // Here you could:
  // - Trigger CI/CD pipelines
  // - Update documentation
  // - Send notifications to team
  // - Update product information based on code changes
}

async function handlePullRequestEvent(payload: any) {
  console.log('Pull request event:', {
    action: payload.action,
    number: payload.pull_request.number,
    title: payload.pull_request.title,
    repository: payload.repository.full_name,
  });

  // Handle PR events like opened, closed, merged
  if (payload.action === 'opened') {
    // Could trigger automated testing or notifications
  } else if (payload.action === 'closed' && payload.pull_request.merged) {
    // Handle merge events - could trigger deployments
  }
}

async function handleReleaseEvent(payload: any) {
  console.log('Release event:', {
    action: payload.action,
    tag: payload.release.tag_name,
    name: payload.release.name,
    repository: payload.repository.full_name,
  });

  // Handle release events - could update version information
  if (payload.action === 'published') {
    // Could update product versions, trigger deployments, etc.
  }
}

async function handleIssueEvent(payload: any) {
  console.log('Issue event:', {
    action: payload.action,
    number: payload.issue.number,
    title: payload.issue.title,
    repository: payload.repository.full_name,
  });

  // Handle issue events - could integrate with customer support
  if (payload.action === 'opened') {
    // Could create support tickets or notifications
  }
}

async function handleDeploymentEvent(payload: any) {
  console.log('Deployment event:', {
    environment: payload.deployment.environment,
    status: payload.deployment_status?.state,
    repository: payload.repository.full_name,
  });

  // Handle deployment events - could update deployment status
}

/* eslint-enable @typescript-eslint/no-explicit-any */
