#!/bin/bash
# APEX AURA: Auto-Commit Script for Authenticity Review

# 1. Check for staged changes
if ! git diff --cached --quiet; then
  echo "Staged changes detected."
  
  # 2. Get the diff
  DIFF=$(git diff --cached)
  
  # 3. Generate summary (mocking local LLM for now, can be replaced with curl to local API)
  # For hackathon demonstration, we'll extract the first file changed as a simple summary if no LLM is available
  # In a real setup, this would be: SUMMARY=$(curl -s http://localhost:11434/api/generate -d "{\"model\": \"llama3\", \"prompt\": \"Summarize this git diff in one line: $DIFF\"}")
  
  FILES_CHANGED=$(git diff --cached --name-only | head -n 1)
  SUMMARY="[AI Message] Auto-commit: Updates to $FILES_CHANGED and related files."
  
  echo "Generated Summary: $SUMMARY"
  
  # 4. Commit and push
  git commit -m "$SUMMARY"
  git push origin main
  
  echo "Changes committed and pushed successfully."
else
  echo "No staged changes to commit."
fi
