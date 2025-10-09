import { psql } from "./database.js";
export const initSchema = async () => {
    try {
        await psql `
			CREATE TABLE IF NOT EXISTS albums(
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description VARCHAR(255) NOT NULL,
				thumbnail VARCHAR(255) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;
        await psql `
			CREATE TABLE IF NOT EXISTS songs(
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description VARCHAR(255) NOT NULL,
				thumbnail VARCHAR(255),
				audio VARCHAR(255) NOT NULL,
				album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;
        console.log("Database tables initialized successfully");
    }
    catch (error) {
        console.error("Error intializing database tables:", error);
    }
};
//# sourceMappingURL=initialize-schema.js.map