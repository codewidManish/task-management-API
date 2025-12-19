import { whitelist } from "validator";

const whitelistDomains = ["http://localhost:3000", "http://localhost:5173"]; // Add your frontend URLs here

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelistDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200
};

export default corsOptions;
