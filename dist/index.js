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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
function trackingBodyValidation(req, res, next) {
    var _a;
    if (!req.body.eventName) {
        return res.status(400).json({
            message: "Validation failed",
            details: {
                error: {
                    message: "'eventName' is required.",
                },
            },
        });
    }
    if (((_a = req.body.eventName) === null || _a === void 0 ? void 0 : _a.length) < 4) {
        return res.status(400).json({
            message: "Validation failed",
            details: {
                error: {
                    message: "'eventName' needs to be atleast 4 charecter long.",
                },
            },
        });
    }
    // other complex validation, i would use a library
    next();
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express_1.default.json());
        // Register API routes
        app.use("/api/v1/trackings", trackingBodyValidation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newEvent = yield prisma.event.create({
                    data: {
                        name: req.body.eventName,
                    },
                });
                res.status(200).json({
                    message: "Event saved",
                    details: {
                        requestPayload: Object.assign({}, req.body),
                        newEvent,
                    },
                });
            }
            catch (err) {
                console.log(err.message);
                res.status(400).json({ message: err.message });
            }
        }));
        // Catch unregistered routes
        app.all("*", (req, res) => {
            res.status(404).json({ error: `Route ${req.originalUrl} not found` });
        });
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$connect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
