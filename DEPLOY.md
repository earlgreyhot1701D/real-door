# Deploy — RealDoor (Amazon Bedrock)

Two supported paths. AWS-native is the cleaner all-AWS option (no static keys). Vercel also works.

## Model access (simplified since late 2025)

Bedrock models are **auto-enabled** — no manual "Model access" or "Model catalog" step. You just need:
1. Correct IAM permissions (`bedrock:InvokeModel` + `aws-marketplace:Subscribe` for first invoke).
2. **Anthropic only (one-time):** submit the use case form via the Bedrock console (click any Anthropic model in the model catalog, fill the short form). Applies account-wide.

### Recommended model

| Model | Inference Profile ID | Status |
|-------|---------------------|--------|
| **Claude Sonnet 4.6** | `us.anthropic.claude-sonnet-4-6` | ✅ Active (recommended) |
| Claude Sonnet 4.5 | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` | ✅ Active |
| Claude Sonnet 5 | `us.anthropic.claude-sonnet-5` | ✅ Active |
| Claude Sonnet 4 (original) | `us.anthropic.claude-sonnet-4-20250514-v1:0` | ⚠️ Legacy-locked if unused 30+ days |

Confirm available profiles: `aws bedrock list-inference-profiles --region us-east-1 --query "inferenceProfileSummaries[?contains(inferenceProfileId,'sonnet')]"`

## Option A — AWS-native (recommended, IAM role, no static keys)
1. Host the Next.js app on AWS Amplify Hosting, App Runner, or Lambda (via a Next.js adapter).
2. Attach an **IAM role** to the compute with a least-privilege policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       { "Effect": "Allow", "Action": "bedrock:InvokeModel", "Resource": "*" },
       { "Effect": "Allow", "Action": ["aws-marketplace:Subscribe", "aws-marketplace:ViewSubscriptions"], "Resource": "*" }
     ]
   }
   ```
3. Set environment variables (server-side): `AWS_REGION=us-east-1`, `BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6`, `APP_ORIGIN`. Do NOT set access keys; the role provides credentials.
4. Leave `USE_MOCK_MODEL` unset (or `0`) in production.

## Option B — Vercel + Bedrock API key (simplest, recommended)
1. Push to Git, import into Vercel (Next.js auto-detected).
2. Generate a Bedrock long-term API key:
   - Go to the [Bedrock console](https://console.aws.amazon.com/bedrock/) in `us-east-1`
   - Left nav → **API keys**
   - Click the **Long-term API keys** tab → **Generate long-term API keys**
   - Set an expiration (e.g. 90 days) → **Generate**
   - Copy the key (shown once)
3. Set env vars in Vercel Project Settings (server-side, NOT `NEXT_PUBLIC_`):
   | Key | Value |
   |-----|-------|
   | `AWS_REGION` | `us-east-1` |
   | `BEDROCK_MODEL_ID` | `us.anthropic.claude-sonnet-4-6` |
   | `AWS_BEARER_TOKEN_BEDROCK` | *(your Bedrock API key)* |
   | `APP_ORIGIN` | `https://your-app.vercel.app` |
4. Leave `USE_MOCK_MODEL` unset in production.

No IAM user, no access key/secret key pair needed. The AWS SDK reads `AWS_BEARER_TOKEN_BEDROCK` automatically.

## Option C — Vercel + IAM user keys (legacy)
1. Push to Git, import into Vercel.
2. Create an IAM user with the policy from Option A. Generate access keys:
   - IAM console → Users → your user → Security credentials tab → Access keys section → **Create access key**
   - On the "best practices" page, choose **Other** → Next
   - (Optional) Add a description tag → **Create access key**
   - Copy both the Access key ID and Secret access key (download .csv)
3. Set env vars in Vercel (server-side):
   | Key | Value |
   |-----|-------|
   | `AWS_REGION` | `us-east-1` |
   | `BEDROCK_MODEL_ID` | `us.anthropic.claude-sonnet-4-6` |
   | `AWS_ACCESS_KEY_ID` | *(from above)* |
   | `AWS_SECRET_ACCESS_KEY` | *(from above)* |
   | `APP_ORIGIN` | `https://your-app.vercel.app` |
4. Leave `USE_MOCK_MODEL` unset in production. Rotate the keys after the event.

## Local development

If you have `~/.aws/credentials` with a `[default]` profile, the SDK picks it up automatically. Just set in `.env.local`:
```env
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6
USE_MOCK_MODEL=0
APP_ORIGIN=http://localhost:3000
```
No `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` needed locally.

## Pre-deploy checklist (run the pre-ship hook, fix every red)
1. Route access scoped to app origin (CORS locked via middleware, no wildcard).
2. Input validation + sanitization, client AND server.
3. CORS locked to `APP_ORIGIN`.
4. Rate limiting active on `/api/extract` and `/api/rules`.
5. (Password reset - N/A this phase; renter auth is v2.)
6. Frontend error handling, no blank screens on any failure.
7. DB indexes - N/A (no database this phase).
8. Logging structured, metadata only, no raw document contents.
9. Alarms/monitoring - STUB (wire CloudWatch before real data).
10. Rollback plan (below).
11. Prompt-injection protection verified by test.
12. IAM principal least-privilege (`bedrock:InvokeModel` only); no broad AWS permissions.

## Rollback plan
- AWS-native: keep prior versions (Amplify keeps deployment history; App Runner/Lambda keep versions/aliases). Roll back by promoting the last known-good version.
- Vercel: Deployments → pick last known-good → "Promote to Production."
- Keep `main` green: only merge blocks that pass their QA checkpoint.
- Emergency switch: set `USE_MOCK_MODEL=1` to keep the journey demoable while you fix a model/SDK break forward.

## Post-deploy smoke test
Run the six-step acceptance demo against the live URL before sharing it.
