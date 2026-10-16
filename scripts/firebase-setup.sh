#!/usr/bin/env bash
#
# One-shot Firebase setup for the portfolio.
#
# Everything here except the project creation has already been prepared:
# firestore.rules has the owner email filled in, firebase.json points at it,
# and .firebaserc names the project. This script does the parts that need
# the console or your machine.
#
# Run it after clearing the GCP project quota:
#   https://console.cloud.google.com/projectpicker   -> delete unused projects
#   https://support.google.com/code/contact/project_quota_increase
#
# Usage:  ./scripts/firebase-setup.sh

set -euo pipefail

cd "$(dirname "$0")/.."

PROJECT_ID="dpp-portfolio-hub"

echo "==> 1. Create the project (needs quota)"
firebase projects:create "$PROJECT_ID"

echo
echo "==> 2. Enable Firestore in PRODUCTION mode"
echo "    Production matters: in test mode every read/write is allowed for 30"
echo "    days, which would leave the contact form world-readable. Disable it"
echo "    explicitly here:"
echo "      https://console.firebase.google.com/project/$PROJECT_ID/firestore"
echo
echo "    Press Enter once Firestore is created in production mode."
read -r _

echo
echo "==> 3. Register the web app and copy the config"
echo "      https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
echo "      > Your apps > Web > (</>)"
echo "    Put the six values into .env.local under the NEXT_PUBLIC_FIREBASE_*"
echo "    keys. .env.local is gitignored - never paste them anywhere else."
echo
echo "    Press Enter once .env.local is filled in."
read -r _

echo
echo "==> 4. Deploy the security rules"
firebase deploy --only firestore:rules --project "$PROJECT_ID"

echo
echo "==> 5. Generate a service account key (admin access, for seeding)"
echo "      https://console.firebase.google.com/project/$PROJECT_ID/settings/serviceaccounts"
echo "    Download the JSON, then store it OUTSIDE this repo and point at it:"
echo "      set GOOGLE_APPLICATION_CREDENTIALS=C:\\secure\\path\\service-account.json"
echo
echo "    Press Enter once the key is saved outside the repo."
read -r _

echo
echo "==> 6. Seed the projects collection"
npm run seed

echo
echo "==> 7. Rebuild and deploy so the browser bundle has the Firebase config"
./scripts/deploy.sh

echo
echo "Verify before you tell anyone the contact form works:"
echo "  1. Submit a message through the live form"
echo "  2. Read it back: https://console.firebase.google.com/project/$PROJECT_ID/firestore"
echo "  3. The rules should still deny client reads - check the console read"
echo "     works while the browser cannot, which is the whole point of them"
echo
echo "Then the cover-letter line about deployed security rules is true."