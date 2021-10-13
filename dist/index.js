"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeServer = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_service_1 = __importDefault(require("./services/user.service"));
const express_2 = __importDefault(require("express"));
const dotenv = require('dotenv');
dotenv.config();
const app = express_1.default();
const port = process.env.PORT || '3333';
app.use(express_1.default.json());
app.use(cors_1.default());
mongoose_1.default.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use('/user', user_service_1.default);
// Test route
app.use('/ok', express_2.default().get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () { return res.sendStatus(200); })));
const server = app.listen(port, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${port}`);
});
exports.server = server;
function closeServer() {
    server.close();
}
exports.closeServer = closeServer;
//# sourceMappingURL=index.js.map