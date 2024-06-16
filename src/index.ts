import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const prisma = new PrismaClient();

const app: Express = express();
const port = process.env.PORT || 3000;

function trackingBodyValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
  if (req.body.eventName?.length < 4) {
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

async function main() {
  app.use(express.json());

  // Register API routes
  app.use(
    "/api/v1/trackings",
    trackingBodyValidation,
    async (req: Request, res: Response) => {
      try {
        const newEvent = await prisma.event.create({
          data: {
            name: req.body.eventName,
          },
        });
        res.status(200).json({
          message: "Event saved",
          details: {
            requestPayload: {
              ...req.body,
            },
            newEvent,
          },
        });
      } catch (err: any) {
        res.status(400).json({ message: err.message });
      }
    }
  );

  // Catch unregistered routes
  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });