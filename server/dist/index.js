"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./db/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const plans_1 = __importDefault(require("./routes/plans"));
const vendors_1 = __importDefault(require("./routes/vendors"));
const serviceRequests_1 = __importDefault(require("./routes/serviceRequests"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL }));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/plans', plans_1.default);
app.use('/api/vendors', vendors_1.default);
app.use('/api/requests', serviceRequests_1.default);
app.use('/api/admin', admin_1.default);
app.get('/api/health', async (req, res) => {
    try {
        await index_1.default.query('SELECT NOW()');
        res.json({ status: 'ok', message: 'Server and database are running' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
