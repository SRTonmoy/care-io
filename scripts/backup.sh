#!/bin/bash

# MongoDB backup script
set -e

echo "📦 Starting MongoDB backup..."

# Load environment variables
source .env.production

# Create backup directory if it doesn't exist
mkdir -p backups

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/careio_${TIMESTAMP}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump MongoDB database
mongodump \
  --uri="$MONGODB_URI" \
  --out="$BACKUP_DIR"

echo "✅ Backup created: ${BACKUP_DIR}"

# Compress backup
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "✅ Backup compressed: ${BACKUP_DIR}.tar.gz"

# Upload to S3 (if configured)
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_S3_BUCKET" ]; then
    echo "Uploading to S3..."
    aws s3 cp "${BACKUP_DIR}.tar.gz" s3://${AWS_S3_BUCKET}/database-backups/
    echo "✅ Backup uploaded to S3"
fi

# Keep only last 7 days of backups
find backups -name "careio_*.tar.gz" -mtime +7 -delete

echo "✅ Backup process completed!"