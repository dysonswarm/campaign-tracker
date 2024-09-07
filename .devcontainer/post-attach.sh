#!/usr/bin/env bash
pnpm install

read -p "Enter Git Name: " name

read -p "Enter Git Email: " email
git config --global user.name "$name"
git config --global user.email "$email"
git config --list