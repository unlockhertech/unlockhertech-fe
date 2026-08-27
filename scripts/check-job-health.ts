#!/usr/bin/env node

/**
 * Unlock Her Tech - Automated 404 & Link Health Checker Script
 * 
 * Verifies all active job links, detects closed requisitions, 404s,
 * or redirects to generic career homepages, and flags/archives stale postings.
 *
 * Usage:
 *   npx tsx scripts/check-job-health.ts
 */

import { CURATED_SEED_JOBS } from "../src/app/utils/jobsSanity.js";
import { checkAllJobsHealth } from "../src/app/utils/linkHealthChecker.js";

async function main() {
  console.log("=================================================");
  console.log("🔍 Unlock Her Tech: Job Link Health & 404 Checker");
  console.log("=================================================");
  console.log(`Checking ${CURATED_SEED_JOBS.length} active job listings...\n`);

  try {
    const report = await checkAllJobsHealth(CURATED_SEED_JOBS, {
      timeoutMs: 6000,
      concurrency: 4,
    });

    console.log("Health Check Results:");
    console.log("-------------------------------------------------");
    report.results.forEach((r) => {
      const statusIcon = r.isAvailable ? "✅ LIVE" : "❌ STALE / CLOSED";
      console.log(`[${statusIcon}] ${r.company} - ${r.title}`);
      console.log(`  URL: ${r.applyUrl}`);
      if (!r.isAvailable) {
        console.log(`  Reason: ${r.reason}`);
      }
      console.log("");
    });

    console.log("=================================================");
    console.log("📊 Summary Report:");
    console.log(`  • Total Checked:    ${report.summary.totalChecked}`);
    console.log(`  • Available (Live): ${report.summary.availableCount}`);
    console.log(`  • Stale / Closed:   ${report.summary.staleCount}`);
    console.log("=================================================");

    if (report.staleJobIds.length > 0) {
      console.log(`\n⚠️ Identified ${report.staleJobIds.length} stale jobs to archive:`);
      report.staleJobIds.forEach((id) => console.log(`  - ${id}`));
    } else {
      console.log("\n🎉 All active job postings verified accessible and live!");
    }
  } catch (error) {
    console.error("❌ Link health checker failed:", error);
    process.exit(1);
  }
}

await main();
