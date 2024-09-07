#!/usr/bin/env bash
pnpm install

read -p "Enter Git Name: " name

read -p "Enter Git Email: " email
git config --global user.name "$name"
git config --global user.email "$email"

read -p "OPENAI_API_KEY: " openapikey
read -p "LANGCHAIN_API_KEY: " langchainapikey

touch ./.env
echo "DATABASE_URL=postgresql://localhost:5432/campaign-tracker?sslmode=require
OPENAI_API_KEY=$openapikey
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY=$langchainapikey
LANGCHAIN_PROJECT=campaign-tracker-$(cut -d @ -f 1 <<< "$email")" >> ./.env