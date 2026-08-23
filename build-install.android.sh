#!/bin/bash

GREEN="\e[32m"
BLUE="\e[34m"
YELLOW="\e[33m"
RED="\e[31m"
RESET="\e[0m"

echo -e "${BLUE}🎨 Generating cross-platform icons & splash...${RESET}"
npx capacitor-assets generate || { echo -e "${RED}❌ Asset generation failed${RESET}"; exit 1; }

echo -e "${YELLOW}📦 Building Angular app...${RESET}"
ng build > /dev/null 2>&1 || { echo -e "${RED}❌ Angular build failed${RESET}"; exit 1; }

echo -e "${YELLOW}🔄 Syncing Capacitor...${RESET}"
npx cap sync android || { echo -e "${RED}❌ Capacitor sync failed${RESET}"; exit 1; }

echo -e "${YELLOW}🏗️ Building Android APK...${RESET}"
cd android || { echo -e "${RED}❌ Could not enter android folder${RESET}"; exit 1; }
./gradlew assembleDebug || { echo -e "${RED}❌ Gradle build failed${RESET}"; exit 1; }

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

echo -e "${YELLOW}📲 Installing APK on device...${RESET}"
adb install -r "$APK_PATH" || { echo -e "${RED}❌ APK install failed${RESET}"; exit 1; }

echo -e "${GREEN}✅ Done! App rebuilt & installed with updated icons/splash.${RESET}"
