import "dotenv/config";

export default {
  adapter: "postgresql",
  url: process.env.DATABASE_URL,
};
