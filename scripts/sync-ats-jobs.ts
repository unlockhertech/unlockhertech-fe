#!/usr/bin/env node

/**
 * Unlock Her Tech - Automated ATS Partner Sync Script
 * 
 * Fetches active roles from Greenhouse, Lever, and Ashby partner boards,
 * validates mandatory compensation transparency and workplace clarity,
 * and formats them for the Unlock Her Tech Job Board.
 *
 * Usage:
 *   npx tsx scripts/sync-ats-jobs.ts
 */

import fs from "node:fs";
import path from "node:path";
import { syncAllAtsPartners, VETTED_ATS_PARTNERS } from "../src/app/utils/atsSync.js";

async function main() {
  console.log("=================================================");
  console.log("🚀 Unlock Her Tech: ATS & Public API Ingestion Engine");
  console.log("=================================================");
  console.log(`Configured Partners: ${VETTED_ATS_PARTNERS.map((p) => p.company).join(", ")}, RemoteOK, Remotive, and Arbeitnow APIs\n`);

  try {
    const startTime = Date.now();
    const syncedJobs = await syncAllAtsPartners(VETTED_ATS_PARTNERS, {
      maxJobsPerCompany: 6,
    });

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Successfully synced ${syncedJobs.length} active opportunities in ${durationSec}s.\n`);

    console.log("Sample Ingested Roles with Matched Requisitions:");
    syncedJobs.slice(0, 8).forEach((job, idx) => {
      console.log(` ${idx + 1}. [${job.company}] ${job.title}`);
      console.log(`    - Category: ${job.category} | Workplace: ${job.remoteStatus}`);
      console.log(`    - Direct ATS Link: ${job.applyUrl}`);
      console.log(`    - Salary: ${job.salaryRange}`);
      console.log(`    - Description Preview: ${job.description.slice(0, 100)}...\n`);
    });

    // Save to data/vetted-jobs.json
    const outputPath = path.resolve(process.cwd(), "data", "vetted-jobs.json");
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(syncedJobs, null, 2), "utf-8");
    console.log(`💾 Saved ${syncedJobs.length} live verified jobs to: ${outputPath}`);

    console.log("\n✨ ATS & Public API Sync completed successfully.");
  } catch (error) {
    console.error("❌ ATS Sync failed:", error);
    process.exit(1);
  }
}

main();
