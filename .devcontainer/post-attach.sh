#!/usr/bin/env bash
pnpm install

pnpm setup

FILE=./.env
if [[ -f "$FILE" ]]; then
    echo ".env file already created"
else
    while [[ -z "$openapikey" ]]; do
        read -p "OPENAI_API_KEY: " openapikey
    done    
    read -p "LANGCHAIN_API_KEY: " langchainapikey

    cat << EOF >> ./.env
DATABASE_URL=postgresql://localhost:5432/campaign-tracker?sslmode=require
OPENAI_API_KEY=$openapikey
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY=$langchainapikey
LANGCHAIN_PROJECT=campaign-tracker-$(cut -d @ -f 1 <<< "$email")
EOF
fi

