/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:c4iUjAabnR8y@ep-withered-bush-a1q5x3i0.ap-southeast-1.aws.neon.tech/interviewbit?sslmode=require',
    }
};