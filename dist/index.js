"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import cors
const review_routes_1 = __importDefault(require("./routes/review.routes")); // Import review routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001; // Using 3001 to avoid conflict if frontend uses 3000
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Enable CORS for all routes
// Mount review routes
app.use("/api/reviews", review_routes_1.default);
app.get("/", (req, res) => {
    res.send("Flex Living Reviews Dashboard Backend is running!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
