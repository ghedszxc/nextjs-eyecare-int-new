import fs from "fs";
import path from "path";

const envPath = process.env.NODE_ENV === "production" ? "" : "_preview";
const configPathFile = path.join(
  process.cwd(),
  "config_transitions" + envPath + ".json",
);
let runtimeConfig = {};

try {
  if (fs.existsSync(configPathFile)) {
    const data = fs.readFileSync(configPathFile, { encoding: "utf8" });
    runtimeConfig = JSON.parse(data);
    console.log("Loaded Config:", runtimeConfig);
  }
} catch (error) {
  console.error("Error reading config file:", error);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [],
  },
  env: {
    GRAPHQL_URL: runtimeConfig.GRAPHQL_URL || "",
    AKAMAY_PATH: runtimeConfig.AKAMAY_PATH || "",
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;
